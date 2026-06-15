import { jwtDecode } from 'jwt-decode'

const STORAGE_KEY = 'dfff_auth'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function saveToken(token) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token, expiresAt: Date.now() + SEVEN_DAYS_MS }),
  )
}

export function clearToken() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getToken() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const { token, expiresAt } = JSON.parse(raw)
    if (!token || !expiresAt || Date.now() >= expiresAt) {
      clearToken()
      return null
    }
    return token
  } catch {
    clearToken()
    return null
  }
}

export function isAuthenticated() {
  return getToken() !== null
}

function decode() {
  const token = getToken()
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export function getUserId() {
  return decode()?.userId ?? null
}

export function getEmail() {
  return decode()?.sub ?? null
}
