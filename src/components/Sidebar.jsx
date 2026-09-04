import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Code, Bot, BookOpen } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Code, label: 'Playground', path: '/playground' },
    { icon: Bot, label: 'AI Agent', path: '/agent' },
    { icon: BookOpen, label: 'RAG Chat', path: '/rag' },
  ]

  return (
    <aside className="sidebar hide-mobile">
      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}