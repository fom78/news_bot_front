import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthForm({ mode = 'login' }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const validateInputs = () => {
    const phoneRegex = /^\+\d{8,15}$/
    if (!phoneRegex.test(phone)) {
      setError('Formato inválido. Ejemplo: +549112345678')
      return false
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    
    return true
  }

  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 15)
    setPhone(`+${cleaned}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateInputs()) return

    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(phone, password)
      } else {
        await register(phone, password)
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Error en el servidor. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Teléfono Internacional
            <span className="text-gray-500 ml-2">(Ej: +549112345678)</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">+</span>
            <input
              type="tel"
              value={phone.replace('+', '')}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex-1 p-2 border rounded-r-md"
              placeholder="54112345678"
              maxLength={15}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Procesando...' : (mode === 'login' ? 'Ingresar' : 'Registrarse')}
        </button>
      </form>

      <div className="mt-4 text-center">
        {mode === 'login' ? (
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
          </p>
        )}
      </div>
    </div>
  )
}