document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const profileInput = document.getElementById('profile-input');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    const errorPanel = document.getElementById('error-message');

    analyzeBtn.addEventListener('click', async () => {
        const profile = profileInput.value.trim();
        
        if (!profile) {
            showError("Por favor, descreva seu perfil primeiro.");
            return;
        }

        // Reset UI
        errorPanel.classList.add('hidden');
        resultsSection.classList.add('hidden');
        loadingState.classList.remove('hidden');
        analyzeBtn.disabled = true;

        try {
            const response = await fetch('/api/advice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ profile })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Ocorreu um erro na análise.");
            }

            renderResults(data);
            
            loadingState.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            
            // Scroll para os resultados
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            loadingState.classList.add('hidden');
            showError(err.message);
        } finally {
            analyzeBtn.disabled = false;
        }
    });

    function renderResults(data) {
        // 1. Área Recomendada
        const areaMain = document.getElementById('res-area-main');
        const areaProbs = document.getElementById('res-area-probs');
        
        const choice = data.career_area.choice;
        areaMain.textContent = choice.toUpperCase();

        areaProbs.innerHTML = '';
        const probs = data.career_area.probabilities;
        
        // Sort probabilities
        const sortedProbs = Object.entries(probs).sort((a, b) => b[1] - a[1]);
        
        sortedProbs.forEach(([key, value]) => {
            const pct = (value * 100).toFixed(1);
            areaProbs.innerHTML += `
                <div class="prob-item">
                    <span class="prob-label">${capitalize(key)}</span>
                    <div class="prob-bar-container">
                        <div class="prob-bar" style="width: 0%" data-target="${pct}%"></div>
                    </div>
                    <span class="prob-value">${pct}%</span>
                </div>
            `;
        });

        // 2. Necessidade de Pós-graduação
        const postgradPct = data.needs_postgrad.noul;
        const gaugeFill = document.getElementById('postgrad-gauge');
        const gaugeValue = document.getElementById('res-postgrad-pct');
        const postgradText = document.getElementById('res-postgrad-text');
        
        const pctValue = Math.round(postgradPct * 100);
        gaugeValue.textContent = `${pctValue}%`;
        
        // C é a circunferência do semi-círculo = Math.PI * r = ~125.6
        // offset = C - (C * pct)
        const offset = 125.6 - (125.6 * postgradPct);
        
        // Set colors based on value
        let gaugeColor = 'var(--success-color)';
        if (postgradPct > 0.4) gaugeColor = 'var(--warning-color)';
        if (postgradPct > 0.75) gaugeColor = 'var(--danger-color)'; // Red means Highly needed here
        
        gaugeFill.style.stroke = gaugeColor;
        
        setTimeout(() => {
            gaugeFill.style.strokeDashoffset = offset;
        }, 100);

        if (postgradPct > 0.75) {
            postgradText.textContent = "É altamente recomendável buscar uma pós-graduação, mestrado ou especialização para alcançar seus objetivos.";
        } else if (postgradPct > 0.40) {
            postgradText.textContent = "Uma especialização pode ajudar, mas considere também certificações, bootcamps ou projetos práticos.";
        } else {
            postgradText.textContent = "O ingresso direto no mercado ou cursos rápidos parecem ser o melhor caminho agora. Pós-graduação não é estritamente necessária.";
        }

        // 3. Readiness Score
        const readiness = data.readiness_score.score;
        const rBar = document.getElementById('readiness-bar');
        const rVal = document.getElementById('res-readiness-val');
        const rText = document.getElementById('res-readiness-text');

        rVal.textContent = readiness.toFixed(2);
        
        setTimeout(() => {
            rBar.style.width = `${readiness * 100}%`;
        }, 100);

        if (readiness > 0.7) {
            rText.textContent = "Você parece estar bem preparado(a) para atuar na área! Atualize o currículo e comece a aplicar.";
        } else if (readiness > 0.4) {
            rText.textContent = "Você tem uma boa base, mas precisa desenvolver habilidades específicas ou ganhar um pouco mais de experiência prática.";
        } else {
            rText.textContent = "Será necessário um bom tempo de preparo, estudo ou uma transição de carreira bem estruturada.";
        }

        // Animate prob bars
        setTimeout(() => {
            document.querySelectorAll('.prob-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-target');
            });
        }, 100);
    }

    function showError(msg) {
        errorPanel.textContent = msg;
        errorPanel.classList.remove('hidden');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
    }
});
