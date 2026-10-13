/**
 * Jev Edu - Frontend Logic & Theme Controller
 * Modern Interactive UI with Emil Kowalski Micro-interaction Principles
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // DOM Element References
    // -------------------------------------------------------------------------
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-text');
    
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const profileInput = document.getElementById('profile-input');
    const charCounter = document.getElementById('char-counter');
    const presetChips = document.querySelectorAll('.preset-chip');
    
    const loadingState = document.getElementById('loading-state');
    const loadingStatusText = document.getElementById('loading-status-text');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    
    const resultsSection = document.getElementById('results-section');
    const errorCard = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const useMockBtn = document.getElementById('use-mock-btn');
    
    const copySummaryBtn = document.getElementById('copy-summary-btn');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    let currentAnalysisData = null;
    let loadingInterval = null;

    // -------------------------------------------------------------------------
    // 1. Theme Management (Dark & Light Mode)
    // -------------------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem('jev_theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(systemPrefersDark ? 'dark' : 'light');
        }
    }

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('jev_theme', theme);
        if (themeLabel) {
            themeLabel.textContent = theme === 'dark' ? 'Escuro' : 'Claro';
        }
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Listen for system theme preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('jev_theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    initTheme();

    // -------------------------------------------------------------------------
    // 2. Preset Profiles & Quick Fillers
    // -------------------------------------------------------------------------
    const PRESETS = {
        tech: "Trabalho como desenvolvedor backend há 4 anos focado em Python e APIs. Tenho grande interesse em migrar para Inteligência Artificial aplicada, Machine Learning e MLOps. Gostaria de entender se preciso de uma pós-graduação acadêmica ou se certificações e projetos práticos são suficientes para me posicionar bem no mercado.",
        data: "Atuo como analista de processos e gestão há 3 anos. Utilizo Excel avançado, Power BI e possuo noções de SQL. Quero migrar definitivamente para a área de Ciência de Dados e Analytics estratégico para suporte à tomada de decisão corporativa.",
        design: "Sou designer gráfico com 5 anos de experiência em agências de comunicação e branding. Quero fazer transição para Product Design (UX/UI) em empresas de tecnologia e SaaS. Já conheço Figma, mas quero estruturar minhas competências analíticas e portfólio.",
        health: "Tenho formação em enfermagem e atuei em ambiente hospitalar por 2 anos. Quero fazer transição para a área de Gestão em Saúde Digital, Telemedicina ou Informática em Saúde, unindo meu conhecimento clínico ao ecossistema de tecnologia."
    };

    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const presetKey = chip.getAttribute('data-preset');
            if (PRESETS[presetKey]) {
                profileInput.value = PRESETS[presetKey];
                updateCharCounter();
                profileInput.focus();
                
                // Micro-feedback animation on chip
                chip.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    chip.style.transform = '';
                }, 140);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 3. Textarea Interactions & Character Counter
    // -------------------------------------------------------------------------
    function updateCharCounter() {
        const count = profileInput.value.length;
        charCounter.textContent = `${count} caracteres`;
        if (count < 30) {
            charCounter.style.color = 'var(--text-muted)';
        } else {
            charCounter.style.color = 'var(--accent-indigo)';
        }
    }

    profileInput.addEventListener('input', updateCharCounter);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            profileInput.value = '';
            updateCharCounter();
            profileInput.focus();
        });
    }

    // Shortcut: Ctrl+Enter or Cmd+Enter to submit
    profileInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            analyzeBtn.click();
        }
    });

    // -------------------------------------------------------------------------
    // 4. Loading State Sequencer
    // -------------------------------------------------------------------------
    function startLoadingSequence() {
        loadingState.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        errorCard.classList.add('hidden');
        analyzeBtn.disabled = true;

        const btnSpinner = analyzeBtn.querySelector('.btn-spinner');
        const btnArrow = analyzeBtn.querySelector('.btn-arrow-icon');
        if (btnSpinner) btnSpinner.classList.remove('hidden');
        if (btnArrow) btnArrow.classList.add('hidden');

        // Scroll to loading card
        loadingState.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Step progression messages
        const steps = [
            { text: "Vetorizando histórico e aspirações...", step: 1 },
            { text: "Calculando alinhamento com áreas vocacionais...", step: 2 },
            { text: "Avaliando métrica Noul para pós-graduação...", step: 2 },
            { text: "Mensurando prontidão de mercado com Jev Decisions...", step: 3 }
        ];

        let index = 0;
        step1.classList.add('active');
        step2.classList.remove('active');
        step3.classList.remove('active');
        loadingStatusText.textContent = steps[0].text;

        loadingInterval = setInterval(() => {
            index = (index + 1) % steps.length;
            loadingStatusText.textContent = steps[index].text;

            if (steps[index].step === 1) {
                step1.classList.add('active');
                step2.classList.remove('active');
                step3.classList.remove('active');
            } else if (steps[index].step === 2) {
                step1.classList.add('active');
                step2.classList.add('active');
                step3.classList.remove('active');
            } else {
                step1.classList.add('active');
                step2.classList.add('active');
                step3.classList.add('active');
            }
        }, 900);
    }

    function stopLoadingSequence() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
        loadingState.classList.add('hidden');
        analyzeBtn.disabled = false;

        const btnSpinner = analyzeBtn.querySelector('.btn-spinner');
        const btnArrow = analyzeBtn.querySelector('.btn-arrow-icon');
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (btnArrow) btnArrow.classList.remove('hidden');
    }

    // -------------------------------------------------------------------------
    // 5. Analysis Trigger & API Communication
    // -------------------------------------------------------------------------
    analyzeBtn.addEventListener('click', async () => {
        const profile = profileInput.value.trim();

        if (!profile) {
            showToast("Por favor, descreva seu perfil profissional antes de analisar.", true);
            profileInput.focus();
            return;
        }

        if (profile.length < 25) {
            showToast("Descreva com um pouco mais de detalhes para uma análise precisa.", true);
            profileInput.focus();
            return;
        }

        startLoadingSequence();

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
                const msg = data.error || `Erro de resposta do servidor (${response.status})`;
                throw new Error(msg);
            }

            currentAnalysisData = data;
            renderResults(data);
            stopLoadingSequence();
            resultsSection.classList.remove('hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            stopLoadingSequence();
            showError(err.message);
        }
    });

    // -------------------------------------------------------------------------
    // 6. Mock Data Generator (Offline / Fallback Mode)
    // -------------------------------------------------------------------------
    function generateMockData(profileText) {
        const lower = profileText.toLowerCase();
        let choice = "technology";
        let techProb = 0.72;
        let busProb = 0.15;
        let artsProb = 0.08;
        let healthProb = 0.05;
        let postgradVal = 0.35;
        let readinessVal = 0.75;

        if (lower.includes('saúde') || lower.includes('médic') || lower.includes('enferm')) {
            choice = "health";
            healthProb = 0.82;
            techProb = 0.10;
            busProb = 0.05;
            artsProb = 0.03;
            postgradVal = 0.78;
            readinessVal = 0.62;
        } else if (lower.includes('design') || lower.includes('arte') || lower.includes('ux') || lower.includes('gráfico')) {
            choice = "arts_humanities";
            artsProb = 0.78;
            techProb = 0.14;
            busProb = 0.06;
            healthProb = 0.02;
            postgradVal = 0.28;
            readinessVal = 0.81;
        } else if (lower.includes('gestão') || lower.includes('administra') || lower.includes('marketing') || lower.includes('finan')) {
            choice = "business";
            busProb = 0.75;
            techProb = 0.15;
            artsProb = 0.06;
            healthProb = 0.04;
            postgradVal = 0.55;
            readinessVal = 0.68;
        }

        return {
            career_area: {
                choice: choice,
                probabilities: {
                    technology: techProb,
                    health: healthProb,
                    business: busProb,
                    arts_humanities: artsProb
                }
            },
            needs_postgrad: {
                noul: postgradVal
            },
            readiness_score: {
                score: readinessVal
            }
        };
    }

    if (useMockBtn) {
        useMockBtn.addEventListener('click', () => {
            const profile = profileInput.value.trim() || PRESETS.tech;
            profileInput.value = profile;
            updateCharCounter();
            errorCard.classList.add('hidden');
            
            startLoadingSequence();
            setTimeout(() => {
                const mock = generateMockData(profile);
                currentAnalysisData = mock;
                renderResults(mock);
                stopLoadingSequence();
                resultsSection.classList.remove('hidden');
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                showToast("Diagnóstico demonstrativo carregado com sucesso!");
            }, 800);
        });
    }

    // -------------------------------------------------------------------------
    // 7. Results Renderer
    // -------------------------------------------------------------------------
    function renderResults(data) {
        // Area Labels & Icons Mapping
        const AREA_METADATA = {
            technology: { label: "Tecnologia", icon: "💻", color: "var(--accent-indigo)" },
            health: { label: "Saúde & Biológicas", icon: "🩺", color: "var(--status-success)" },
            business: { label: "Negócios & Gestão", icon: "📈", color: "var(--status-warning)" },
            arts_humanities: { label: "Artes & Humanidades", icon: "🎨", color: "#ec4899" }
        };

        // 1. Career Area (Choice)
        const choiceKey = (data.career_area && data.career_area.choice) ? data.career_area.choice : 'technology';
        const meta = AREA_METADATA[choiceKey] || { label: capitalize(choiceKey), icon: "🎯", color: "var(--accent-indigo)" };
        
        const areaMain = document.getElementById('res-area-main');
        const areaIcon = document.getElementById('res-area-icon');
        const areaProbs = document.getElementById('res-area-probs');
        const areaConfidence = document.getElementById('res-area-confidence');

        areaMain.textContent = meta.label;
        areaIcon.textContent = meta.icon;

        // Probabilities Breakdown
        const probs = (data.career_area && data.career_area.probabilities) ? data.career_area.probabilities : {};
        const sortedProbs = Object.entries(probs).sort((a, b) => b[1] - a[1]);

        if (sortedProbs.length > 0) {
            const topProb = sortedProbs[0][1];
            if (topProb >= 0.70) {
                areaConfidence.textContent = "Alinhamento Muito Forte";
            } else if (topProb >= 0.45) {
                areaConfidence.textContent = "Alinhamento Predominante";
            } else {
                areaConfidence.textContent = "Perfil Multidisciplinar";
            }
        }

        areaProbs.innerHTML = '';
        sortedProbs.forEach(([key, value], idx) => {
            const pct = (value * 100).toFixed(1);
            const itemMeta = AREA_METADATA[key] || { label: capitalize(key), icon: "•" };
            const isTop = idx === 0;

            const probRow = document.createElement('div');
            probRow.className = `prob-item ${isTop ? 'is-top' : ''}`;
            probRow.innerHTML = `
                <div class="prob-item-header">
                    <span class="prob-name">${itemMeta.icon} ${itemMeta.label}</span>
                    <span class="prob-pct mono-font">${pct}%</span>
                </div>
                <div class="prob-bar-track">
                    <div class="prob-bar-fill" style="width: 0%" data-target="${pct}%"></div>
                </div>
            `;
            areaProbs.appendChild(probRow);
        });

        // Trigger animation of probability bars
        setTimeout(() => {
            document.querySelectorAll('.prob-bar-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-target');
            });
        }, 80);

        // 2. Postgrad Need (Noul 0.0 - 1.0)
        const postgradPct = (data.needs_postgrad && typeof data.needs_postgrad.noul === 'number') 
            ? data.needs_postgrad.noul 
            : 0;

        const gaugeIndicator = document.getElementById('postgrad-gauge');
        const gaugePctText = document.getElementById('res-postgrad-pct');
        const gaugeBadge = document.getElementById('res-postgrad-badge');
        const postgradNarrative = document.getElementById('res-postgrad-text');

        const roundPct = Math.round(postgradPct * 100);
        gaugePctText.textContent = `${roundPct}%`;

        // SVG Arc calculation (r=80, length ≈ 251.3)
        const fullArc = 251.3;
        const targetOffset = fullArc - (fullArc * Math.min(Math.max(postgradPct, 0), 1));

        setTimeout(() => {
            gaugeIndicator.style.strokeDashoffset = targetOffset;
        }, 100);

        if (postgradPct > 0.65) {
            gaugeBadge.textContent = "Alta Recomendação";
            gaugeBadge.style.color = "var(--status-danger)";
            gaugeBadge.style.borderColor = "rgba(239, 68, 68, 0.4)";
            postgradNarrative.textContent = "Para seus objetivos, uma pós-graduação lato sensu, mestrado ou MBA trará o peso acadêmico e as redes de contatos indispensáveis para posições seniores.";
        } else if (postgradPct > 0.38) {
            gaugeBadge.textContent = "Moderada / Opcional";
            gaugeBadge.style.color = "var(--status-warning)";
            gaugeBadge.style.borderColor = "rgba(245, 158, 11, 0.4)";
            postgradNarrative.textContent = "Especializações modulares ou certificações de mercado podem suprir sua demanda de curto prazo, reservando um título acadêmico formal para um segundo momento.";
        } else {
            gaugeBadge.textContent = "Baixa Necessidade";
            gaugeBadge.style.color = "var(--status-success)";
            gaugeBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
            postgradNarrative.textContent = "O mercado atual valoriza muito mais projetos práticos, portfólio comprovado e resultados do que uma pós-graduação formal para esta etapa.";
        }

        // 3. Readiness Score (Score 0.00 - 1.00)
        const readiness = (data.readiness_score && typeof data.readiness_score.score === 'number')
            ? data.readiness_score.score
            : 0;

        const readinessValText = document.getElementById('res-readiness-val');
        const readinessBar = document.getElementById('readiness-bar');
        const readinessBadge = document.getElementById('res-readiness-badge');
        const readinessNarrative = document.getElementById('res-readiness-text');

        readinessValText.textContent = readiness.toFixed(2);

        setTimeout(() => {
            readinessBar.style.width = `${Math.min(Math.max(readiness * 100, 0), 100)}%`;
        }, 100);

        if (readiness >= 0.70) {
            readinessBadge.textContent = "Mercado Pronto";
            readinessBadge.style.color = "var(--status-success)";
            readinessBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
            readinessNarrative.textContent = "Você já possui repertório consistente. Seu foco deve ser otimizar sua narrativa de impacto, currículo e se candidatar ativamente a oportunidades.";
        } else if (readiness >= 0.42) {
            readinessBadge.textContent = "Base Sólida / Intermediário";
            readinessBadge.style.color = "var(--status-warning)";
            readinessBadge.style.borderColor = "rgba(245, 158, 11, 0.4)";
            readinessNarrative.textContent = "Você tem fundamentos transferíveis claros, mas precisa consolidar 1 ou 2 competências técnicas essenciais para fechar o gap de contratação.";
        } else {
            readinessBadge.textContent = "Em Transição / Inicial";
            readinessBadge.style.color = "var(--status-danger)";
            readinessBadge.style.borderColor = "rgba(239, 68, 68, 0.4)";
            readinessNarrative.textContent = "A distância entre o ponto atual e o objetivo exige um plano estruturado de capacitação de médio prazo antes de buscar posições diretas.";
        }

        // 4. Strategic Roadmap Generation
        updateStrategicRoadmap(meta.label, postgradPct, readiness);

        // Update timestamp
        const timestampElement = document.getElementById('results-timestamp');
        if (timestampElement) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            timestampElement.textContent = `Processado às ${timeStr} • Jev Decisions 2.0`;
        }
    }

    function updateStrategicRoadmap(areaLabel, postgradVal, readinessVal) {
        const title1 = document.getElementById('action-title-1');
        const desc1 = document.getElementById('action-desc-1');
        const title2 = document.getElementById('action-title-2');
        const desc2 = document.getElementById('action-desc-2');
        const title3 = document.getElementById('action-title-3');
        const desc3 = document.getElementById('action-desc-3');

        // Step 1: Learning
        title1.textContent = `Especialização em ${areaLabel}`;
        if (readinessVal >= 0.6) {
            desc1.textContent = "Foque em ferramentas de ponta e resolução de cases reais que demonstrem liderança técnica ou analítica.";
        } else {
            desc1.textContent = "Mapeie os 3 requisitos técnicos mais citados nas vagas-alvo e dedique 8 a 10 horas semanais à fundamentação.";
        }

        // Step 2: Academic & Credentials
        if (postgradVal > 0.5) {
            title2.textContent = "Planejamento de Formação Formal";
            desc2.textContent = "Pesquise programas conceituados com corpo docente conectado ao mercado para iniciar nos próximos 6 a 12 meses.";
        } else {
            title2.textContent = "Construção de Portfólio Ágil";
            desc2.textContent = "Priorize projetos práticos documentados e certificações rápidas em detrimento de pós-graduações tradicionais longas.";
        }

        // Step 3: Market Strategy
        title3.textContent = "Visibilidade e Posicionamento";
        if (readinessVal >= 0.7) {
            desc3.textContent = "Ative sua rede no LinkedIn, publique sobre sua área de atuação e inicie contato direto com tomadores de decisão.";
        } else {
            desc3.textContent = "Conecte-se com profissionais que já ocupam a vaga desejada para entender os desafios do dia a dia e refinar suas metas.";
        }
    }

    // -------------------------------------------------------------------------
    // 8. Error Display
    // -------------------------------------------------------------------------
    function showError(msg) {
        errorText.textContent = msg;
        errorCard.classList.remove('hidden');
        errorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // -------------------------------------------------------------------------
    // 9. Copy Summary Action & Toast System
    // -------------------------------------------------------------------------
    if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', () => {
            if (!currentAnalysisData) return;

            const area = currentAnalysisData.career_area ? currentAnalysisData.career_area.choice.toUpperCase() : 'N/A';
            const postgrad = currentAnalysisData.needs_postgrad ? Math.round(currentAnalysisData.needs_postgrad.noul * 100) : 0;
            const score = currentAnalysisData.readiness_score ? currentAnalysisData.readiness_score.score.toFixed(2) : '0.00';

            const summaryText = [
                "🎓 DIAGNÓSTICO VOCACIONAL JEV EDU",
                "----------------------------------------",
                `🎯 Área Recomendada: ${area}`,
                `📚 Necessidade de Pós-Graduação: ${postgrad}%`,
                `🚀 Nível de Prontidão de Mercado: ${score} / 1.00`,
                "----------------------------------------",
                "Gerado com modelo ~typesafe/jev-latest via Jev Decisions"
            ].join('\n');

            navigator.clipboard.writeText(summaryText)
                .then(() => {
                    showToast("Relatório copiado para a área de transferência!");
                })
                .catch(() => {
                    showToast("Não foi possível copiar automaticamente.", true);
                });
        });
    }

    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', () => {
            profileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            profileInput.focus();
        });
    }

    function showToast(msg, isError = false) {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = msg;
        if (isError) {
            toast.classList.add('toast-error');
        } else {
            toast.classList.remove('toast-error');
        }

        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3600);
    }

    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
    }
});
