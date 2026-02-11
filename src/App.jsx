import { AuthProvider, useAuth } from './contexts/AuthContext'
import { firebaseConfigMissing } from './firebase/config'
import Login from './components/Auth/Login'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'

function ConfigError() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#f0f2f5',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ color: '#e53e3e', fontSize: '1.5rem' }}>Firebase no configurado</h1>
        <p style={{ color: '#666', lineHeight: 1.6 }}>
          Faltan las variables de entorno de Firebase.
          Si estás en <strong>Netlify</strong>, andá a:<br />
          <code style={{ background: '#f7fafc', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            Site settings → Environment variables
          </code><br />
          y agregá las variables <code>VITE_FIREBASE_*</code>.
        </p>
        <p style={{ color: '#999', fontSize: '0.85rem' }}>
          Consultá SETUP.md para más detalles.
        </p>
      </div>
    </div>
  )
}

function AppContent() {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}

export default function App() {
  if (firebaseConfigMissing) {
    return <ConfigError />
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
