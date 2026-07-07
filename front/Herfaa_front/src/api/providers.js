import api from '@/lib/api'

/** Module 2 & 3 — Providers, categories, and provider self-service. */
export const providersApi = {
  categories: () => api.get('/categories'),
  list: (params) => api.get('/providers', { params }),
  get: (id) => api.get(`/providers/${id}`),

  // provider self-service
  myProfile: () => api.get('/provider/profile'),
  updateProfile: (data) => api.put('/provider/profile', data),
  syncSkills: (skills) => api.put('/provider/skills', { skills }),
  dashboard: () => api.get('/provider/dashboard'),

  services: () => api.get('/provider/services'),
  createService: (data) => api.post('/provider/services', data),
  updateService: (id, data) => api.put(`/provider/services/${id}`, data),
  deleteService: (id) => api.delete(`/provider/services/${id}`),

  portfolio: () => api.get('/provider/portfolio'),
  uploadPortfolio: (formData) =>
    api.post('/provider/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deletePortfolio: (id) => api.delete(`/provider/portfolio/${id}`),
  reorderPortfolio: (order) => api.put('/provider/portfolio/reorder', { order }),
}
