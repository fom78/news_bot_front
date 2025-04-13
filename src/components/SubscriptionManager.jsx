import { useState, useEffect } from 'react'
import { subscriptionService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SubscriptionForm from './SubscriptionForm'
import { handleError } from '../lib/errorHandler'

export default function SubscriptionManager() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [availableCategories] = useState([
    'cultura', 'deportes', 'tecnologia', 'politica', 'economia'
  ])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const currentSubs = await subscriptionService.get()
      setSubscriptions(currentSubs)
    } catch (err) {
      handleError(err, { id: 'load-subs' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (category) => {
    try {
      await subscriptionService.delete(category)
      setSubscriptions(prev => prev.filter(c => c !== category))
    } catch (err) {
      handleError(err)
    }
  }

  
  const handleAdd = async (categories) => {
    try {
      await subscriptionService.add(categories)
      setSubscriptions(prev => [...new Set([...prev, ...categories])])
    } catch (err) {
      handleError(err)
    }
  }
  

  useEffect(() => {
    if (user) loadData()
  }, [user])

  if (!user) return <div>Debes iniciar sesión</div>
  if (loading) return <div>Cargando...</div>

  return (
    <div className="space-y-6">
      {/* {error && (
        <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50">
          {error}
        </div>
      )} */}

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

      <SubscriptionForm
        availableCategories={availableCategories.filter(c => !subscriptions.includes(c))}
        onAdd={handleAdd}
      />
    </div>
  )
}
