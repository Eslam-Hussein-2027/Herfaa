import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { adminApi } from '@/api/admin'
import { APPROVAL_STATUS, USER_STATUS } from '@/lib/adminStatus'
import Spinner from '@/components/ui/Spinner'
import Pagination from '@/components/ui/Pagination'

const ROLE_TABS = [['', 'الكل'], ['customer', 'العملاء'], ['provider', 'الحِرفيّون'], ['admin', 'المدراء']]
const ROLE_LABEL = { customer: 'عميل', provider: 'حِرفي', admin: 'مدير' }

export default function Users() {
  const qc = useQueryClient()
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', role, search, page],
    queryFn: async () => (await adminApi.users({ role: role || undefined, search: search || undefined, page })).data.data,
  })

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-users'] })
  const suspend = useMutation({ mutationFn: (id) => adminApi.suspendUser(id), onSuccess: invalidate })
  const activate = useMutation({ mutationFn: (id) => adminApi.activateUser(id), onSuccess: invalidate })

  const items = data?.items || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">المستخدمون</h1>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          {ROLE_TABS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setRole(v); setPage(1) }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                role === v ? 'bg-gold-500 text-white' : 'border border-ink-200 bg-white text-ink-600'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5">
          <Search className="h-4 w-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="بحث بالاسم/البريد/الهاتف"
            className="w-44 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid h-48 place-items-center text-gold-500"><Spinner /></div>
      ) : items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-ink-500">
              <tr>
                <th className="p-3 text-start font-semibold">الاسم</th>
                <th className="p-3 text-start font-semibold">الدور</th>
                <th className="p-3 text-start font-semibold">الحالة</th>
                <th className="p-3 text-start font-semibold">الهاتف</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((u) => {
                const us = USER_STATUS[u.status]
                return (
                  <tr key={u.id} className="border-b border-ink-100 last:border-0">
                    <td className="p-3">
                      <div className="font-semibold text-ink-900">{u.name}</div>
                      <div className="text-xs text-ink-400">{u.email}</div>
                    </td>
                    <td className="p-3 text-ink-600">
                      {ROLE_LABEL[u.role]}
                      {u.role === 'provider' && u.provider_approval && (
                        <span className={`ms-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${APPROVAL_STATUS[u.provider_approval]?.cls}`}>
                          {APPROVAL_STATUS[u.provider_approval]?.label}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${us.cls}`}>{us.label}</span>
                    </td>
                    <td className="p-3 text-ink-600">{u.phone || '—'}</td>
                    <td className="p-3 text-end">
                      {u.role !== 'admin' &&
                        (u.status === 'active' ? (
                          <button onClick={() => suspend.mutate(u.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger-bg">إيقاف</button>
                        ) : (
                          <button onClick={() => activate.mutate(u.id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-success hover:bg-success-bg">تفعيل</button>
                        ))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center text-ink-400">
          لا يوجد مستخدمون مطابقون.
        </div>
      )}

      <Pagination meta={data?.meta} onPage={setPage} />
    </div>
  )
}
