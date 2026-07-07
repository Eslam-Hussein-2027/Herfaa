import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Star, Briefcase, Clock, User } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { useAuth } from '@/context/AuthContext'
import BookingStatusBadge from '@/components/booking/BookingStatusBadge'
import Spinner from '@/components/ui/Spinner'

const TINTS = {
  gold: 'bg-gold-50 text-gold-600',
  teal: 'bg-teal-50 text-teal-600',
}

function StatCard({ Icon, label, value, hint, tint = 'teal' }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-500">{label}</span>
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${TINTS[tint]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-ink-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-400">{hint}</div>}
    </div>
  )
}

function OrderRow({ booking, to }) {
  const inner = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-ink-900">{booking.service?.title || booking.description}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
          <User className="h-3.5 w-3.5" /> {booking.customer?.name}
          {booking.address ? ` · ${booking.address}` : ''}
        </p>
      </div>
      {to ? (
        booking.agreed_price != null && (
          <span className="whitespace-nowrap text-sm font-bold text-gold-700">{booking.agreed_price} LYD</span>
        )
      ) : (
        <BookingStatusBadge status={booking.status} />
      )}
    </div>
  )
  return to ? (
    <Link to={to} className="block rounded-xl border border-ink-100 p-4 transition hover:border-gold-300">{inner}</Link>
  ) : (
    <div className="rounded-xl border border-ink-100 p-4">{inner}</div>
  )
}

export default function ProviderDashboard() {
  const { user } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['provider-dashboard'],
    queryFn: async () => (await providersApi.dashboard()).data.data,
  })

  if (isLoading) {
    return <div className="grid h-64 place-items-center text-gold-500"><Spinner /></div>
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-10 text-center text-ink-500">
        تعذّر تحميل لوحة التحكم. تأكّد من تشغيل الخادم ثم حدّث الصفحة.
      </div>
    )
  }

  const stats = data.stats
  const pending = data.pending || []
  const active = data.active || []
  const greeting = new Date().getHours() < 12 ? 'صباح الخير' : 'مساء الخير'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">{greeting}، {user?.name}</h1>
          <p className="mt-1 text-sm text-ink-500">
            لديك {active.length} مهمة قيد التنفيذ و{pending.length} طلب بانتظار ردّك.
          </p>
        </div>
        <Link
          to="/provider/bookings"
          className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-white shadow-amber transition hover:bg-gold-600"
        >
          الطلبات الجديدة ({pending.length})
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard Icon={Star} label="متوسط التقييم" value={stats.rating_avg} hint={`من ${stats.rating_count} تقييم`} tint="gold" />
        <StatCard Icon={Briefcase} label="مهام منجزة" value={stats.completed_bookings} hint="إجمالي المكتمل" tint="teal" />
        <StatCard Icon={Clock} label="طلبات نشطة" value={stats.active_bookings} hint="بانتظار/قيد التنفيذ" tint="teal" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New orders */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-900">طلبات جديدة</h2>
            <Link to="/provider/bookings" className="text-sm font-semibold text-gold-600 hover:text-gold-700">عرض الكل</Link>
          </div>
          {pending.length ? (
            <div className="space-y-3">
              {pending.map((b) => <OrderRow key={b.id} booking={b} to="/provider/bookings" />)}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-ink-400">لا توجد طلبات جديدة.</p>
          )}
        </section>

        {/* Active tasks */}
        <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink-900">مهام قيد التنفيذ</h2>
            <Link to="/provider/bookings" className="text-sm font-semibold text-gold-600 hover:text-gold-700">عرض الكل</Link>
          </div>
          {active.length ? (
            <div className="space-y-3">
              {active.map((b) => <OrderRow key={b.id} booking={b} />)}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-ink-400">لا توجد مهام نشطة حالياً.</p>
          )}
        </section>
      </div>
    </div>
  )
}
