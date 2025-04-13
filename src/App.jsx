import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthForm from './components/AuthForm'
import SubscriptionManager from './components/SubscriptionManager'
import ProtectedRoute from './components/ProtectedRoute'
import Toast from './components/Toaster'
export default function App() {
  const { user, pending } = useAuth()

  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">📰 Suscripciones</span>
          {user && (
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-700"
            >
              {user.phone}
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <AuthForm mode="login" />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <AuthForm mode="register" />} />
          <Route path="/" element={
            <ProtectedRoute>
              <SubscriptionManager />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}