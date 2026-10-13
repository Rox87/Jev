from flask import Flask, request, jsonify
import requests
import json
import os

app = Flask(__name__, static_url_path='', static_folder='static')

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_career_advice(user_profile):
    if not OPENROUTER_API_KEY:
        return {"error": "API Key do OpenRouter não configurada no servidor."}

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
        return {"error": f"Erro na API ({response.status_code})", "details": response.text}

    return response.json().get("answers", {})

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/advice', methods=['POST'])
def advice():
    data = request.json
    if not data or 'profile' not in data:
        return jsonify({"error": "O texto do perfil é obrigatório"}), 400
    
    answers = get_career_advice(data['profile'])
    if "error" in answers:
        return jsonify(answers), 500
        
    return jsonify(answers)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
