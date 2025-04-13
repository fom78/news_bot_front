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
      const { message, isValidationError } = handleError(err, { 
        silent: true
      })
      
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>
      
      {error && (
        <div 
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200"
          role="alert"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="phone-input"
            className="block text-sm font-medium mb-1"
          >
            Teléfono Internacional
            <span className="text-gray-500 ml-2">(Ej: +549112345678)</span>
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">+</span>
            <input
              id="phone-input"
              ref={phoneInputRef}
              type="tel"
              value={phone.replace('+', '')}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex-1 p-2 border rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="54112345678"
              maxLength={15}
              required
              aria-describedby="phone-error"
              aria-invalid={!!error}
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="password-input"
            className="block text-sm font-medium mb-1"
          >
            Contraseña
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            aria-describedby="password-error"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg 
                className="animate-spin h-5 w-5 mr-2 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </>
          ) : mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {mode === 'login' ? (
          <p>
            ¿Primera vez aquí?{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Crea una cuenta
            </Link>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Accede a tu cuenta
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}