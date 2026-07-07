import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { adminApi } from '@/api/admin'
import StarRating from '@/components/review/StarRating'
import Spinner from '@/components/ui/Spinner'
import Pagination from '@/components/ui/Pagination'

const TABS = [['', 'الكل'], ['visible', 'ظاهرة'], ['hidden', 'مخفية']]

export default function Reviews() {
  const qc = useQueryClient()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', status, page],
    queryFn: async () => (await adminApi.reviews({ status: status || undefined, page })).data.data,
  })

  const moderate = useMutation({
    mutationFn: ({ id, status }) => adminApi.moderateReview(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-reviews'] }),
  })

  const items = data?.items || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">التقييمات</h1>

      <div className="flex gap-1.5">
        {TABS.map(([v, l]) => (
          <button
            key={v}
            onClick={() => { setStatus(v); setPage(1) }}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              status === v ? 'bg-gold-500 text-white' : 'border border-ink-200 bg-white text-ink-600'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <StarRating value={r.rating} size="h-4 w-4" />
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.status === 'hidden' ? 'bg-ink-100 text-ink-500' : 'bg-success-bg text-success'}`}>
                      {r.status === 'hidden' ? 'مخفي' : 'ظاهر'}
                    </span>
                  </div>
                  {r.comment && <p className="mt-2 text-sm text-ink-600">{r.comment}</p>}
                  <p className="mt-1 text-xs text-ink-400">{r.customer_name} ← {r.provider_name}</p>
                </div>
                {r.status === 'visible' ? (
                  <button onClick={() => moderate.mutate({ id: r.id, status: 'hidden' })} className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-danger hover:bg-danger-bg">
                    <EyeOff className="h-4 w-4" /> إخفاء
                  </button>
                ) : (
                  <button onClick={() => moderate.mutate({ id: r.id, status: 'visible' })} className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-success hover:bg-success-bg">
                    <Eye className="h-4 w-4" /> إظهار
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا توجد تقييمات.
        </div>
      )}

      <Pagination meta={data?.meta} onPage={setPage} />
    </div>
  )
}
