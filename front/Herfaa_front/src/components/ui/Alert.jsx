export default function Alert({ type = 'error', children }) {
  const styles =
    type === 'success'
      ? 'bg-success-bg text-success'
      : 'bg-danger-bg text-danger'
  return <div className={`rounded-xl px-4 py-3 text-sm ${styles}`}>{children}</div>
}
