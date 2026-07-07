import { forwardRef } from 'react'

const Field = forwardRef(function Field({ label, error, icon: Icon, ...props }, ref) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</span>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 transition ${
          error ? 'border-danger' : 'border-ink-200 focus-within:border-gold-400'
        }`}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-ink-400" />}
        <input
          ref={ref}
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-400"
          {...props}
        />
      </div>
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  )
})

export default Field
