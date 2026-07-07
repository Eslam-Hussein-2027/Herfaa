import api from '@/lib/api'

/** Module 6 — Reviews & Ratings. */
export const reviewsApi = {
  providerReviews: (providerId) => api.get(`/providers/${providerId}/reviews`),
  create: (bookingId, data) => api.post(`/bookings/${bookingId}/review`, data),
}
