import { useState } from 'react'
import { auth } from '../api/client'
import { useAuth } from '../auth/useAuth'

export default function Login() {
  const { login } = useAuth()
  const [step, setStep] = useState('email') 
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendCode(e) {
    e.preventDefault()
    setError('')
    if (!/@duke\.edu$/i.test(email.trim())) {
      setError('Please use a @duke.edu email address.')
      return
    }
    setLoading(true)
    try {
      await auth.sendCode(email.trim())
      setStep('code')
    } catch (err) {
      setError(err.message || 'Could not send code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await auth.verifyCode(email.trim(), code.trim())
      if (!token) throw new Error('No token returned.')
      login(token)
    } catch (err) {
      setError(err.message || 'Invalid code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-duke-navy to-duke-blue px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <div className="mb-3 text-5xl" aria-hidden>
            🍕
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            Duke University
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Free Food Finder</h1>
        </div>

        <div className="card space-y-5 p-6">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Sign in</h2>
              <label className="field">
                Duke email
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="netid@duke.edu"
                  autoComplete="email"
                />
              </label>
              <button type="submit" className="btn w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">
                Enter the code sent to{' '}
                <span className="text-duke-blue">{email}</span>
              </h2>
              <label className="field">
                One-time code
                <input
                  className="input text-center text-2xl tracking-[0.5em]"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </label>
              <button type="submit" className="btn w-full" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify'}
              </button>
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => {
                  setStep('email')
                  setError('')
                }}
              >
                Use a different email
              </button>
            </form>
          )}
          {error && (
            <p role="alert" className="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
