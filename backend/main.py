from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
class AnswerRequest(BaseModel):
    question: str
    answer: str

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Interview Coach Backend is running"}


@app.get("/questions")
def get_questions():
    return {
        "questions": [
            "Tell me about yourself.",
            "Why did you choose this career?",
            "What are your greatest strengths?",
            "What is one weakness you are working on?",
            "Why should we hire you?",
            "Where do you see yourself in five years?",
            "Why do you want to work for our company?",
            "Tell me about a challenging situation you faced.",
            "How do you handle pressure and deadlines?",
            "Why should we choose you for this position?",
            "How do you work as part of a team?",
            "Tell me about a time you solved a difficult problem.",
            "How do you manage your time and priorities?",
            "What motivates you to do your best work?",
            "Do you have any questions for us?"
        ]
    }


@app.post("/feedback")
def get_feedback(data: AnswerRequest):
    try:
        prompt = f"""
You are an AI interview coach.

Interview question:
{data.question}

Candidate answer:
{data.answer}

Evaluate the candidate's interview answer.

Give short, helpful feedback in simple English.

Include:
1. Score out of 10
2. What was good
3. What could be improved
4. A better example answer

Use this exact format:

Score: X/10

What was good:
Your feedback here.

What could be improved:
Your feedback here.

Better example answer:
Your improved answer here.

Be fair when giving the score.
Keep the feedback concise and professional.
"""

        response = requests.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "llama3.2:3b",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        result = response.json()

        return {
            "feedback": result["response"]
        }

    except Exception as e:
        return {
            "feedback": f"AI Error: {str(e)}"
        }