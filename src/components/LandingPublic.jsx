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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 dark:border-white mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Suscripciones Inteligentes a Noticias
      </h1>
      
      <div className="mb-12 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
          🚀 Potenciado por Global Commerce
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Al suscribirte recibirás tus noticias a través de nuestro 
          <strong className="text-blue-600 dark:text-blue-400"> bot conversacional inteligente</strong>, 
          que te ofrecerá:
        </p>
        <ul className="grid md:grid-cols-2 gap-4 text-left mb-6">
          {[
            'Resúmenes personalizados en tiempo real',
            'Alertas importantes prioritarias',
            'Interacción natural por voz o texto',
            'Soporte 24/7 integrado'
          ].map(text => (
            <li key={text} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 dark:text-green-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {text}
            </li>
          ))}
        </ul>
        <a
          href="https://www.globalcommerce.uy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
        >
          Conoce nuestra tecnología
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Elige tus categorías favoritas
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Selecciona los temas de tu interés y recibe noticias relevantes 
        mediante conversaciones inteligentes adaptadas a tus necesidades.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {categories.map(category => (
          <div
            key={category}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm cursor-not-allowed opacity-75 hover:opacity-100 transition-opacity"
          >
            <div className="font-medium mb-2 capitalize text-gray-800 dark:text-gray-100">{category}</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">Acceso con suscripción</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Comenzar ahora
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:border-blue-300 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Acceso usuarios
        </Link>
      </div>
    </div>
  )
}
