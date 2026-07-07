import Spinner from './Spinner'

const VARIANTS = {
  primary: 'bg-gold-500 text-white shadow-amber hover:bg-gold-600',
  teal: 'bg-teal-700 text-white hover:bg-teal-800',
  ghost: 'border border-ink-200 bg-white text-ink-700 hover:border-gold-300',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner small />}
      {children}
    </button>
  )
}
