import { createContext, useContext, useState, useEffect } from 'react'
import { subscriptionService } from '../services/api'

const SubscriptionsContext = createContext()

export function SubscriptionsProvider({ children }) {
  const [userSubscriptions, setUserSubscriptions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const [subscriptions, allCategories] = await Promise.all([
        subscriptionService.getSubscriptions(),
        subscriptionService.getCategories()
      ])
      
      setUserSubscriptions(subscriptions)
      setCategories(allCategories)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const updateSubscriptions = async (newCategories) => {
    try {
      setLoading(true)
      const updated = await subscriptionService.updateSubscriptions(newCategories)
      setUserSubscriptions(updated)
    } catch (err) {
      setError(err)
      throw err // Para manejo en UI
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SubscriptionsContext.Provider
      value={{
        userSubscriptions,
        categories,
        loading,
        error,
        updateSubscriptions
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  )
}

// Hook profesional con validación
export function useSubscriptions() {
  const context = useContext(SubscriptionsContext)
  if (!context) {
    throw new Error('useSubscriptions debe usarse dentro del Provider')
  }
  return context
}