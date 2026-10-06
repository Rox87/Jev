from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from typing import Any, Dict

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

OPENROUTER_DECISIONS_URL = "https://openrouter.ai/api/alpha/decisions"


@dataclass(frozen=True)
class DecisionResult:
    is_urgent_prob: float
    department: str
    department_probabilities: Dict[str, float]
    frustration_score: float

    @classmethod
    def from_api_response(cls, answers: Dict[str, Any]) -> DecisionResult:
        """Converte e valida a resposta da API Jev com fallbacks seguros."""
        is_urgent = answers.get("is_urgent", {})
        dept = answers.get("department", {})
        frust = answers.get("frustration", {})

        return cls(
            is_urgent_prob=float(is_urgent.get("noul", 0.0)),
            department=dept.get("choice", "unknown"),
            department_probabilities=dept.get("probabilities", {}),
            frustration_score=float(frust.get("score", 0.0)),
        )


class JevClassifierClient:
    """Cliente HTTP com pool de conexões e política de retentativas."""

    def __init__(
        self,
        api_key: str | None = None,
        timeout: float = 30.0,
        site_url: str = "http://localhost",
        app_name: str = "Jev-Router",
    ) -> None:
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError(
                "OPENROUTER_API_KEY não encontrada no ambiente e nem fornecida."
            )

        self.timeout = timeout
        self.session = requests.Session()

        # Estratégia de Retry com backoff exponencial para instabilidades transitórias
        retry_strategy = Retry(
            total=3,
            backoff_factor=1.0,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("https://", adapter)

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": site_url,
            "X-OpenRouter-Title": app_name,
        }

    def classify_ticket(
        self, text: str, model: str = "~typesafe/jev-latest"
    ) -> DecisionResult:
        payload = {
            "model": model,
            "state": text,
            "questions": {
                "is_urgent": {
                    "type": "noul",
                    "instructions": "Does this message convey urgency?",
                    "criteria": {
                        "true": "Explicitly time-sensitive",
                        "false": "No urgency expressed",
                    },
                },
                "department": {
                    "type": "choice",
                    "instructions": "Which team should handle this?",
                    "criteria": {
                        "billing": "Payments, invoicing, refunds",
                        "technical": "Bugs, outages, integrations",
                        "sales": "Pricing, upgrades, new accounts",
                    },
                },
                "frustration": {
                    "type": "score",
                    "instructions": "How frustrated is the customer?",
                    "criteria": ["Calm", "Frustrated", "Very angry"],
                },
            },
        }

        response = self.session.post(
            OPENROUTER_DECISIONS_URL,
            headers=self.headers,
            json=payload,
            timeout=self.timeout,
        )

        # Captura corpo de erro detalhado caso a API rejeite
        if not response.ok:
            raise requests.HTTPError(
                f"Erro na API {response.status_code}: {response.text}",
                response=response,
            )

        data = response.json()
        return DecisionResult.from_api_response(data.get("answers", {}))

    def close(self) -> None:
        self.session.close()


def route_ticket(decision: DecisionResult) -> None:
    """Regra determinística de negócio isolada da camada de rede."""
    print(f"Prob. Urgência: {decision.is_urgent_prob:.2f}")
    print(
        f"Departamento: {decision.department} {decision.department_probabilities}"
    )
    print(f"Nível de Frustração: {decision.frustration_score:.2f}")

    if decision.is_urgent_prob > 0.8 and decision.department == "billing":
        print(
            "==> [AÇÃO] Escalando com prioridade máxima para a equipe de Faturamento!"
        )
    elif decision.frustration_score >= 0.75:
        print("==> [AÇÃO] Alerta de retenção: cliente com alto atrito detectado.")
    else:
        print(
            f"==> [AÇÃO] Encaminhando fluxo normal para fila: {decision.department}"
        )


if __name__ == "__main__":
    client = JevClassifierClient()
    try:
        mensagem = "Help! My payouts have been failing for 3 days."
        resultado = client.classify_ticket(mensagem)
        route_ticket(resultado)
    except Exception as exc:
        print(f"Falha na classificação: {exc}", file=sys.stderr)
    finally:
        client.close()