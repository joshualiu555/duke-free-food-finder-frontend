import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

const TABS = [
  { to: '/find', label: 'Find', icon: '🔍' },
  { to: '/post', label: 'Post', icon: '➕' },
  { to: '/account', label: 'Account', icon: '👤' },
]

export default function Nav() {
  const { logout } = useAuth()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-slate-200 bg-white/90 px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1.5 backdrop-blur">
      <div className="flex items-stretch justify-around">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition ${
                isActive ? 'text-duke-navy' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <span className="text-xl leading-none" aria-hidden>
              {tab.icon}
            </span>
            {tab.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={logout}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold text-slate-400 transition hover:text-red-500"
        >
          <span className="text-xl leading-none" aria-hidden>
            ⎋
          </span>
          Log out
        </button>
      </div>
    </nav>
  )
}
