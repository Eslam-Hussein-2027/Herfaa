import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { adminApi } from '@/api/admin'
import { categoryIcon } from '@/lib/icons'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const inputCls = 'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400'

function CategoryForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name_ar: initial?.name_ar || '',
      name_en: initial?.name_en || '',
      icon: initial?.icon || '',
      sort_order: initial?.sort_order ?? 0,
      is_active: initial?.is_active ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (d) => {
      const payload = { ...d, sort_order: Number(d.sort_order) || 0 }
      return isEdit ? adminApi.updateCategory(initial.id, payload) : adminApi.createCategory(payload)
    },
    onSuccess: onSaved,
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">{isEdit ? 'تعديل فئة' : 'فئة جديدة'}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">الاسم (عربي)</label>
            <input {...register('name_ar', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">الاسم (إنجليزي)</label>
            <input {...register('name_en', { required: true })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">الأيقونة (Lucide)</label>
              <input {...register('icon')} placeholder="Hammer" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink-700">الترتيب</label>
              <input type="number" {...register('sort_order')} className={inputCls} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" {...register('is_active')} className="accent-gold-500" /> مفعّلة
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>إلغاء</Button>
            <Button type="submit" loading={mutation.isPending}>حفظ</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Categories() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await adminApi.categories()).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-categories'] })
  const del = useMutation({ mutationFn: (id) => adminApi.deleteCategory(id), onSuccess: invalidate })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900">الفئات</h1>
        <Button onClick={() => setEditing({})}><Plus className="h-4 w-4" /> إضافة فئة</Button>
      </div>

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((c) => {
            const Icon = categoryIcon(c.icon)
            return (
              <div key={c.id} className="flex items-center justify-between rounded-2xl border border-ink-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-cream-deep text-gold-600"><Icon className="h-5 w-5" /></span>
                  <div>
                    <div className="font-bold text-ink-900">{c.name_ar}</div>
                    <div className="text-xs text-ink-400">{c.name_en}{!c.is_active && ' · غير مفعّلة'}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(c.id)} className="grid h-9 w-9 place-items-center rounded-lg text-danger hover:bg-danger-bg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <CategoryForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidate() }}
        />
      )}
    </div>
  )
}
