import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { bookingsApi } from '@/api/bookings'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const fieldCls = 'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400'

export default function BookingModal({ provider, onClose, onCreated }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [serverError, setServerError] = useState('')

  const mutation = useMutation({
    mutationFn: (data) =>
      bookingsApi.create({ provider_id: provider.id, ...data, service_id: data.service_id || null }),
    onSuccess: onCreated,
    onError: (e) => setServerError(e.response?.data?.message || 'تعذّر إرسال الطلب.'),
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">طلب حجز — {provider.name}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          {serverError && <Alert>{serverError}</Alert>}

          {provider.services?.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">الخدمة (اختياري)</label>
              <select {...register('service_id')} className={fieldCls} defaultValue="">
                <option value="">— حجز عام —</option>
                {provider.services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">وصف المطلوب</label>
            <textarea {...register('description', { required: true })} rows={3} placeholder="اشرح تفاصيل العمل المطلوب…" className={fieldCls} />
            {errors.description && <span className="mt-1 block text-xs text-danger">هذا الحقل مطلوب</span>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">العنوان</label>
            <input {...register('address')} placeholder="المدينة، الحي، الشارع" className={fieldCls} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">الموعد المفضّل (اختياري)</label>
            <input type="datetime-local" {...register('scheduled_at')} className={fieldCls} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
            <Button type="submit" loading={mutation.isPending}>إرسال الطلب</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
