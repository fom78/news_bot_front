// src/components/SubscriptionForm.jsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { notification } from '../lib/notificationHandler'

export default function SubscriptionForm({ availableCategories, onAdd }) {
  const { t } = useTranslation()
  const [selectedSingle, setSelectedSingle] = useState('')
  const [selectedMultiple, setSelectedMultiple] = useState([])

  const handleSingleSubmit = (e) => {
    e.preventDefault()
    if (selectedSingle) {
      onAdd([selectedSingle])
      notification(t('subscriptionForm.notificationAdded', { category: selectedSingle }), {
        icon: '✅',
        duration: 2000
      })
      setSelectedSingle('')
    }
  }

  const handleCheckboxChange = (category) => {
    setSelectedMultiple(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleMultiSubmit = (e) => {
    e.preventDefault()
    if (selectedMultiple.length > 0) {
      onAdd(selectedMultiple)
      setSelectedMultiple([])
    }
  }

  return (
    <div className="space-y-8">
      {/* Selector individual */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {t('subscriptionForm.singleTitle')}
        </h3>
        <form onSubmit={handleSingleSubmit} className="flex gap-4">
          <select
            value={selectedSingle}
            onChange={(e) => setSelectedSingle(e.target.value)}
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
          >
            <option value="">{t('subscriptionForm.singlePlaceholder')}</option>
            {availableCategories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedSingle}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition-colors duration-150"
          >
            {t('subscriptionForm.singleButton')}
          </button>
        </form>
      </div>

      {/* Selector múltiple */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {t('subscriptionForm.multipleTitle')}
        </h3>
        <form onSubmit={handleMultiSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCategories.map(category => (
              <label
                key={category}
                className="flex items-center p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={selectedMultiple.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 transition-colors duration-150"
                />
                <span className="ml-3 capitalize text-gray-800 dark:text-gray-200">
                  {category}
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={selectedMultiple.length === 0}
            className="mt-6 w-full py-2 px-4 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors duration-150"
          >
            {t('subscriptionForm.multipleButton', { count: selectedMultiple.length })}
          </button>
        </form>
      </div>
    </div>
  )
}
