import api from '@/lib/api'

/** Module 4 — Bookings. */
export const bookingsApi = {
  list: (params) => api.get('/bookings', { params }),
  get: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  cancel: (id, reason) => api.post(`/bookings/${id}/cancel`, { reason }),
  accept: (id, data = {}) => api.post(`/bookings/${id}/accept`, data),
  reject: (id, reason) => api.post(`/bookings/${id}/reject`, { reason }),
  start: (id) => api.post(`/bookings/${id}/start`),
  complete: (id) => api.post(`/bookings/${id}/complete`),
}
