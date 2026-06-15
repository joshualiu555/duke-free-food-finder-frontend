import { useEffect, useState } from 'react'
import { food as foodApi } from '../api/client'
import { resolveImageUrl } from '../config'
import { locationLabel } from '../foodUtils'

export default function FoodList({ onSelect }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    foodApi
      .list()
      .then((data) => active && setItems(data || []))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="py-8 text-center text-slate-500">Loading…</p>
  if (error)
    return (
      <p role="alert" className="alert">
        {error}
      </p>
    )
  if (items.length === 0)
    return (
      <div className="card py-10 text-center text-slate-500">
        <div className="mb-2 text-3xl" aria-hidden>
          🍽️
        </div>
        No food posted yet.
      </div>
    )

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const img = resolveImageUrl(item.imageUrl)
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="card flex w-full items-center gap-3 text-left transition active:scale-[0.99] hover:border-duke-blue/40"
            >
              {img ? (
                <img
                  src={img}
                  alt={item.title}
                  className="h-16 w-16 flex-none rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-duke-cream text-2xl">
                  🍕
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                  <span aria-hidden>📍</span>
                  {locationLabel(item)}
                </p>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {item.description.slice(0, 200)}
                  </p>
                )}
              </div>
              <span className="flex-none text-slate-300" aria-hidden>
                ›
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
