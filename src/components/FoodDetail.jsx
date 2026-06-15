import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import '../leafletSetup'
import { food as foodApi, forum as forumApi } from '../api/client'
import { resolveImageUrl } from '../config'
import { locationLabel } from '../foodUtils'

export default function FoodDetail({ foodId, onBack }) {
  const [item, setItem] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  function loadComments() {
    return forumApi.byFood(foodId).then((data) => setComments(data || []))
  }

  useEffect(() => {
    let active = true
    Promise.all([foodApi.get(foodId), forumApi.byFood(foodId)])
      .then(([f, c]) => {
        if (!active) return
        setItem(f)
        setComments(c || [])
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [foodId])

  async function handleAddComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return
    setPosting(true)
    setError('')
    try {
      await forumApi.create(foodId, newComment.trim())
      setNewComment('')
      await loadComments()
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <p className="py-8 text-center text-slate-500">Loading…</p>
  if (error && !item)
    return (
      <p role="alert" className="alert">
        {error}
      </p>
    )
  if (!item) return null

  const img = resolveImageUrl(item.imageUrl)
  const hasCoords = item.latitude != null && item.longitude != null

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-semibold text-duke-blue"
      >
        ← Back
      </button>

      {img && (
        <img
          src={img}
          alt={item.title}
          className="h-48 w-full rounded-2xl object-cover shadow-sm"
        />
      )}

      <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>

      <div className="card space-y-2 text-sm">
        <p className="flex gap-2 text-slate-700">
          <span aria-hidden>📍</span>
          <span>{locationLabel(item)}</span>
        </p>
        {item.expiresAt && (
          <p className="flex gap-2 text-slate-700">
            <span aria-hidden>⏰</span>
            <span>Expires {new Date(item.expiresAt).toLocaleString()}</span>
          </p>
        )}
        {item.description && (
          <p className="pt-1 text-slate-600">{item.description}</p>
        )}
      </div>

      {hasCoords && (
        <MapContainer
          center={[item.latitude, item.longitude]}
          zoom={16}
          style={{ height: '220px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[item.latitude, item.longitude]} />
        </MapContainer>
      )}

      <h2 className="pt-2 text-lg font-bold text-slate-900">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-sm text-slate-500">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="card p-3">
              {c.userEmail && (
                <strong className="text-sm text-duke-navy">{c.userEmail}</strong>
              )}
              <p className="text-sm text-slate-700">{c.content}</p>
              {c.createdAt && (
                <small className="text-xs text-slate-400">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddComment} className="space-y-3">
        <label className="field">
          Add a comment
          <textarea
            className="textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
        </label>
        <button type="submit" className="btn w-full" disabled={posting}>
          {posting ? 'Posting…' : 'Post comment'}
        </button>
      </form>
      {error && item && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
    </div>
  )
}
