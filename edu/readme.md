# Jev Edu: Orientador Vocacional IA (Web App)

Esta é uma aplicação web moderna que utiliza o modelo `~typesafe/jev-latest` da API Decisions do [OpenRouter](https://openrouter.ai/) para atuar como um conselheiro de carreira com uma interface gráfica premium (glassmorphism e animações).

A aplicação analisa o background, interesses e objetivos do usuário, e retorna visualmente três métricas:

1. **Área de Carreira Recomendada (`choice`)**: Classifica o perfil em Tecnologia, Saúde, Negócios ou Artes.
2. **Necessidade de Pós-Graduação (`noul`)**: Probabilidade de o usuário precisar de uma pós-graduação ou mestrado para atuar na área. Mostrado via medidor (gauge).
3. **Nível de Preparo (`score`)**: Um medidor progressivo mostrando o quão pronto o usuário está para o mercado.

## 📁 Estrutura

```text
edu/
├── app.py              # Backend Flask (Servidor e integração com API Jev)
├── static/             # Arquivos de Frontend
│   ├── index.html      # Estrutura HTML
│   ├── styles.css      # Estilos CSS Vanilla (Premium Design)
│   └── script.js       # Lógica do lado do cliente (chamadas e animações DOM)
└── readme.md           # Esta documentação
```

## 🛠️ Como usar

1. **Instale os requisitos:**
   A aplicação utiliza o microframework `Flask` e a biblioteca `requests`.
   ```bash
   pip install flask requests
   ```

2. **Configure a Chave de API:**
   Defina sua chave de API do OpenRouter no ambiente.
   - **Windows (PowerShell)**: `$env:OPENROUTER_API_KEY="sua_chave"`
   - **Linux/Mac**: `export OPENROUTER_API_KEY="sua_chave"`

3. **Inicie o Servidor Backend:**
   Navegue até a pasta `edu` e execute o servidor Flask.
   ```bash
   cd edu
   python app.py
   ```

4. **Acesse a Aplicação:**
   Abra seu navegador e acesse: [http://127.0.0.1:5000](http://127.0.0.1:5000)

O frontend interativo fará as requisições para o Flask, que por sua vez se comunica com a API Jev de forma segura no backend!
