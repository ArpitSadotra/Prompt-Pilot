import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Send, Copy, Loader, RotateCcw } from 'lucide-react'
import api from '../services/api'

export default function PlaygroundPage() {
  const [mode, setMode] = useState('generate')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    setOutput('')

    try {
      const endpoint = mode === 'generate' ? '/api/ai/generate' : '/api/ai/explain'
      const payload = mode === 'generate' ? { prompt: input } : { code: input }
      const res = await api.post(endpoint, payload)
      setOutput(res.data.response)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="playground-header animate-fadeIn">
            <h1 className="playground-title">Code Playground</h1>
            <p className="text-muted text-sm">Generate code from prompts or explain existing code</p>
          </div>

          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'generate' ? 'active' : ''}`}
              onClick={() => { setMode('generate'); handleReset() }}
            >
              ✨ Generate Code
            </button>
            <button
              className={`mode-tab ${mode === 'explain' ? 'active' : ''}`}
              onClick={() => { setMode('explain'); handleReset() }}
            >
              📚 Explain Code
            </button>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="playground-grid">
            {/* Input Panel */}
            <div className="editor-panel">
              <div className="panel-header">
                <span className="panel-title">
                  {mode === 'generate' ? '📝 Your Prompt' : '💻 Your Code'}
                </span>
                <button onClick={handleReset} className="icon-btn" title="Reset">
                  <RotateCcw size={16} />
                </button>
              </div>

              <textarea
                className="editor-textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'generate'
                    ? 'e.g. Create a React authentication form with email and password validation...'
                    : 'Paste your code here to get a detailed explanation...'
                }
                style={{ flex: 1 }}
              />

              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="btn-primary btn-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? (
                  <>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    {mode === 'generate' ? 'Generating...' : 'Explaining...'}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {mode === 'generate' ? 'Generate Code' : 'Explain Code'}
                  </>
                )}
              </button>
            </div>

            {/* Output Panel */}
            <div className="editor-panel">
              <div className="panel-header">
                <span className="panel-title">
                  {mode === 'generate' ? '⚡ Generated Code' : '📖 Explanation'}
                </span>
                <div className="panel-actions">
                  {output && (
                    <button onClick={handleCopy} className="icon-btn" title="Copy">
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="output-empty">
                  <div className="spinner"></div>
                  <p className="text-muted text-sm">AI is thinking...</p>
                </div>
              ) : output ? (
                <div className="output-panel">
                  {copied && (
                    <div className="alert alert-success" style={{ marginBottom: '8px' }}>
                      Copied to clipboard!
                    </div>
                  )}
                  {output}
                </div>
              ) : (
                <div className="output-empty">
                  <span style={{ fontSize: '40px' }}>
                    {mode === 'generate' ? '✨' : '📚'}
                  </span>
                  <p className="text-muted text-sm">
                    {mode === 'generate'
                      ? 'Your generated code will appear here'
                      : 'Code explanation will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}