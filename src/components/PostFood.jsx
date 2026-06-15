import { useState } from 'react'
import { food as foodApi } from '../api/client'

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

function defaultExpiry() {
  return toLocalInputValue(new Date(Date.now() + 2 * 60 * 60 * 1000)) // now + 2h
}

export default function PostFood({ onPosted }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [locationDetails, setLocationDetails] = useState('')
  const [expiresAt, setExpiresAt] = useState(defaultExpiry())
  const [imageFile, setImageFile] = useState(null)
  const [geoStatus, setGeoStatus] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported by this browser.')
      return
    }
    setGeoStatus('Locating…')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude))
        setLongitude(String(pos.coords.longitude))
        setGeoStatus('Location filled in.')
      },
      (err) => setGeoStatus(`Could not get location: ${err.message}`),
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (!title.trim()) return setError('Title is required.')
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return setError('A valid latitude and longitude are required.')
    }

    setSubmitting(true)
    try {
      const created = await foodApi.create({
        title: title.trim(),
        description: description.trim() || null,
        latitude: lat,
        longitude: lng,
        locationDetails: locationDetails.trim() || null,
        expiresAt: new Date(expiresAt).toISOString(),
      })
      if (imageFile) {
        await foodApi.uploadImage(created.id, imageFile)
      }
      // Reset the form for the next post.
      setTitle('')
      setDescription('')
      setLatitude('')
      setLongitude('')
      setLocationDetails('')
      setExpiresAt(defaultExpiry())
      setImageFile(null)
      setGeoStatus('')
      e.target.reset()
      onPosted?.()
    } catch (err) {
      setError(err.message || 'Could not post food.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">Post Food</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="field">
          Title *
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <fieldset className="card space-y-3 border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold text-slate-700">
            Location *
          </legend>
          <button type="button" className="btn-outline w-full" onClick={useMyLocation}>
            📡 Use my location
          </button>
          {geoStatus && <p className="text-xs text-slate-500">{geoStatus}</p>}
          <div className="grid grid-cols-2 gap-3">
            <label className="field">
              Latitude
              <input
                className="input"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </label>
            <label className="field">
              Longitude
              <input
                className="input"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </label>
          </div>
          <label className="field">
            Location details (optional)
            <input
              className="input"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="e.g. Bryan Center, 2nd floor"
            />
          </label>
        </fieldset>

        <label className="field">
          Description (optional)
          <textarea
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>

        <label className="field">
          Expires at
          <input
            className="input"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>

        <label className="field">
          Image (optional)
          <input
            className="block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-duke-navy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-duke-blue"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>

        <button type="submit" className="btn-accent w-full" disabled={submitting}>
          {submitting ? 'Posting…' : '🍕 Post food'}
        </button>
      </form>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
    </div>
  )
}
