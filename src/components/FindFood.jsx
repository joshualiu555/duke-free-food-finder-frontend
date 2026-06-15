import { useState } from 'react'
import FoodList from './FoodList'
import FoodMap from './FoodMap'
import FoodDetail from './FoodDetail'

export default function FindFood() {
  const [view, setView] = useState('list') 
  const [selectedId, setSelectedId] = useState(null)

  if (selectedId != null) {
    return <FoodDetail foodId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Find Food</h1>

      <div className="flex rounded-xl bg-slate-200 p-1">
        {[
          { key: 'list', label: 'List' },
          { key: 'map', label: 'Map' },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setView(opt.key)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              view === opt.key
                ? 'bg-white text-duke-navy shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <FoodList onSelect={setSelectedId} />
      ) : (
        <FoodMap onSelect={setSelectedId} />
      )}
    </div>
  )
}
