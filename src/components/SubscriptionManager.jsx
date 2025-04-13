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
  const [categoriesLoading, setCategoriesLoading] = useState(true)

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
      setCategoriesLoading(false)
    }
  }

  const handleDelete = async (category) => {
    try {
      await subscriptionService.delete(category)
      setSubscriptions(prev => prev.filter(c => c !== category))
      notification(`Suscripción a "${category}" eliminada`, 
        {icon:'🗑️',duration: 1000}
      )
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
    
    notification(message)
    } catch (err) {
      handleError(err)
    }
  }

  useEffect(() => {
    if (user) loadData()
  }, [user])

  if (!user) return <div>Debes iniciar sesión</div>
  if (loading || categoriesLoading) return <div>Cargando...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Tus Suscripciones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map(category => (
          <div key={category} className="p-4 border rounded flex justify-between items-center">
            <span className="capitalize">{category}</span>
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