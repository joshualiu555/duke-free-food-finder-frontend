import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import '../leafletSetup'
import { food as foodApi } from '../api/client'
import { DUKE_CENTER } from '../config'

export default function FoodMap({ onSelect }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    foodApi
      .list()
      .then((data) => active && setItems(data || []))
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  if (error)
    return (
      <p role="alert" className="alert">
        {error}
      </p>
    )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <MapContainer
        center={DUKE_CENTER}
        zoom={15}
        style={{ height: '70vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items
          .filter((item) => item.latitude != null && item.longitude != null)
          .map((item) => (
            <Marker key={item.id} position={[item.latitude, item.longitude]}>
              <Popup>
                <strong className="text-duke-navy">{item.title}</strong>
                <br />
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="mt-1 font-semibold text-duke-blue"
                >
                  View details →
                </button>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
