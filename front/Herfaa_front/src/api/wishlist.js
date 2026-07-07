import api from '@/lib/api'

/** Module 5 — Wishlist (Favorites). */
export const wishlistApi = {
  list: () => api.get('/wishlist'),
  add: (providerId) => api.post(`/wishlist/${providerId}`),
  remove: (providerId) => api.delete(`/wishlist/${providerId}`),
}
