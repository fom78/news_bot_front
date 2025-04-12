import { useState } from 'react'

export default function SubscriptionForm({ availableCategories, onAdd }) {
  const [selectedSingle, setSelectedSingle] = useState('')
  const [selectedMultiple, setSelectedMultiple] = useState([])

  const handleSingleSubmit = (e) => {
    e.preventDefault()
    if (selectedSingle) {
      onAdd([selectedSingle]) // lo enviamos como array
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
    <div className="space-y-6">
      {/* Agregar individualmente */}
      <form onSubmit={handleSingleSubmit} className="flex gap-2 items-center">
        <select
          value={selectedSingle}
          onChange={e => setSelectedSingle(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Selecciona una categoría</option>
          {availableCategories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar
        </button>
      </form>

      {/* Agregar múltiples */}
      <form onSubmit={handleMultiSubmit}>
        <fieldset className="border rounded p-4">
          <legend className="font-semibold text-sm mb-2">Agregar múltiples categorías</legend>
          <div className="space-y-2">
            {availableCategories.map(category => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedMultiple.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                />
                {category}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={selectedMultiple.length === 0}
          >
            Agregar seleccionadas
          </button>
        </fieldset>
      </form>
    </div>
  )
}
