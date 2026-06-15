import { API_BASE_URL } from '../config'
import { getToken } from '../auth/token'

let unauthorizedHandler = null
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, isForm = false } = {}) {
  const token = getToken()
  if (!token) {
    unauthorizedHandler?.()
    throw new ApiError('Not authenticated', 401)
  }

  const headers = { Authorization: `Bearer ${token}` }
  let payload
  if (isForm) {
    payload = body 
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: payload })

  if (res.status === 401 || res.status === 403) {
    unauthorizedHandler?.()
    throw new ApiError('Session expired', res.status)
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed (${res.status})`, res.status)
  }

  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

async function publicPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed (${res.status})`, res.status)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const auth = {
  sendCode: (email) => publicPost('/api/auth/send-code', { email }),
  verifyCode: (email, code) => publicPost('/api/auth/verify-code', { email, code }),
}

export const food = {
  list: () => apiFetch('/api/food'),
  get: (id) => apiFetch(`/api/food/${id}`),
  byUser: (userId) => apiFetch(`/api/food/user/${userId}`),
  create: (data) => apiFetch('/api/food', { method: 'POST', body: data }),
  update: (id, data) => apiFetch(`/api/food/${id}`, { method: 'PUT', body: data }),
  remove: (id) => apiFetch(`/api/food/${id}`, { method: 'DELETE' }),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return apiFetch(`/api/food/${id}/image`, { method: 'POST', body: form, isForm: true })
  },
}

export const forum = {
  byFood: (foodId) => apiFetch(`/api/forum/food/${foodId}`),
  byUser: (userId) => apiFetch(`/api/forum/user/${userId}`),
  create: (foodId, content) =>
    apiFetch(`/api/forum/food/${foodId}`, { method: 'POST', body: { content } }),
  update: (id, content) =>
    apiFetch(`/api/forum/${id}`, { method: 'PUT', body: { content } }),
  remove: (id) => apiFetch(`/api/forum/${id}`, { method: 'DELETE' }),
}
