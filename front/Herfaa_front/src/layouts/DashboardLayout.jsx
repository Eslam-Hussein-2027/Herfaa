import { NavLink, Outlet } from 'react-router-dom'
import { User, Briefcase, Images, Inbox, LayoutDashboard, LogOut, ExternalLink } from 'lucide-react'
import Logo from '@/components/Logo'
import { useAuth } from '@/context/AuthContext'

const LINKS = [
  { to: '/provider', label: 'لوحة التحكم', Icon: LayoutDashboard, end: true },
  { to: '/provider/bookings', label: 'الطلبات الواردة', Icon: Inbox },
  { to: '/provider/services', label: 'خدماتي', Icon: Briefcase },
  { to: '/provider/portfolio', label: 'معرض الأعمال', Icon: Images },
  { to: '/provider/profile', label: 'ملفي الشخصي', Icon: User },
]

function navClass({ isActive }) {
  return `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive ? 'bg-gold-50 text-gold-700' : 'text-ink-600 hover:bg-ink-100'
  }`
}

export default function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Full-height sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-ink-200 bg-white md:flex">
        <div className="border-b border-ink-100 p-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={navClass}>
              <l.Icon className="h-4 w-4" /> {l.label}
            </NavLink>
          ))}
          {user?.provider_id && (
            <NavLink to={`/providers/${user.provider_id}`} className={navClass}>
              <ExternalLink className="h-4 w-4" /> ملفي العام
            </NavLink>
          )}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <div className="mb-1 flex items-center gap-2 px-1 py-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 text-sm font-bold text-gold-700">
              {user?.name?.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-800">{user?.name}</p>
              <p className="text-xs text-ink-400">حِرفي</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-danger-bg hover:text-danger"
          >
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header + tabs */}
        <div className="border-b border-ink-200 bg-white p-3 md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <Logo />
            <button onClick={logout} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-danger">خروج</button>
          </div>
          <nav className="flex gap-1 overflow-x-auto">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-gold-50 text-gold-700' : 'text-ink-600'
                  }`
                }
              >
                <l.Icon className="h-4 w-4" /> {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-5 py-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
