import { BOOKING_STATUS } from '@/lib/bookingStatus'

export default function BookingStatusBadge({ status }) {
  const s = BOOKING_STATUS[status] || BOOKING_STATUS.pending
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>
}
