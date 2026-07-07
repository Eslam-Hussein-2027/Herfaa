export default function Spinner({ small = false }) {
  const size = small ? 'h-4 w-4' : 'h-8 w-8'
  return (
    <span
      className={`inline-block ${size} animate-spin rounded-full border-2 border-current border-t-transparent`}
      role="status"
      aria-label="جارٍ التحميل"
    />
  )
}

export function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream text-gold-500">
      <Spinner />
    </div>
  )
}
