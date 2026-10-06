# Jev Lab: Classificador de Mensagens com OpenRouter API

Esta é uma aplicação simples em Python que demonstra como utilizar a API **Decisions** do [OpenRouter](https://openrouter.ai/). A aplicação usa o modelo `~typesafe/jev-latest` para analisar e classificar mensagens de suporte ao cliente de forma estruturada, facilitando a automação de fluxos de trabalho e roteamento de tickets.

## 🚀 Visão Geral

O script [`jev-lab.py`](jev-lab.py) envia uma mensagem de exemplo (ex: *"Help! My payouts have been failing for 3 days."*) e faz perguntas predefinidas para a IA, exigindo respostas tipadas (não apenas texto livre):

1. **Urgência (`is_urgent`)**: Utiliza o tipo `noul` para retornar uma probabilidade (0 a 1) se a mensagem transmite urgência.
2. **Departamento (`department`)**: Utiliza o tipo `choice` para determinar qual equipe (Cobrança, Técnica ou Vendas) deve tratar o caso, trazendo junto as distribuições de probabilidade de cada categoria.
3. **Frustração (`frustration`)**: Utiliza o tipo `score` para avaliar o nível de frustração do cliente com base em critérios de estado emocional ("Calm", "Frustrated", "Very angry").

## 🛠️ Pré-requisitos

- Python 3.x
- O script depende da biblioteca `requests` para realizar a comunicação HTTP.

Você pode instalar a dependência necessária utilizando o pip:

```bash
pip install requests
```
*(Nota: O arquivo `requirements.txt` cita `openrouter`, mas a implementação atual faz chamadas diretas à API REST via `requests`.)*

## ⚙️ Configuração

Para executar o script, você precisa de uma chave de API válida do OpenRouter.

1. Cadastre-se ou faça login em [openrouter.ai](https://openrouter.ai/).
2. Acesse a seção de chaves (Keys) e gere uma nova API Key.
3. Exponha essa chave no seu ambiente de terminal.

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="sua_chave_de_api_aqui"
```

**Linux/Mac:**
```bash
export OPENROUTER_API_KEY="sua_chave_de_api_aqui"
```

## ▶️ Como Executar

Com as dependências instaladas e a variável de ambiente configurada, execute:

```bash
python jev-lab.py
```

## 🎯 O que cada variável faz:

Cada uma dessas variáveis representa um tipo diferente de métrica ou julgamento estatístico:

1. answers["is_urgent"]["noul"]
Conceito: Avaliação binária ou de confirmação condicional (No / Yes ou Null/Odds-Underlying-Likelihood).

Significado: Na especificação do Jev, perguntas de presença/ausência (como "isto é urgente?") retornam um valor calibrado de probabilidade/log-odds ou uma indicação de veredito negativo/positivo (daí a sigla interna associada a noul / probabilidade não-nula).

O que faz: Mede a certeza estatística (geralmente um valor escalar decimal entre 0.0 e 1.0, semelhante ao cancel_prob do seu código original) de que a interação precisa de atendimento prioritário/imediato.

2. answers["department"]["choice"] e answers["department"]["probabilities"]
Conceito: Classificação multiclasse (roteamento categórico).

["choice"]: O rótulo ou departamento vencedor previsto pelo modelo (por exemplo: "billing", "support", "sales" ou "cancellation"). É a categoria com maior score após a distribuição probabilística.

["probabilities"]: Um dicionário contendo a distribuição de probabilidade (softmax/calibrada) entre todas as opções cadastradas, por exemplo:

JSON
{
  "billing": 0.82,
  "support": 0.15,
  "sales": 0.03
}

Permite implementar regras de fallback (ex.: transferir para um humano se a probabilidade da classe vencedora for inferior a 0.60).

3. answers["frustration"]["score"]
Conceito: Regressão ou escala contínua de sentimento/atrito.

Significado: Ao invés de uma escolha discreta, este campo mede o nível de insatisfação, irritação ou atrito percebido na mensagem do cliente.

O que faz: Retorna um valor numérico contínuo (geralmente em uma escala de 0.0 a 1.0 ou 0 a 100). Um score elevado (ex.: > 0.75) serve de gatilho para acionar supervisores ou priorizar o ticket antes que haja churn/cancelamento.

Resumo do Fluxo no Jev
Essas variáveis funcionam em conjunto para roteamento inteligente de chamados e mensagens:

department define para onde a mensagem deve ir.

is_urgent define a fila de prioridade do atendimento.

frustration orienta o tom da abordagem ou o escalonamento para um atendente sênior.
