import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FullScreenLoader } from '@/components/ui/Spinner'

/**
 * Guards a route by authentication, email verification, and (optionally) role.
 * Usage: <ProtectedRoute roles={['admin']}>…</ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />

  return children
}
