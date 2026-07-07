import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import GuestRoute from '@/app/GuestRoute'
import ProtectedRoute from '@/app/ProtectedRoute'
import RoleHome from '@/app/RoleHome'
import Search from '@/pages/public/Search'
import ProviderProfile from '@/pages/public/ProviderProfile'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import EditProfile from '@/pages/provider/EditProfile'
import ManageServices from '@/pages/provider/ManageServices'
import ManagePortfolio from '@/pages/provider/ManagePortfolio'
import IncomingBookings from '@/pages/provider/IncomingBookings'
import ProviderDashboard from '@/pages/provider/ProviderDashboard'
import MyBookings from '@/pages/customer/MyBookings'
import Wishlist from '@/pages/customer/Wishlist'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProvidersApproval from '@/pages/admin/ProvidersApproval'
import AdminUsers from '@/pages/admin/Users'
import AdminCategories from '@/pages/admin/Categories'
import AdminReviews from '@/pages/admin/Reviews'
import AdminFaqs from '@/pages/admin/Faqs'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <RoleHome /> },
      { path: '/search', element: <Search /> },
      { path: '/providers/:id', element: <ProviderProfile /> },
      { path: '/bookings', element: <ProtectedRoute roles={['customer']}><MyBookings /></ProtectedRoute> },
      { path: '/wishlist', element: <ProtectedRoute roles={['customer']}><Wishlist /></ProtectedRoute> },
    ],
  },
  {
    element: (
      <ProtectedRoute roles={['provider']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/provider', element: <ProviderDashboard /> },
      { path: '/provider/profile', element: <EditProfile /> },
      { path: '/provider/bookings', element: <IncomingBookings /> },
      { path: '/provider/services', element: <ManageServices /> },
      { path: '/provider/portfolio', element: <ManagePortfolio /> },
    ],
  },
  {
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/providers', element: <ProvidersApproval /> },
      { path: '/admin/users', element: <AdminUsers /> },
      { path: '/admin/categories', element: <AdminCategories /> },
      { path: '/admin/reviews', element: <AdminReviews /> },
      { path: '/admin/faqs', element: <AdminFaqs /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <GuestRoute><Login /></GuestRoute> },
      { path: '/register', element: <GuestRoute><Register /></GuestRoute> },
    ],
  },
])
