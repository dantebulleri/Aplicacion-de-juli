import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Auth/Login'
import Layout from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'

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
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
