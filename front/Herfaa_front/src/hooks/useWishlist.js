import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/api/wishlist'
import { useAuth } from '@/context/AuthContext'

/**
 * Shared wishlist state (one React Query cache for all favorite buttons).
 * Only active for authenticated customers.
 */
export function useWishlist() {
  const { user, isAuthenticated } = useAuth()
  const enabled = isAuthenticated && user?.role === 'customer'
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => (await wishlistApi.list()).data.data,
    enabled,
  })

  const ids = new Set((data || []).map((p) => p.id))
  const invalidate = () => qc.invalidateQueries({ queryKey: ['wishlist'] })
  const add = useMutation({ mutationFn: (id) => wishlistApi.add(id), onSuccess: invalidate })
  const remove = useMutation({ mutationFn: (id) => wishlistApi.remove(id), onSuccess: invalidate })

  return {
    enabled,
    favorites: data || [],
    isFavorite: (id) => ids.has(id),
    toggle: (id) => (ids.has(id) ? remove.mutate(id) : add.mutate(id)),
  }
}
