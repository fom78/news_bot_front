import { useState } from 'react'
import { notification } from '../lib/notificationHandler'

export default function SubscriptionForm({ availableCategories, onAdd }) {
  const [selectedSingle, setSelectedSingle] = useState('')
  const [selectedMultiple, setSelectedMultiple] = useState([])

  const handleSingleSubmit = (e) => {
    e.preventDefault()
    if (selectedSingle) {
      onAdd([selectedSingle])
      setSelectedSingle('')
      notification(`"${selectedSingle}" agregada`)
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
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Agregar categoría única</h3>
        <form onSubmit={handleSingleSubmit} className="flex gap-4">
          <select
            value={selectedSingle}
            onChange={(e) => setSelectedSingle(e.target.value)}
            className="flex-1 p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {availableCategories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedSingle}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Selector múltiple */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Agregar múltiples categorías</h3>
        <form onSubmit={handleMultiSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCategories.map(category => (
              <label 
                key={category} 
                className="flex items-center p-3 bg-white border rounded-lg hover:border-blue-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMultiple.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 capitalize">{category}</span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={selectedMultiple.length === 0}
            className="mt-6 w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Agregar {selectedMultiple.length} seleccionadas
          </button>
        </form>
      </div>
    </div>
  )
}