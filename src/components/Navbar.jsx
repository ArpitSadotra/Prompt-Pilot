import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLoggedIn = !!localStorage.getItem('authToken')

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = isLoggedIn
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/playground', label: 'Playground' },
        { path: '/agent', label: 'AI Agent' },
        { path: '/rag', label: 'RAG Chat' },
      ]
    : []

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">⚡ PromptPilot</Link>

          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {isLoggedIn ? (
              <li>
                <button onClick={handleLogout} className="navbar-logout">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li><Link to="/login" className="navbar-link">Login</Link></li>
                <li>
                  <Link to="/signup" className="btn-primary btn-sm">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>

          <button
            className="navbar-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="navbar-mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={{ color: isActive(link.path) ? 'var(--color-accent)' : 'var(--color-text)' }}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} style={{ color: '#ff6b9d' }}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </>
  )
}