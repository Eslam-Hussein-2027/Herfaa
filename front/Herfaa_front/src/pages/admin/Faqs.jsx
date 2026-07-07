import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { adminApi } from '@/api/admin'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

const inputCls = 'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400'

function FaqForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const { register, handleSubmit } = useForm({
    defaultValues: {
      question: initial?.question || '',
      answer: initial?.answer || '',
      sort_order: initial?.sort_order ?? 0,
      is_published: initial?.is_published ?? true,
    },
  })

  const mutation = useMutation({
    mutationFn: (d) => {
      const payload = { ...d, sort_order: Number(d.sort_order) || 0 }
      return isEdit ? adminApi.updateFaq(initial.id, payload) : adminApi.createFaq(payload)
    },
    onSuccess: onSaved,
  })

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">{isEdit ? 'تعديل سؤال' : 'سؤال جديد'}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-600"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">السؤال</label>
            <input {...register('question', { required: true })} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">الإجابة</label>
            <textarea {...register('answer', { required: true })} rows={4} className={inputCls} />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" {...register('is_published')} className="accent-gold-500" /> منشور
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-600">الترتيب</span>
              <input type="number" {...register('sort_order')} className="w-20 rounded-xl border border-ink-200 px-3 py-1.5 text-sm outline-none focus:border-gold-400" />
            </div>
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

export default function Faqs() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => (await adminApi.faqs()).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-faqs'] })
  const del = useMutation({ mutationFn: (id) => adminApi.deleteFaq(id), onSuccess: invalidate })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900">الأسئلة الشائعة</h1>
        <Button onClick={() => setEditing({})}><Plus className="h-4 w-4" /> إضافة سؤال</Button>
      </div>

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : (
        <div className="space-y-3">
          {data?.map((f) => (
            <div key={f.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink-900">{f.question}</h3>
                    {!f.is_published && <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-bold text-ink-500">مخفي</span>}
                  </div>
                  <p className="mt-1 text-sm text-ink-600">{f.answer}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => setEditing(f)} className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 hover:bg-ink-100"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(f.id)} className="grid h-9 w-9 place-items-center rounded-lg text-danger hover:bg-danger-bg"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <FaqForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); invalidate() }}
        />
      )}
    </div>
  )
}
