import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Code, Bot, BookOpen, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: '✨',
      title: 'Code Generation',
      desc: 'Generate clean, production-ready code from natural language prompts using Google Gemini AI.',
    },
    {
      icon: '📚',
      title: 'Code Explanation',
      desc: 'Paste any code and get a clear, beginner-friendly explanation of what it does and how it works.',
    },
    {
      icon: '🤖',
      title: 'AI Agent',
      desc: 'Give complex tasks to the AI agent. It breaks them into steps and executes each one sequentially.',
    },
    {
      icon: '🔍',
      title: 'RAG Chat',
      desc: 'Upload your codebase and chat with it. Get answers based on your actual code using vector search.',
    },
  ]

  return (
    <div className="landing">
      <Navbar />

      <section className="landing-hero">
        <h1 className="landing-hero-title">PromptPilot</h1>
        <p className="landing-hero-subtitle">
          An AI-powered developer workspace with agentic code generation and RAG-based codebase chat.
        </p>
        <div className="landing-hero-buttons">
          <Link to="/signup" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
        </div>
      </section>

      <section className="landing-features">
        <div className="features-container">
          <h2 className="features-title">What Can PromptPilot Do?</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2 className="cta-title">Ready to code smarter?</h2>
        <p className="cta-subtitle">Join developers using AI to build faster and better.</p>
        <Link to="/signup" className="btn-primary">Start for Free</Link>
      </section>
    </div>
  )
}