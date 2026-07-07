import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, X, ShieldCheck, Clock, CircleX } from 'lucide-react'
import { providersApi } from '@/api/providers'
import { CITIES, PRICE_UNITS } from '@/lib/constants'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'

const STATUS = {
  pending: { cls: 'bg-gold-50 text-gold-700', Icon: Clock, text: 'حسابك قيد المراجعة من الإدارة — يمكنك إكمال ملفك الآن.' },
  approved: { cls: 'bg-success-bg text-success', Icon: ShieldCheck, text: 'حسابك معتمد وظاهر للعملاء في البحث.' },
  rejected: { cls: 'bg-danger-bg text-danger', Icon: CircleX, text: 'تم رفض الحساب — راجع السبب وحدّث بياناتك.' },
  suspended: { cls: 'bg-danger-bg text-danger', Icon: CircleX, text: 'تم إيقاف الحساب — تواصل مع الدعم.' },
}

const inputCls = 'w-full rounded-xl border border-ink-200 px-3 py-2.5 text-sm outline-none focus:border-gold-400'

export default function EditProfile() {
  const qc = useQueryClient()
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => (await providersApi.myProfile()).data.data,
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await providersApi.categories()).data.data,
  })

  const { register, handleSubmit, reset } = useForm()
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    if (!profile) return
    reset({
      headline: profile.headline || '',
      category_id: profile.category?.id || '',
      city: profile.city || '',
      address: profile.address || '',
      base_price: profile.base_price ?? '',
      price_unit: profile.price_unit || 'visit',
      bio: profile.bio || '',
    })
    setSkills(profile.skills?.map((s) => s.name) || [])
  }, [profile, reset])

  const mutation = useMutation({
    mutationFn: async (data) => {
      await providersApi.updateProfile({
        ...data,
        category_id: data.category_id || null,
        base_price: data.base_price === '' ? null : data.base_price,
      })
      await providersApi.syncSkills(skills)
    },
    onSuccess: () => {
      setSaved('تم حفظ التغييرات بنجاح.')
      qc.invalidateQueries({ queryKey: ['my-profile'] })
    },
  })

  const addSkill = () => {
    const v = skillInput.trim()
    if (v && !skills.includes(v)) setSkills([...skills, v])
    setSkillInput('')
  }

  if (isLoading)
    return (
      <div className="grid h-64 place-items-center text-gold-500">
        <Spinner />
      </div>
    )

  const banner = STATUS[profile?.approval_status] || STATUS.pending

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-ink-900">ملفي الشخصي</h1>

      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${banner.cls}`}>
        <banner.Icon className="h-5 w-5" /> {banner.text}
      </div>
      {profile?.approval_status === 'rejected' && profile?.rejection_reason && (
        <Alert>سبب الرفض: {profile.rejection_reason}</Alert>
      )}

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm"
      >
        {saved && <Alert type="success">{saved}</Alert>}

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">العنوان المهني</label>
          <input {...register('headline')} placeholder="مثال: نجّار محترف بخبرة 10 سنوات" className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">المهنة</label>
            <select {...register('category_id')} className={inputCls}>
              <option value="">اختر المهنة</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name_ar}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">المدينة</label>
            <select {...register('city')} className={inputCls}>
              <option value="">اختر المدينة</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">العنوان التفصيلي</label>
          <input {...register('address')} placeholder="الحي / الشارع" className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">السعر الأساسي (د.ل)</label>
            <input type="number" step="0.01" min="0" {...register('base_price')} placeholder="50" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink-700">وحدة السعر</label>
            <select {...register('price_unit')} className={inputCls}>
              {PRICE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">نبذة</label>
          <textarea {...register('bio')} rows={4} placeholder="اكتب نبذة عن خبرتك وخدماتك…" className={inputCls} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink-700">المهارات</label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="أضف مهارة واضغط Enter"
              className={`flex-1 ${inputCls}`}
            />
            <button type="button" onClick={addSkill} className="grid w-11 place-items-center rounded-xl bg-teal-700 text-white hover:bg-teal-800">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  {s}
                  <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" loading={mutation.isPending}>حفظ التغييرات</Button>
      </form>
    </div>
  )
}
