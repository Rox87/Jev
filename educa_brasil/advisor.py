import requests
import json
import os

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_career_advice(user_profile):
    """
    Usa a API Decisions (Jev) para analisar o perfil do usuário e sugerir um caminho de carreira.
    """
    if not OPENROUTER_API_KEY:
        print("ERRO: A variável de ambiente OPENROUTER_API_KEY não está definida.")
        print("Defina-a usando: $env:OPENROUTER_API_KEY=\"sua_chave\" (Windows) ou export OPENROUTER_API_KEY=\"sua_chave\" (Linux/Mac)")
        return None

    response = requests.post(
        url="https://openrouter.ai/api/alpha/decisions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "~typesafe/jev-latest",
            "state": user_profile,
            "questions": {
                "career_area": {
                    "type": "choice",
                    "instructions": "Which broad career area best fits this profile?",
                    "criteria": {
                        "technology": "Software, Data, IT, Engineering",
                        "health": "Medicine, Nursing, Psychology, Biology",
                        "business": "Management, Finance, Marketing, HR, Strategy",
                        "arts_humanities": "Design, Writing, History, Education, Arts"
                    }
                },
                "needs_postgrad": {
                    "type": "noul",
                    "instructions": "Does this user need a postgraduate degree (Master's, PhD, or Specialization) to achieve their stated goals?",
                    "criteria": {
                        "true": "Requires advanced degree, specialization or formal academic training",
                        "false": "Can enter the field directly, already has enough education, or only needs short practical courses"
                    }
                },
                "readiness_score": {
                    "type": "score",
                    "instructions": "How ready is the user to enter their desired job market right now?",
                    "criteria": ["Not ready at all / Needs major pivot", "Needs some preparation or specific skills", "Highly ready / Good to go"]
                }
            }
        })
    )

    if response.status_code != 200:
        print(f"Erro na API: {response.status_code}")
        print(response.text)
        return None

    return response.json().get("answers", {})

if __name__ == "__main__":
    print("🎓 Bem-vindo ao Orientador Vocacional e Educacional (Jev Lab) 🎓")
    print("---------------------------------------------------------------")
    
    # Exemplo de perfil ou entrada interativa
    print("Descreva seu perfil, interesses e objetivos.")
    print("Exemplo: 'Gosto muito de analisar dados e tendências, me formei em administração mas sinto que falta conhecimento técnico para as vagas de cientista de dados que tenho visto.'")
    
    # Você pode descomentar a linha abaixo para tornar interativo:
    # user_input = input("\nDigite seu perfil: ")
    
    # Usando um perfil fixo para demonstração
    user_input = "Gosto muito de analisar dados e tendências, me formei em administração mas sinto que falta conhecimento técnico para as vagas de cientista de dados que tenho visto."
    
    print(f"\nAnalisando o seguinte perfil:\n'{user_input}'\n")
    print("Aguarde, consultando a IA (Jev)...")
    
    answers = get_career_advice(user_input)
    
    if answers:
        area = answers["career_area"]["choice"]
        area_probs = answers["career_area"]["probabilities"]
        needs_postgrad_prob = answers["needs_postgrad"]["noul"]
        readiness = answers["readiness_score"]["score"]
        
        print("\n📊 RESULTADOS DA ANÁLISE 📊")
        print("---------------------------")
        print(f"🎯 Área de Carreira Recomendada: {area.upper()}")
        print("   Probabilidades por área:")
        for k, v in area_probs.items():
            print(f"     - {k.capitalize()}: {v:.2%}")
        
        print(f"\n📚 Necessidade de Pós-graduação (Probabilidade): {needs_postgrad_prob:.2%}")
        if needs_postgrad_prob > 0.75:
            print("   -> SUGESTÃO: É altamente recomendável buscar uma pós-graduação, mestrado ou especialização para alcançar seus objetivos.")
        elif needs_postgrad_prob > 0.40:
            print("   -> SUGESTÃO: Uma especialização pode ajudar, mas considere também certificações, bootcamps ou projetos práticos.")
        else:
            print("   -> SUGESTÃO: O ingresso direto no mercado ou cursos rápidos parecem ser o melhor caminho agora. Pós-graduação não é estritamente necessária.")
            
        print(f"\n🚀 Nível de Preparo Atual (Score 0-1): {readiness:.2f}")
        if readiness > 0.7:
            print("   -> AVALIAÇÃO: Você parece estar bem preparado(a) para atuar na área! Atualize o currículo e comece a aplicar.")
        elif readiness > 0.4:
            print("   -> AVALIAÇÃO: Você tem uma boa base, mas precisa desenvolver habilidades específicas ou ganhar um pouco mais de experiência prática.")
        else:
            print("   -> AVALIAÇÃO: Será necessário um bom tempo de preparo, estudo ou uma transição de carreira estruturada.")
