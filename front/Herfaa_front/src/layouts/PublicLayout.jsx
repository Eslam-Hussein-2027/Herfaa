import { Link, Outlet } from 'react-router-dom'
import { Globe, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Logo from '@/components/Logo'
import { useAuth } from '@/context/AuthContext'

const pillClass =
  'hidden rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-teal-700 transition hover:border-gold-300 sm:block'

export default function PublicLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const { t, i18n } = useTranslation()

  const NAV = [
    { to: '/', label: t('nav.home') },
    { to: '/search', label: t('nav.browse') },
    { hash: '/#how-it-works', label: t('nav.how') },
  ]

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')

  return (
    <div className="min-h-screen bg-cream text-ink-900">
      <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-10">
            <Logo />
            <nav className="hidden items-center gap-7 md:flex">
              {NAV.map((n) =>
                n.hash ? (
                  <a key={n.label} href={n.hash} className="text-sm font-semibold text-ink-600 transition hover:text-gold-600">
                    {n.label}
                  </a>
                ) : (
                  <Link key={n.label} to={n.to} className="text-sm font-semibold text-ink-600 transition hover:text-gold-600">
                    {n.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-600 transition hover:border-gold-300"
            >
              <Globe className="h-4 w-4" /> {i18n.language === 'ar' ? 'EN' : 'ع'}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && <Link to="/admin" className={pillClass}>{t('nav.adminPanel')}</Link>}
                {user.role === 'provider' && <Link to="/provider" className={pillClass}>{t('nav.dashboard')}</Link>}
                {user.role === 'customer' && (
                  <>
                    <Link to="/bookings" className={pillClass}>{t('nav.orders')}</Link>
                    <Link to="/wishlist" className={pillClass}>{t('nav.favorites')}</Link>
                  </>
                )}
                <span className="hidden text-sm font-semibold text-ink-700 sm:block">{user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-ink-800"
                >
                  <LogOut className="h-4 w-4" /> {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-gold-500 px-5 py-2 text-sm font-bold text-white shadow-amber transition hover:bg-gold-600"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-7 sm:flex-row">
          <Logo />
          <p className="text-sm text-ink-400">{t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  )
}
