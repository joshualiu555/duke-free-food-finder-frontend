import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/useAuth'
import Login from './components/Login'
import Nav from './components/Nav'
import FindFood from './components/FindFood'
import Account from './components/Account'

export default function App() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 shadow-2xl">
      <header className="sticky top-0 z-20 bg-gradient-to-br from-duke-navy to-duke-blue px-5 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] text-white shadow-lg">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Duke University
        </p>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span aria-hidden>🍕</span> Free Food Finder
        </h1>
      </header>

      <main className="flex-1 px-4 pb-32 pt-5">
        <Routes>
          <Route path="/find" element={<FindFood />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<Navigate to="/find" replace />} />
        </Routes>
      </main>

      <Nav />
    </div>
  )
}
