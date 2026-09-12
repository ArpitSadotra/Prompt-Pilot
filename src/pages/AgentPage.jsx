import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Play, Copy, Loader, CheckCircle, Circle, Clock } from 'lucide-react'
import api from '../services/api'

export default function AgentPage() {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState([])
  const [results, setResults] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [done, setDone] = useState(false)

  const handleRun = async () => {
    if (!task.trim()) return
    setLoading(true)
    setError('')
    setPlan([])
    setResults([])
    setCurrentStep(-1)
    setDone(false)

    try {
      const res = await api.post('/api/agent/run', { task })
      setPlan(res.data.plan)
      setResults(res.data.results)
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Agent failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyOutput = (text) => {
    navigator.clipboard.writeText(text)
  }

  const exampleTasks = [
    'Build a REST API for a todo app with CRUD operations',
    'Create a complete authentication system with JWT',
    'Build a React dashboard with charts and data tables',
    'Create a Node.js file upload system with validation',
  ]

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="agent-header animate-fadeIn">
            <h1 className="agent-title"> AI Agent</h1>
            <p className="text-muted text-sm">
              Describe a complex task. The agent will plan and execute it step by step.
            </p>
          </div>

          <div className="agent-input-section">
            <label className="form-label">Your Task</label>
            <textarea
              className="agent-textarea"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Build a complete REST API for a blog app with posts, comments and authentication..."
            />

            <div style={{ marginBottom: '12px' }}>
              <p className="text-sm text-muted" style={{ marginBottom: '8px' }}>
                💡 Example tasks:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {exampleTasks.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTask(t)}
                    className="btn-secondary btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRun}
              disabled={loading || !task.trim()}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {loading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Agent Running...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Run Agent
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {(loading || plan.length > 0) && (
            <div className="agent-grid">
              {/* Steps Panel */}
              <div className="agent-steps-panel">
                <h3 className="agent-steps-title">
                  {loading ? '⏳ Planning...' : '✅ Execution Plan'}
                </h3>

                {loading && plan.length === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="step-item">
                        <div className="step-number pending">
                          <Circle size={12} />
                        </div>
                        <span className="step-text">Waiting...</span>
                      </div>
                    ))}
                  </div>
                )}

                {plan.map((step, i) => {
                  const isCompleted = results[i]?.completed
                  return (
                    <div key={i} className="step-item">
                      <div className={`step-number ${isCompleted ? 'done' : 'pending'}`}>
                        {isCompleted
                          ? <CheckCircle size={14} />
                          : loading ? <Clock size={12} /> : <Circle size={12} />
                        }
                      </div>
                      <span className={`step-text ${isCompleted ? 'active' : ''}`}>
                        {step}
                      </span>
                    </div>
                  )
                })}

                {done && (
                  <div style={{
                    marginTop: '16px',
                    padding: '8px',
                    background: 'rgba(0,217,255,0.1)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'var(--color-accent)',
                  }}>
                    ✅ All steps completed!
                  </div>
                )}
              </div>

              {/* Output Panel */}
              <div className="agent-output-panel">
                <h3 className="agent-output-title">
                  {loading ? 'Executing steps...' : `Generated Output (${results.length} steps)`}
                </h3>

                {loading && results.length === 0 && (
                  <div className="agent-empty">
                    <div className="spinner"></div>
                    <p className="text-muted text-sm">Agent is working on your task...</p>
                  </div>
                )}

                {results.map((result, i) => (
                  <div key={i} className="agent-result-item">
                    <div className="agent-result-header">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>✅ {result.step}</span>
                        <button
                          onClick={() => copyOutput(result.output)}
                          className="icon-btn"
                          style={{ width: '28px', height: '28px' }}
                          title="Copy"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="agent-result-body">
                      {result.output}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && plan.length === 0 && (
            <div className="agent-empty" style={{ background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', borderRadius: '12px' }}>
              <span style={{ fontSize: '48px' }}>🤖</span>
              <h3 style={{ fontSize: 'var(--font-size-lg)' }}>AI Agent Ready</h3>
              <p className="text-muted text-sm" style={{ maxWidth: '400px' }}>
                Describe a complex coding task above. The agent will break it into steps and execute each one, building a complete solution.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  )
}