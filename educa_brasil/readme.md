# Jev Edu: Orientador Vocacional IA (Web App)

Aplicação web moderna e responsiva que utiliza o modelo `~typesafe/jev-latest` da API Decisions do [OpenRouter](https://openrouter.ai/) para atuar como um conselheiro vocacional de alta precisão, agora com suporte completo a **Tema Claro** e **Tema Escuro** e interface redesenhada de ponta a ponta.

A aplicação analisa o background, interesses e objetivos do usuário, calculando e apresentando três dimensões analíticas:

1. **Área de Carreira Recomendada (`choice`)**: Classifica o alinhamento em Tecnologia, Saúde & Biológicas, Negócios & Gestão ou Artes & Humanidades, com gráfico de barras de probabilidades.
2. **Necessidade de Pós-Graduação (`noul`)**: Probabilidade de o usuário precisar de uma pós-graduação, mestrado ou especialização formal para atuar na área. Mostrado via medidor SVG de precisão (gauge semicircular).
3. **Nível de Prontidão de Mercado (`score`)**: Medidor escalonado (0.00 a 1.00) avaliando o quão pronto o usuário está para ingressar nas vagas da área.
4. **Plano de Ação Estratégico (Roadmap)**: Três diretrizes práticas sintetizadas para acelerar a trajetória do profissional.

---

## ✨ Destaques do Novo Design do Frontend

- 🌓 **Temas Escuro e Claro Dinâmicos**: Alternância instantânea com um clique, transições suaves, contraste certificado WCAG e persistência da preferência no navegador (`localStorage`), com respeito automático às preferências do sistema (`prefers-color-scheme`).
- ⚡ **Chips de Perfis Rápidos (Presets)**: Permite testar a aplicação com um clique em perfis pré-configurados (Dev para IA, Gestão para Data Science, Design para UX, Enfermagem para Saúde Digital).
- 🧭 **Feedback Tátil & Micro-interações**: Botões com retorno tátil ao clique (`:active`), animações com curvas de aceleração naturais (padrão Emil Kowalski) e suporte completo a `prefers-reduced-motion`.
- 📊 **Visualização Gráfica Aprimorada**:
  - Velocímetro / Gauge SVG vetorial com arco gradiente.
  - Barras de probabilidade ordenadas dinamicamente com destaque para o perfil dominante.
  - Indicador de carregamento multi-estágio com radar visual.
- 📋 **Exportação Rápida & Modo Demonstração**: Botão para copiar o relatório sumarizado para a área de transferência com toast elegante, além de fallback de simulação demonstrativa para testes offline sem chave de API.

---

## 📁 Estrutura de Arquivos

```text
edu/
├── app.py              # Backend Flask (Servidor e integração com API OpenRouter)
├── advisor.py          # Script utilitário / CLI
├── static/             # Frontend Modernizado
│   ├── index.html      # Estrutura semântica com suporte a temas e acessibilidade
│   ├── styles.css      # Sistema de design (Tokens CSS para Dark & Light, animações e layout)
│   └── script.js       # Gerenciamento de temas, presets, renderização SVG e chamadas de API
└── readme.md           # Documentação do projeto
```

---

## 🛠️ Como Executar

1. **Instale os requisitos:**
   ```bash
   pip install flask requests
   ```

2. **Configure sua Chave de API (Opcional para testes com modo demo):**
   - **Windows (PowerShell)**:
     ```powershell
     $env:OPENROUTER_API_KEY="sua_chave_aqui"
     ```
   - **Linux / Mac**:
     ```bash
     export OPENROUTER_API_KEY="sua_chave_aqui"
     ```

3. **Inicie o Servidor Flask:**
   ```bash
   cd edu
   python app.py
   ```

4. **Acesse a Aplicação:**
   Abra no seu navegador: [http://127.0.0.1:5000](http://127.0.0.1:5000)

*(Nota: Caso execute a aplicação sem uma chave de API, o frontend oferece a opção de carregar uma simulação demonstrativa para validar todos os componentes visuais e animações imediatamente).*
