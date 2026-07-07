import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/api/bookings'
import BookingCard from '@/components/booking/BookingCard'
import ReviewModal from '@/components/review/ReviewModal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const TABS = [
  ['', 'الكل'],
  ['pending', 'بالانتظار'],
  ['accepted', 'مقبولة'],
  ['in_progress', 'قيد التنفيذ'],
  ['completed', 'مكتملة'],
]

export default function MyBookings() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('')
  const [reviewing, setReviewing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings', status],
    queryFn: async () => (await bookingsApi.list(status ? { status } : {})).data.data,
  })

  const cancel = useMutation({
    mutationFn: (id) => bookingsApi.cancel(id, 'ألغى العميل الطلب'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-bookings'] }),
  })

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-2xl font-extrabold text-ink-900">طلباتي</h1>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setStatus(v)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              status === v ? 'bg-gold-500 text-white' : 'border border-ink-200 bg-white text-ink-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-8 grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : data?.length ? (
        <div className="mt-6 space-y-4">
          {data.map((b) => (
            <BookingCard key={b.id} booking={b} perspective="customer">
              {b.status === 'pending' && (
                <Button variant="ghost" onClick={() => cancel.mutate(b.id)}>إلغاء الطلب</Button>
              )}
              {b.status === 'completed' &&
                (b.reviewed ? (
                  <span className="self-center text-sm font-semibold text-teal-600">تم التقييم ✓</span>
                ) : (
                  <Button onClick={() => setReviewing(b)}>قيّم الحِرفي</Button>
                ))}
            </BookingCard>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا توجد طلبات بعد — تصفّح الحِرفيّين وأرسل أول طلب حجز.
        </div>
      )}

      {reviewing && (
        <ReviewModal
          booking={reviewing}
          onClose={() => setReviewing(null)}
          onSubmitted={() => {
            setReviewing(null)
            qc.invalidateQueries({ queryKey: ['my-bookings'] })
          }}
        />
      )}
    </div>
  )
}
