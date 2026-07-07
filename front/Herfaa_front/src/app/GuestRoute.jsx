import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FullScreenLoader } from '@/components/ui/Spinner'

/** Routes only for signed-out visitors (login, register). */
export default function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <FullScreenLoader />
  if (isAuthenticated) return <Navigate to="/" replace />

  return children
}
