import { useState, useEffect } from 'react'
import { subscriptionService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SubscriptionForm from './SubscriptionForm'
import { handleError } from '../lib/errorHandler'
import { notification } from '../lib/notificationHandler'

export default function SubscriptionManager() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [currentSubs, allCategories] = await Promise.all([
        subscriptionService.get(),
        subscriptionService.getCategories()
      ])
      setSubscriptions(currentSubs)
      setAvailableCategories(allCategories)
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
      notification(`Suscripción a "${category}" eliminada`, {
        icon: '🗑️',
        duration: 3000
      })
    } catch (err) {
      handleError(err)
    }
  }

  const handleAdd = async (categories) => {
    try {
      await subscriptionService.add(categories)
      setSubscriptions(prev => [...new Set([...prev, ...categories])])
      
      const message = categories.length > 1 
        ? `${categories.length} categorías agregadas`
        : `Suscripción a "${categories[0]}" activada`
      
        notification(message, {
        icon: '✅',
        duration: 2000
      })
    } catch (err) {
      handleError(err)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  if (!user) return <div className="text-center py-12 text-gray-600">Debes iniciar sesión para ver tus suscripciones</div>
  if (loading) return <div className="text-center py-12">Cargando suscripciones...</div>

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tus Suscripciones</h1>
        <p className="text-gray-600 mt-2">Gestiona las categorías de noticias que recibes</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tienes suscripciones activas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map(category => (
            <div key={category} className="p-4 bg-white border rounded-lg shadow-sm flex items-center justify-between">
              <span className="capitalize font-medium">{category}</span>
              <button
                onClick={() => handleDelete(category)}
                className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <SubscriptionForm 
        availableCategories={availableCategories.filter(c => !subscriptions.includes(c))} 
        onAdd={handleAdd}
      />
    </div>
  )
}