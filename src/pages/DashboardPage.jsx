import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) return navigate('/login')
    setUser(JSON.parse(userData))
  }, [])

  const cards = [
    {
      icon: '',
      title: 'Code Playground',
      desc: 'Generate code from prompts or get explanations for any code snippet.',
      path: '/playground',
    },
    {
      icon: '',
      title: 'AI Agent',
      desc: 'Give complex tasks to the agent. It plans and executes step by step.',
      path: '/agent',
    },
    {
      icon: '',
      title: 'RAG Chat',
      desc: 'Upload your codebase and ask questions. Get context-aware answers.',
      path: '/rag',
    },
  ]

  if (!user) return null

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-header animate-fadeIn">
            <h1 className="dashboard-title">Welcome, {user.name}! 👋</h1>
            <p className="dashboard-subtitle">What would you like to build today?</p>
          </div>

          <div className="dashboard-grid">
            {cards.map((card, i) => (
              <button
                key={i}
                className="dashboard-card"
                onClick={() => navigate(card.path)}
              >
                <div className="dashboard-card-icon">{card.icon}</div>
                <h3 className="dashboard-card-title">{card.title}</h3>
                <p className="dashboard-card-desc">{card.desc}</p>
              </button>
            ))}
          </div>

          <div className="dashboard-info">
            <h2 className="dashboard-info-title"> How It Works</h2>
            <ul className="dashboard-info-list">
              <li> <strong>Playground</strong> - Type a prompt and get instant code generation or paste code for explanation</li>
              <li> <strong>AI Agent</strong> - Describe a complex task and watch the agent execute it step by step</li>
              <li> <strong>RAG Chat</strong> - Upload your code files and ask questions about your specific codebase</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  )
}