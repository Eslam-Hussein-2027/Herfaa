import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, ImagePlus } from 'lucide-react'
import { providersApi } from '@/api/providers'
import Spinner from '@/components/ui/Spinner'
import Alert from '@/components/ui/Alert'

export default function ManagePortfolio() {
  const qc = useQueryClient()
  const fileRef = useRef(null)
  const [error, setError] = useState('')

  const { data: items, isLoading } = useQuery({
    queryKey: ['my-portfolio'],
    queryFn: async () => (await providersApi.portfolio()).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['my-portfolio'] })

  const upload = useMutation({
    mutationFn: (file) => {
      const fd = new FormData()
      fd.append('image', file)
      return providersApi.uploadPortfolio(fd)
    },
    onSuccess: () => { setError(''); invalidate() },
    onError: (e) => setError(e.response?.data?.message || 'تعذّر رفع الصورة.'),
  })

  const del = useMutation({ mutationFn: (id) => providersApi.deletePortfolio(id), onSuccess: invalidate })

  const onPick = (e) => {
    const file = e.target.files?.[0]
    if (file) upload.mutate(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-900">معرض الأعمال</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={upload.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-white shadow-amber transition hover:bg-gold-600 disabled:opacity-60"
        >
          {upload.isPending ? <Spinner small /> : <Upload className="h-4 w-4" />} رفع صورة
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
      </div>

      {error && <Alert>{error}</Alert>}

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : items?.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
              <img src={item.image_url} alt={item.caption || ''} className="aspect-square w-full object-cover" />
              <button
                onClick={() => del.mutate(item.id)}
                className="absolute end-2 top-2 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-danger opacity-0 shadow transition group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-ink-300 bg-white py-16 text-ink-400 transition hover:border-gold-300 hover:text-gold-600"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="text-sm font-semibold">ارفع أول صورة لأعمالك</span>
        </button>
      )}
    </div>
  )
}
