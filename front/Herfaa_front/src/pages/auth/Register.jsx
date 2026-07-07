import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { CITIES } from '@/lib/constants'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const schema = z
  .object({
    name: z.string().min(2, 'أدخل الاسم الكامل'),
    email: z.string().email('بريد إلكتروني غير صحيح'),
    phone: z.string().optional(),
    city: z.string().optional(),
    password: z.string().min(8, 'كلمة المرور 8 أحرف على الأقل'),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'تأكيد كلمة المرور غير مطابق',
    path: ['password_confirmation'],
  })

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [role, setRole] = useState('customer')
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const user = await registerUser({ ...data, role })
      navigate(user.home_path || '/', { replace: true })
    } catch (e) {
      const res = e.response?.data
      if (res?.errors) {
        Object.entries(res.errors).forEach(([field, msgs]) => setError(field, { message: msgs[0] }))
      }
      setServerError(res?.message || t('auth.registerError'))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">{t('auth.registerTitle')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('auth.registerSubtitle')}</p>

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-ink-100 p-1">
        {[['customer', t('auth.iAmCustomer')], ['provider', t('auth.iAmProvider')]].map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => setRole(v)}
            className={`rounded-full py-2 text-sm font-semibold transition ${
              role === v ? 'bg-white text-gold-600 shadow-sm' : 'text-ink-500'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {serverError && <Alert>{serverError}</Alert>}
        <Field label={t('auth.fullName')} icon={User} placeholder={t('auth.namePlaceholder')} error={errors.name?.message} {...register('name')} />
        <Field label={t('auth.email')} icon={Mail} placeholder="example@herfaa.ly" error={errors.email?.message} {...register('email')} />
        <Field label={t('auth.phoneOptional')} icon={Phone} placeholder="09xxxxxxxx" error={errors.phone?.message} {...register('phone')} />

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t('auth.cityOptional')}</span>
          <select
            className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold-400"
            defaultValue=""
            {...register('city')}
          >
            <option value="" disabled>{t('auth.chooseCity')}</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <Field label={t('auth.password')} icon={Lock} type="password" placeholder={t('auth.min8')} error={errors.password?.message} {...register('password')} />
        <Field label={t('auth.passwordConfirm')} icon={Lock} type="password" placeholder={t('auth.reenter')} error={errors.password_confirmation?.message} {...register('password_confirmation')} />

        <Button type="submit" loading={isSubmitting} className="w-full">
          {t('auth.createAccountBtn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-bold text-gold-600">
          {t('auth.loginBtn')}
        </Link>
      </p>
    </div>
  )
}
