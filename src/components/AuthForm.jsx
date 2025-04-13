import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { handleError } from '../lib/errorHandler'

export default function AuthForm({ mode = 'login' }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const phoneInputRef = useRef(null)

  useEffect(() => {
    phoneInputRef.current.focus()
  }, [])

  const validateInputs = () => {
    const phoneRegex = /^\+\d{8,15}$/
    if (!phoneRegex.test(phone)) {
      setError('Formato inválido. Ejemplo: +549112345678')
      return false
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
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
      const { message, isValidationError } = handleError(err, { silent: true })

      if (isValidationError) {
        setError(message)
      } else {
        handleError(err, { silent: false })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone-input" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Teléfono Internacional
            <span className="text-gray-500 dark:text-gray-400 ml-2">(Ej: +549112345678)</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">+</span>
            <input
              id="phone-input"
              ref={phoneInputRef}
              type="tel"
              value={phone.replace('+', '')}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex-1 p-2 border rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="54112345678"
              maxLength={15}
              required
              aria-describedby="phone-error"
              aria-invalid={!!error}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password-input" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
        {mode === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Regístrate</Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Inicia sesión</Link>
          </>
        )}
      </p>
    </div>
  )
}
