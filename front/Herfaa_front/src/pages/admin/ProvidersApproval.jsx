import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'
import { APPROVAL_STATUS } from '@/lib/adminStatus'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Pagination from '@/components/ui/Pagination'

const TABS = [
  ['', 'الكل'],
  ['pending', 'بالانتظار'],
  ['approved', 'معتمد'],
  ['rejected', 'مرفوض'],
  ['suspended', 'موقوف'],
]

export default function ProvidersApproval() {
  const qc = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-providers', status, page],
    queryFn: async () => (await adminApi.providers({ status: status || undefined, page })).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-providers'] })
  const approve = useMutation({ mutationFn: (id) => adminApi.approveProvider(id), onSuccess: invalidate })
  const suspend = useMutation({ mutationFn: (id) => adminApi.suspendProvider(id), onSuccess: invalidate })
  const reject = useMutation({ mutationFn: ({ id, reason }) => adminApi.rejectProvider(id, reason), onSuccess: invalidate })

  const onReject = (id) => {
    const r = window.prompt('سبب الرفض؟')
    if (r) reject.mutate({ id, reason: r })
  }

  const setStatus = (s) => {
    setPage(1)
    const n = new URLSearchParams(searchParams)
    s ? n.set('status', s) : n.delete('status')
    setSearchParams(n)
  }

  const items = data?.items || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">اعتماد الحِرفيّين</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map(([v, l]) => (
          <button
            key={v}
            onClick={() => setStatus(v)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${
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
          {items.map((p) => {
            const s = APPROVAL_STATUS[p.approval_status]
            return (
              <div key={p.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-ink-900">{p.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.cls}`}>{s.label}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500">{p.headline || '—'} · {p.category || '—'}</p>
                    <p className="mt-1 text-xs text-ink-400">{p.email} · {p.phone || '—'} · {p.city || '—'}</p>
                    {p.rejection_reason && <p className="mt-1 text-xs text-danger">سبب الرفض: {p.rejection_reason}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.approval_status !== 'approved' && <Button onClick={() => approve.mutate(p.id)}>اعتماد</Button>}
                    {p.approval_status !== 'rejected' && <Button variant="ghost" onClick={() => onReject(p.id)}>رفض</Button>}
                    {p.approval_status !== 'suspended' && <Button variant="ghost" onClick={() => suspend.mutate(p.id)}>إيقاف</Button>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا يوجد حِرفيّون في هذه القائمة.
        </div>
      )}

      <Pagination meta={data?.meta} onPage={setPage} />
    </div>
  )
}
