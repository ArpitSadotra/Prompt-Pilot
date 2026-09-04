import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Upload, Send, Trash2, Loader, FileCode } from 'lucide-react'
import api from '../services/api'

export default function RAGPage() {
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', content: '' })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/api/rag/documents')
      setDocuments(res.data.documents)
    } catch (err) {
      console.error('Failed to fetch documents')
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.content) return
    setUploading(true)
    setError('')

    try {
      await api.post('/api/rag/upload', uploadForm)
      setUploadForm({ title: '', content: '' })
      setShowUpload(false)
      fetchDocuments()
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/rag/document/${id}`)
      fetchDocuments()
    } catch (err) {
      setError('Failed to delete document')
    }
  }

  const handleChat = async () => {
    if (!question.trim()) return
    if (documents.length === 0) {
      setError('Please upload at least one document first')
      return
    }

    const userMessage = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMessage])
    setQuestion('')
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/api/rag/chat', { question })
      const assistantMessage = { role: 'assistant', content: res.data.answer }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err.response?.data?.message || 'Chat failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleChat()
    }
  }

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className="rag-header animate-fadeIn">
            <h1 className="rag-title">🔍 RAG Chat</h1>
            <p className="text-muted text-sm">
              Upload your codebase and ask questions. AI answers based on your actual code.
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div className="rag-grid">
            {/* Upload Panel */}
            <div className="rag-upload-panel">
              <h3 className="rag-panel-title">📁 Your Documents</h3>

              {documents.length > 0 ? (
                <div className="rag-doc-list">
                  {documents.map((doc) => (
                    <div key={doc._id} className="rag-doc-item">
                      <FileCode size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                      <span className="rag-doc-name">{doc.title}</span>
                      <span className="rag-doc-chunks">{doc.chunks} chunks</span>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="icon-btn"
                        style={{ width: '24px', height: '24px', flexShrink: 0 }}
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-sm" style={{ marginBottom: '12px' }}>
                  No documents uploaded yet.
                </p>
              )}

              <button
                onClick={() => setShowUpload(!showUpload)}
                className="btn-primary btn-full btn-sm"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Upload size={14} />
                Upload Code
              </button>

              {showUpload && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label">File Title</label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="e.g. auth.js, App.jsx"
                    />
                  </div>
                  <div>
                    <label className="form-label">Paste Code Content</label>
                    <textarea
                      value={uploadForm.content}
                      onChange={(e) => setUploadForm({ ...uploadForm, content: e.target.value })}
                      placeholder="Paste your code here..."
                      style={{ minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      onClick={() => setShowUpload(false)}
                      className="btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0,217,255,0.05)', borderRadius: '8px', border: '1px solid rgba(0,217,255,0.1)' }}>
                <p className="text-sm" style={{ color: 'var(--color-accent)', marginBottom: '4px', fontWeight: '600' }}>
                  How RAG works:
                </p>
                <ol style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li className="text-sm text-muted">Upload your code files</li>
                  <li className="text-sm text-muted">We embed them into vectors</li>
                  <li className="text-sm text-muted">Ask questions about your code</li>
                  <li className="text-sm text-muted">AI searches relevant chunks</li>
                  <li className="text-sm text-muted">Get context-aware answers</li>
                </ol>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="rag-chat-panel">
              <h3 className="rag-panel-title" style={{ color: 'var(--color-text-muted)' }}>
                💬 Chat with your code
              </h3>

              <div className="rag-messages">
                {messages.length === 0 ? (
                  <div className="rag-empty">
                    <span style={{ fontSize: '40px' }}>🔍</span>
                    <p className="text-muted text-sm">
                      {documents.length === 0
                        ? 'Upload your code files first, then ask questions about them.'
                        : 'Ask anything about your uploaded code!'}
                    </p>
                    {documents.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px' }}>
                        {[
                          'What does this code do?',
                          'Explain the main functions',
                          'How does authentication work?',
                          'What are the API endpoints?',
                        ].map((q, i) => (
                          <button
                            key={i}
                            onClick={() => setQuestion(q)}
                            className="btn-secondary btn-sm"
                            style={{ textAlign: 'left', fontSize: '12px' }}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`rag-message ${msg.role}`}>
                      <span className="rag-message-role">
                        {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                      </span>
                      <div className="rag-message-content">
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div className="rag-message assistant">
                    <span className="rag-message-role">🤖 AI</span>
                    <div className="rag-message-content" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="spinner spinner-sm"></div>
                      Searching your code...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="rag-input-row">
                <textarea
                  className="rag-input"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    documents.length === 0
                      ? 'Upload documents first...'
                      : 'Ask about your code... (Enter to send)'
                  }
                  disabled={documents.length === 0 || loading}
                />
                <button
                  onClick={handleChat}
                  disabled={loading || !question.trim() || documents.length === 0}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                >
                  {loading ? (
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}