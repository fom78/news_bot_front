import { useState, useEffect } from 'react'
import { subscriptionService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function SubscriptionManager() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [availableCategories] = useState([
    'cultura', 'deportes', 'tecnologia', 'politica', 'economia'
  ]) // Lista estática temporal
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      const currentSubs = await subscriptionService.get()
      setSubscriptions(currentSubs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category) => {
    try {
      await subscriptionService.delete(category)
      setSubscriptions(prev => prev.filter(c => c !== category))
    } catch (err) {
      setError(`Error eliminando: ${err.message}`)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  if (!user) return <div>Debes iniciar sesión</div>
  if (loading) return <div>Cargando...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tus Suscripciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map(category => (
          <div key={category} className="p-4 border rounded flex justify-between items-center">
            <span>{category}</span>
            <button
              onClick={() => handleDelete(category)}
              className="text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Categorías Disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableCategories
            .filter(c => !subscriptions.includes(c))
            .map(category => (
              <button
                key={category}
                onClick={() => handleAdd(category)}
                className="p-2 border rounded hover:bg-gray-50"
              >
                {category}
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}