import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { reviewsApi } from '@/api/reviews'
import StarRating from '@/components/review/StarRating'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

export default function ReviewModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [err, setErr] = useState('')

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create(booking.id, { rating, comment: comment || null }),
    onSuccess: onSubmitted,
    onError: (e) => setErr(e.response?.data?.message || 'تعذّر إرسال التقييم.'),
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">قيّم الحِرفي</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X className="h-5 w-5" /></button>
        </div>
        <p className="text-sm text-ink-500">{booking.provider?.name}</p>

        {err && <div className="mt-3"><Alert>{err}</Alert></div>}

        <div className="mt-4 flex justify-center">
          <StarRating value={rating} onChange={setRating} readonly={false} size="h-9 w-9" />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="شاركنا تجربتك (اختياري)…"
          className="mt-4 w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400"
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>إرسال التقييم</Button>
        </div>
      </div>
    </div>
  )
}
