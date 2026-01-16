import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import InvoiceElements from './pages/InvoiceElements'
import Invoices from './pages/Invoices'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Prevent back navigation to login after authentication
    if (isAuthenticated) {
      window.history.pushState(null, '', window.location.href)
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href)
        navigate('/dashboard', { replace: true })
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [isAuthenticated, navigate])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Prevent back navigation to protected routes after logout
    if (!loading && !isAuthenticated) {
      window.history.pushState(null, '', window.location.href)
      const handlePopState = () => {
        window.history.pushState(null, '', window.location.href)
        navigate('/login', { replace: true })
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/clients"
        element={
          <PrivateRoute>
            <Clients />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/invoice-elements"
        element={
          <PrivateRoute>
            <InvoiceElements />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/invoices"
        element={
          <PrivateRoute>
            <Invoices />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
