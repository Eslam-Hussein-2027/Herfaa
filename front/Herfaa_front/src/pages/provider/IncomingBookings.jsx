import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/api/bookings'
import BookingCard from '@/components/booking/BookingCard'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const TABS = [
  ['', 'الكل'],
  ['pending', 'الجديدة'],
  ['accepted', 'مقبولة'],
  ['in_progress', 'قيد التنفيذ'],
  ['completed', 'مكتملة'],
]

export default function IncomingBookings() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['incoming-bookings', status],
    queryFn: async () => (await bookingsApi.list(status ? { status } : {})).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['incoming-bookings'] })
  const accept = useMutation({ mutationFn: (id) => bookingsApi.accept(id), onSuccess: invalidate })
  const start = useMutation({ mutationFn: (id) => bookingsApi.start(id), onSuccess: invalidate })
  const complete = useMutation({ mutationFn: (id) => bookingsApi.complete(id), onSuccess: invalidate })
  const reject = useMutation({ mutationFn: ({ id, reason }) => bookingsApi.reject(id, reason), onSuccess: invalidate })

  const onReject = (id) => {
    const reason = window.prompt('سبب الرفض؟')
    if (reason) reject.mutate({ id, reason })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">الطلبات الواردة</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
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
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : data?.length ? (
        <div className="space-y-4">
          {data.map((b) => (
            <BookingCard key={b.id} booking={b} perspective="provider">
              {b.status === 'pending' && (
                <>
                  <Button variant="ghost" onClick={() => onReject(b.id)}>رفض</Button>
                  <Button onClick={() => accept.mutate(b.id)}>قبول</Button>
                </>
              )}
              {b.status === 'accepted' && (
                <Button variant="teal" onClick={() => start.mutate(b.id)}>بدء التنفيذ</Button>
              )}
              {b.status === 'in_progress' && (
                <Button onClick={() => complete.mutate(b.id)}>إنجاز الطلب</Button>
              )}
            </BookingCard>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا توجد طلبات واردة بعد.
        </div>
      )}
    </div>
  )
}
