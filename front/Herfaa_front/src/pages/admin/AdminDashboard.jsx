import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Users, BadgeCheck, Clock, CalendarCheck, Star, LayoutGrid } from 'lucide-react'
import { adminApi } from '@/api/admin'
import Spinner from '@/components/ui/Spinner'

const TINTS = {
  gold: 'bg-gold-50 text-gold-600',
  teal: 'bg-teal-50 text-teal-600',
  ink: 'bg-ink-100 text-ink-600',
}

function Card({ Icon, label, value, tint = 'ink', to }) {
  const inner = (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${TINTS[tint]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-2xl font-extrabold text-ink-900">{value}</div>
          <div className="text-xs text-ink-500">{label}</div>
        </div>
      </div>
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const { data: s, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await adminApi.stats()).data.data,
  })

  if (isLoading) {
    return <div className="grid h-64 place-items-center text-gold-500"><Spinner /></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">لوحة التحكم</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card Icon={Clock} label="حِرفيّون بانتظار الاعتماد" value={s.pending_providers} tint="gold" to="/admin/providers?status=pending" />
        <Card Icon={BadgeCheck} label="إجمالي الحِرفيّين" value={s.providers} tint="teal" />
        <Card Icon={Users} label="العملاء" value={s.customers} />
        <Card Icon={CalendarCheck} label="إجمالي الطلبات" value={s.total_bookings} tint="teal" />
        <Card Icon={Star} label="التقييمات" value={s.total_reviews} tint="gold" />
        <Card Icon={LayoutGrid} label="الفئات" value={s.categories} />
      </div>
    </div>
  )
}
