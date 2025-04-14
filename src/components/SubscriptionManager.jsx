// src/components/SubscriptionManager.jsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { subscriptionService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import SubscriptionForm from './SubscriptionForm'
import { handleError } from '../lib/errorHandler'
import { notification } from '../lib/notificationHandler'

export default function SubscriptionManager() {
  const { t } = useTranslation()
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
      notification(t('subscriptionManager.notificationDeleted', { category }), {
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
        ? t('subscriptionManager.notificationMultipleAdded', { count: categories.length })
        : t('subscriptionManager.notificationSingleAdded', { category: categories[0] })
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

  if (!user) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        {t('subscriptionManager.loginMessage')}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-800 dark:text-gray-200">
        {t('subscriptionManager.loading')}
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t('subscriptionManager.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('subscriptionManager.description')}
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {t('subscriptionManager.noSubscriptions')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map(category => (
            <div
              key={category}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex items-center justify-between transition-colors duration-200"
            >
              <span className="capitalize font-medium text-gray-800 dark:text-gray-200">
                {category}
              </span>
              <button
                onClick={() => handleDelete(category)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-700 transition-colors duration-150"
              >
                {t('subscriptionManager.deleteButton')}
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
