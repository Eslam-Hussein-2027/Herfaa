import { Phone, MapPin, Calendar, User } from 'lucide-react'
import BookingStatusBadge from './BookingStatusBadge'
import { FLOW, STEP_LABEL } from '@/lib/bookingStatus'

function StatusSteps({ status }) {
  if (status === 'rejected' || status === 'cancelled') return null
  const idx = FLOW.indexOf(status)

  return (
    <div className="flex items-center">
      {FLOW.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`h-3 w-3 rounded-full ${i <= idx ? 'bg-teal-600' : 'bg-ink-200'}`} />
            <span className={`mt-1 text-[11px] font-semibold ${i <= idx ? 'text-teal-700' : 'text-ink-300'}`}>
              {STEP_LABEL[s]}
            </span>
          </div>
          {i < FLOW.length - 1 && (
            <div className={`mx-1 mb-4 h-0.5 flex-1 ${i < idx ? 'bg-teal-500' : 'bg-ink-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function BookingCard({ booking, perspective, children }) {
  const b = booking
  const counterpart = perspective === 'provider' ? b.customer : b.provider
  const counterLabel = perspective === 'provider' ? 'العميل' : 'الحِرفي'

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-ink-900">{b.service?.title || 'طلب خدمة'}</h3>
          <p className="mt-0.5 text-xs text-ink-400">#{b.id}</p>
        </div>
        <BookingStatusBadge status={b.status} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-600">{b.description}</p>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <User className="h-4 w-4 text-ink-400" /> {counterLabel}: {counterpart?.name}
        </span>
        {b.address && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-ink-400" /> {b.address}
          </span>
        )}
        {b.scheduled_at && (
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-ink-400" /> {new Date(b.scheduled_at).toLocaleString('ar')}
          </span>
        )}
        {b.agreed_price != null && (
          <span className="font-semibold text-gold-700">{b.agreed_price} د.ل (نقداً)</span>
        )}
        {counterpart?.phone && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700">
            <Phone className="h-4 w-4" /> {counterpart.phone}
          </span>
        )}
      </div>

      {(b.status === 'rejected' || b.status === 'cancelled') && b.status_reason && (
        <p className="mt-3 rounded-lg bg-ink-100 px-3 py-2 text-sm text-ink-500">السبب: {b.status_reason}</p>
      )}

      <div className="mt-4">
        <StatusSteps status={b.status} />
      </div>

      {children && <div className="mt-4 flex flex-wrap justify-end gap-2">{children}</div>}
    </div>
  )
}
