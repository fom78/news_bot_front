import { useState } from 'react'

export default function SubscriptionForm({ availableCategories, onAdd }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCategory) return
    
    setIsSubmitting(true)
    try {
      await onAdd(selectedCategory)
      setSelectedCategory('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Agregar nueva suscripción</h3>
      <form onSubmit={handleSubmit} className="flex gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-1 p-2 border rounded-md bg-white"
          disabled={isSubmitting || availableCategories.length === 0}
        >
          <option value="">Selecciona una categoría</option>
          {availableCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <button
          type="submit"
          disabled={!selectedCategory || isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Agregando...' : 'Agregar'}
        </button>
      </form>
    </div>
  )
}