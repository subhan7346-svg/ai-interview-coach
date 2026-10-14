import { useState, useEffect } from "react";
import './App.css'
async function testBackend() {
  try {
    const response = await fetch("http://127.0.0.1:8001/");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Backend connection failed:", error);
  }
}
const interviewQuestions = [
  'Tell me about yourself.',
  'Why did you choose this career?',
  'What are your greatest strengths?',
  'What is one weakness you are working on?',
  'Why should we hire you?'
]

function App() { 
  useEffect(() => {
    testBackend();
    getQuestions();
  }, []);
   async function getQuestions() {
    try {

      const response = await fetch("http://127.0.0.1:8001/questions");
      const data = await response.json();
      console.log(data.questions);
      setQuestions(data.questions);
    } catch (error) {
      console.log("Questions fetch failed:", error);
    }
  }

  const [screen, setScreen] = useState('home')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [type, setType] = useState('')
  const [questions, setQuestions] = useState([])
  const [questionCount, setQuestionCount] = useState('5')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const handleStart = () => {
    if (!role || !experience || !type) {
      alert('Please select all interview options.')
      return
    }
    setResults([])
    setCurrentQuestion(0)
    setAnswer('')
    setSubmitted(false)
    setScreen('interview')
  }

  const handleSubmit = async () => {
  if (!answer.trim()) {
    alert('Please write your answer first.')
    return
  }

  try {
    setLoading(true)
    console.log("Submitting answer...")
      const response = await fetch("http://127.0.0.1:8001/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: questions[currentQuestion],
        answer: answer
      })
    })

    const data = await response.json()
    console.log("AI response:", data)
    const scoreMatch = data.feedback.match(/Score:\s*(\d+(?:\.\d+)?)\/10/i)
    const score = scoreMatch ? Number(scoreMatch[1]) : 0
    setFeedback(data.feedback)
    setResults((prevResults) => [
  ...prevResults,
  {
    question: questions[currentQuestion],
    answer: answer,
    feedback: data.feedback,
    score: score
  }
])
    setSubmitted(true)
    setLoading(false)
  } catch (error) {
  console.log("Feedback fetch failed:", error)
  setLoading(false)
  }
}

  const nextQuestion = () => {
    if (currentQuestion < Number(questionCount) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswer('')
      setSubmitted(false)
    } else {
      setScreen('complete')
    }
  }
  const overallScore =
  results.length > 0
    ? (
        results.reduce((total, result) => total + result.score, 0) /
        results.length
      ).toFixed(1)
    : 0
  return (
    <div className="app">

      {/* HOME */}
      {screen === 'home' && (
        <>
          <nav className="navbar">
            <div className="logo">AI Interview Coach</div>

            <button
              className="nav-button"
              onClick={() => setScreen('setup')}
            >
              Start Practice
            </button>
          </nav>

          <section className="hero">
            <h1>
              Ace Your Next <span>Interview</span>
            </h1>

            <p>
              Practice realistic interviews with an AI coach,
              improve your answers, and build confidence before
              your real interview.
            </p>

            <button
              className="start-button"
              onClick={() => setScreen('setup')}
            >
              Start Interview
            </button>
          </section>

          <section className="features">

            <div className="card">
              <h3>🤖 AI Interviewer</h3>
              <p>
                Practice realistic interview questions
                for your selected career.
              </p>
            </div>
            <div className="card">
              <h3>📊 Smart Feedback</h3>
              <p>
                Improve your answers and communication
                with useful feedback.
              </p>
            </div>

            <div className="card">
              <h3>🎯 Career Practice</h3>
              <p>
                Prepare for HR, technical and behavioral
                interviews.
              </p>
            </div>

          </section>
        </>
      )}

      {/* SETUP */}
      {screen === 'setup' && (
        <section className="setup-page">

          <div className="setup-card">

            <button
              className="back-button"
              onClick={() => setScreen('home')}
            >
              ← Back
            </button>

            <h1>Interview Setup</h1>

            <p>
              Configure your interview before starting.
            </p>

            <label>Job Role</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="AI / Machine Learning">
                AI / Machine Learning
              </option>
            </select>

            <label>Experience Level</label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Select experience</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>

            <label>Interview Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select interview type</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Technical Interview">
                Technical Interview
              </option>
              <option value="Behavioral Interview">
                Behavioral Interview
              </option>
              <option value="Mixed Interview">
                Mixed Interview
              </option>
            </select>

            <label>Number of Questions</label>

            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            >
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
              <option value="15">15 Questions</option>
            </select>

            <button
              className="start-button setup-start"
              onClick={handleStart}
            >
              Start Practice →
            </button>

          </div>

        </section>
      )}

      {/* INTERVIEW */}
      {screen === 'interview' && (
        <section className="interview-page">

          <div className="interview-card">

            <div className="interview-top">
              <span>AI Interview Coach</span>

              <span>
                Question {currentQuestion + 1} of {questionCount}
              </span>
            </div>

            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${((currentQuestion + 1) / Number(questions)) * 100}%`
                }}
              ></div>
            </div>

            <div className="question-box">
              <span className="question-label">
                INTERVIEW QUESTION
              </span>

              <h2>
                {questions[currentQuestion]}
              </h2>
            </div>

            <label className="answer-label">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows="8"
              disabled={submitted}
            ></textarea>

            {!submitted ? (
              <button
                className="start-button submit-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '🤖 Analyzing Answer...' : 'Submit Answer'}
              </button>
            ) : (
              <div className="feedback-box">

                <h3>🤖 AI Coach Feedback</h3>

                <p>
                  {feedback}
                </p>

                <button
                  className="start-button"
                  onClick={nextQuestion}
                >
                  {currentQuestion < questions.length - 1
                    ? 'Next Question →'
                    : 'Finish Interview'}
                </button>

              </div>
            )}

          </div>

        </section>
      )}

      {/* COMPLETE */}
      {screen === 'complete' && (
  <section className="complete-page">

    <div className="complete-card">

      <div className="success-icon">✓</div>

      <h1>Interview Complete!</h1>

      <p>
        Great job! You completed your practice interview.
        Here is your AI interview report.
      </p>

      <div className="final-report">

        <h2>📊 Your Interview Report</h2>
        <div className="overall-score">
         <h2>Overall Score: {overallScore}/10</h2>
        </div>
        {results.map((result, index) => (
          <div className="result-card" key={index}>

            <h3>Question {index + 1}</h3>

            <p>
              <strong>Question:</strong> {result.question}
            </p>

            <p>
              <strong>Your Answer:</strong> {result.answer}
            </p>

            <div className="result-feedback">
              <strong>🤖 AI Feedback:</strong>
              <p>{result.feedback}</p>
            </div>

          </div>
        ))}

      </div>

      <button
        className="start-button"
        onClick={() => setScreen('home')}
      >
        Back to Home
      </button>

    </div>

  </section>
)}

    </div>
  )
}

export default App