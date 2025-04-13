import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscriptionService } from '../services/api'
import { handleError } from '../lib/errorHandler'

export default function LandingPublic() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    try {
      const data = await subscriptionService.getCategories()
      setCategories(data)
    } catch (err) {
      handleError(err, { id: 'public-categories', silent: true })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Elige tus categorías favoritas
      </h1>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Mantente informado con las últimas noticias de tus temas de interés.
        Regístrate o inicia sesión para personalizar tu experiencia.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {categories.map(category => (
          <div
            key={category}
            className="p-6 bg-white border rounded-lg shadow-sm cursor-not-allowed opacity-75"
          >
            <div className="font-medium mb-2 capitalize">{category}</div>
            <div className="text-sm text-blue-600">Inicia sesión para acceder</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <Link
          to="/login"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ingresar
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}