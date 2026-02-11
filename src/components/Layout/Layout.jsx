import { logout } from '../../firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import './Layout.css'

export default function Layout({ children }) {
  const { user } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // silently fail
    }
  }

  return (
    <div className="layout">
      <header className="topbar">
        <h1 className="topbar-title">Mi Carrera</h1>
        <div className="topbar-right">
          <span className="topbar-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Salir
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  )
}
