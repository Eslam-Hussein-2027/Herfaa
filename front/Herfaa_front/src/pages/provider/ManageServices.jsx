import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { PRICE_UNITS, PRICE_UNIT_LABEL } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const inputCls = 'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400'

function ServiceForm({ initial, categories, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: initial?.title || '',
      description: initial?.description || '',
      category_id: initial?.category?.id || '',
      price: initial?.price ?? '',
      price_unit: initial?.price_unit || 'fixed',
    },
  })

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data, category_id: data.category_id || null, price: data.price === '' ? null : data.price }
      return isEdit ? providersApi.updateService(initial.id, payload) : providersApi.createService(payload)
    },
    onSuccess: onSaved,
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">{isEdit ? 'تعديل الخدمة' : 'خدمة جديدة'}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">عنوان الخدمة</label>
            <input {...register('title', { required: true })} placeholder="مثال: تركيب مطبخ خشبي" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">الوصف</label>
            <textarea {...register('description')} rows={3} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">السعر (د.ل)</label>
              <input type="number" step="0.01" min="0" {...register('price')} className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">وحدة السعر</label>
              <select {...register('price_unit')} className={inputCls}>
                {PRICE_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">المهنة</label>
            <select {...register('category_id')} className={inputCls}>
              <option value="">— بدون —</option>
              {categories?.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
            <Button type="submit" loading={mutation.isPending}>حفظ</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ManageServices() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)

  const { data: services, isLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: async () => (await providersApi.services()).data.data,
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await providersApi.categories()).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['my-services'] })
  const del = useMutation({ mutationFn: (id) => providersApi.deleteService(id), onSuccess: invalidate })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900">خدماتي</h1>
        <Button onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" /> إضافة خدمة
        </Button>
      </div>

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : services?.length ? (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
              <div className="min-w-0">
                <h3 className="font-bold text-ink-900">{s.title}</h3>
                {s.description && <p className="mt-1 text-sm text-ink-500">{s.description}</p>}
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {s.price != null && <span className="rounded-full bg-cream-deep px-2.5 py-1 font-semibold text-gold-700">{s.price} د.ل · {PRICE_UNIT_LABEL[s.price_unit]}</span>}
                  {s.category && <span className="rounded-full bg-teal-50 px-2.5 py-1 font-semibold text-teal-700">{s.category.name_ar}</span>}
                  {!s.is_active && <span className="rounded-full bg-ink-100 px-2.5 py-1 font-semibold text-ink-500">غير مفعّلة</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => setEditing(s)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => del.mutate(s.id)} className="grid h-9 w-9 place-items-center rounded-lg text-danger hover:bg-danger-bg"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا توجد خدمات بعد — أضف أول خدمة لك.
        </div>
      )}

      {editing && (
        <ServiceForm
          initial={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidate() }}
        />
      )}
    </div>
  )
}
