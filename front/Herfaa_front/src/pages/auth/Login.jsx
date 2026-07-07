import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

const schema = z.object({
  login: z.string().min(1, 'أدخل البريد الإلكتروني أو الهاتف'),
  password: z.string().min(1, 'أدخل كلمة المرور'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [serverError, setServerError] = useState('')
  const [role, setRole] = useState('customer')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const user = await login(data)
      navigate(user.home_path || '/', { replace: true })
    } catch (e) {
      setServerError(e.response?.data?.message || t('auth.loginError'))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">{t('auth.welcome')}</h1>
      <p className="mt-1 text-sm text-ink-500">{t('auth.loginSubtitle')}</p>

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
        <Field label={t('auth.emailOrPhone')} icon={Mail} placeholder="example@herfaa.ly" error={errors.login?.message} {...register('login')} />
        <Field label={t('auth.password')} icon={Lock} type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
        <Button type="submit" loading={isSubmitting} className="w-full">
          {t('auth.loginBtn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-bold text-gold-600">
          {t('auth.createAccountLink')}
        </Link>
      </p>
    </div>
  )
}
