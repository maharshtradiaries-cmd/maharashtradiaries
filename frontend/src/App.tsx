import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import PlanTrip from './pages/PlanTrip'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import About from './pages/About'
import Terms from './pages/Terms'

import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--gray-950)'
      }}>
        <div className="loading-spinner" />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>
}



function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A2E',
            color: '#F1F5F9',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            borderRadius: '16px',
            padding: '16px 24px',
            fontSize: '14px',
            fontWeight: '600',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          },
          success: {
            iconTheme: { primary: '#FF8C00', secondary: '#0F0F1A' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/plan-trip" element={<ProtectedRoute><PlanTrip /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>

    </AuthProvider>
  )
}

export default App
