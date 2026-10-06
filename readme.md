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

### Exemplo de Saída Esperada

No terminal, você verá os resultados da análise. O comportamento esperado para a frase de testes sobre pagamentos falhando deve ser parecido com:

```text
0.95
billing {'technical': 0.12, 'billing': 0.88, 'sales': 0}
1.04
```

Abaixo dos `prints`, o código ainda possui um exemplo básico de roteamento que verifica se a probabilidade de urgência é maior que 80% (`> 0.8`) e se o departamento é o de cobrança (`"billing"`) para realizar uma possível escalação.
