import { useEffect, useState } from 'react'
import { setUnauthorizedHandler } from '../api/client'
import { clearToken, getEmail, getUserId, isAuthenticated, saveToken } from './token'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [userId, setUserId] = useState(getUserId())
  const [email, setEmail] = useState(getEmail())

  function login(token) {
    saveToken(token)
    setAuthed(true)
    setUserId(getUserId())
    setEmail(getEmail())
  }

  function logout() {
    clearToken()
    setAuthed(false)
    setUserId(null)
    setEmail(null)
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated: authed, userId, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
