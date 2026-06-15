import { useCallback, useEffect, useState } from 'react'
import { food as foodApi, forum as forumApi } from '../api/client'
import { useAuth } from '../auth/useAuth'

export default function Account() {
  const { email, userId } = useAuth()
  const [foods, setFoods] = useState([])
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    if (userId == null) return
    return Promise.all([foodApi.byUser(userId), forumApi.byUser(userId)])
      .then(([f, c]) => {
        setFoods(f || [])
        setComments(c || [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    if (userId == null) return
    let active = true
    Promise.all([foodApi.byUser(userId), forumApi.byUser(userId)])
      .then(([f, c]) => {
        if (!active) return
        setFoods(f || [])
        setComments(c || [])
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [userId])

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-slate-900">Account</h1>
      <div className="card flex items-center gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-duke-navy to-duke-blue text-xl text-white">
          👤
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">Signed in as</p>
          <p className="truncate font-semibold text-slate-900">{email}</p>
        </div>
      </div>
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="py-8 text-center text-slate-500">Loading…</p>
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">My food posts</h2>
            {foods.length === 0 ? (
              <p className="text-sm text-slate-500">You haven't posted any food.</p>
            ) : (
              <ul className="space-y-2">
                {foods.map((item) => (
                  <FoodRow key={item.id} item={item} onChanged={load} onError={setError} />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">My comments</h2>
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500">You haven't posted any comments.</p>
            ) : (
              <ul className="space-y-2">
                {comments.map((c) => (
                  <CommentRow key={c.id} comment={c} onChanged={load} onError={setError} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function FoodRow({ item, onChanged, onError }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')
  const [locationDetails, setLocationDetails] = useState(item.locationDetails || '')
  const [busy, setBusy] = useState(false)

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await foodApi.update(item.id, {
        ...item,
        title: title.trim(),
        description: description.trim() || null,
        locationDetails: locationDetails.trim() || null,
      })
      setEditing(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${item.title}"?`)) return
    try {
      await foodApi.remove(item.id)
      onChanged()
    } catch (err) {
      onError(err.message)
    }
  }

  if (editing) {
    return (
      <li className="card">
        <form onSubmit={save} className="space-y-3">
          <label className="field">
            Title
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="field">
            Description
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>
          <label className="field">
            Location details
            <input
              className="input"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn flex-1" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-outline flex-1"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="card">
      <strong className="text-slate-900">{item.title}</strong>
      <p className="flex items-center gap-1 text-xs text-slate-500">
        <span aria-hidden>📍</span>
        {locationLabel(item)}
      </p>
      {item.description && (
        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn-outline flex-1 py-2 text-sm"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
          onClick={remove}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

function CommentRow({ comment, onChanged, onError }) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(comment.content || '')
  const [busy, setBusy] = useState(false)

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await forumApi.update(comment.id, content.trim())
      setEditing(false)
      onChanged()
    } catch (err) {
      onError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm('Delete this comment?')) return
    try {
      await forumApi.remove(comment.id)
      onChanged()
    } catch (err) {
      onError(err.message)
    }
  }

  if (editing) {
    return (
      <li className="card">
        <form onSubmit={save} className="space-y-3">
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <button type="submit" className="btn flex-1" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn-outline flex-1"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="card">
      <p className="text-sm text-slate-700">{comment.content}</p>
      {comment.createdAt && (
        <small className="text-xs text-slate-400">
          {new Date(comment.createdAt).toLocaleString()}
        </small>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn-outline flex-1 py-2 text-sm"
          onClick={() => setEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="flex-1 rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
          onClick={remove}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
