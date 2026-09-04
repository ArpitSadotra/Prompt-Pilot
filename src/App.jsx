import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import PlaygroundPage from './pages/PlaygroundPage'
import AgentPage from './pages/AgentPage'
import RAGPage from './pages/RAGPage'

function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex-center h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/playground" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PlaygroundPage />
          </ProtectedRoute>
        } />

        <Route path="/agent" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AgentPage />
          </ProtectedRoute>
        } />

        <Route path="/rag" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RAGPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App