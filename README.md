# AI Interview Coach

An AI-powered web application that helps users practice job interviews and improve their answers with instant AI-generated feedback.

## Features

- Practice common interview questions.
- Choose interview role, experience level, and interview type.
- Submit answers and receive AI-generated feedback.
- Get an individual score out of 10.
- View a final interview report with an overall score.
- Responsive user interface for desktop and mobile screens.

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Python
- FastAPI

**AI**
- Ollama
- Llama 3.2 (3B)

## How It Works

1. Select your interview preferences.
2. Answer the interview questions.
3. Submit each answer for AI evaluation.
4. Review feedback and your score.
5. View your final report after completing the interview.

## Run Locally

### 1. Start Ollama

Make sure Ollama is installed and the `llama3.2:3b` model is available.

### 2. Start the backend

Open a terminal in the backend folder:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --port 8001
```

### 3. Start the frontend

Open another terminal in the frontend folder:

```powershell
npm run dev
```

### 4. Open the application

Visit `http://localhost:5173/` in your browser.

## Project Purpose

This project demonstrates frontend development, backend API integration, and local AI-powered interview feedback.

## Future Improvements

- User accounts and interview history.
- More interview question categories.
- Exportable interview reports.
- Voice-based interview practice.
- More detailed performance analytics.

---

**Note:** AI-generated feedback is intended for practice and guidance. Scores may not always reflect a real interviewer's evaluation.