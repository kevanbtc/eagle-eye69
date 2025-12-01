import { Routes, Route, Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Estimates from './pages/Estimates'
import Materials from './pages/Materials'
import InvestorDashboard from './pages/InvestorDashboard'
import Schedule from './pages/Schedule'
import AIImagery from './pages/AIImagery'
import Marketing from './pages/Marketing'
import Login from './pages/Login'
import Register from './pages/Register'

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

// Public Route wrapper (redirect if logged in)
function PublicRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
      <Route path="/estimates" element={<ProtectedRoute><Layout><Estimates /></Layout></ProtectedRoute>} />
      <Route path="/materials" element={<ProtectedRoute><Layout><Materials /></Layout></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
      <Route path="/ai-imagery" element={<ProtectedRoute><Layout><AIImagery /></Layout></ProtectedRoute>} />
      <Route path="/marketing" element={<ProtectedRoute><Layout><Marketing /></Layout></ProtectedRoute>} />
      <Route path="/investor" element={<ProtectedRoute><Layout><InvestorDashboard /></Layout></ProtectedRoute>} />
    </Routes>
  )
}

export default App
