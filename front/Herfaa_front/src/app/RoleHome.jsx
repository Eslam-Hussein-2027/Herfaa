import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { FullScreenLoader } from '@/components/ui/Spinner'
import Home from '@/pages/public/Home'

/**
 * The "/" route. Providers and admins live inside their dashboards — they
 * never see the public marketing home. Customers and guests see Home.
 */
export default function RoleHome() {
  const { user, loading } = useAuth()

  if (loading) return <FullScreenLoader />

  if (user && user.home_path && user.home_path !== '/') {
    return <Navigate to={user.home_path} replace />
  }

  return <Home />
}
