import api from '@/lib/api'

/** Module 8 — Admin. */
export const adminApi = {
  stats: () => api.get('/admin/stats'),

  users: (params) => api.get('/admin/users', { params }),
  suspendUser: (id) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.post(`/admin/users/${id}/activate`),

  providers: (params) => api.get('/admin/providers', { params }),
  approveProvider: (id) => api.post(`/admin/providers/${id}/approve`),
  rejectProvider: (id, reason) => api.post(`/admin/providers/${id}/reject`, { reason }),
  suspendProvider: (id) => api.post(`/admin/providers/${id}/suspend`),

  categories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  reviews: (params) => api.get('/admin/reviews', { params }),
  moderateReview: (id, status) => api.patch(`/admin/reviews/${id}/moderate`, { status }),

  faqs: () => api.get('/admin/faqs'),
  createFaq: (data) => api.post('/admin/faqs', data),
  updateFaq: (id, data) => api.put(`/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/admin/faqs/${id}`),
}
