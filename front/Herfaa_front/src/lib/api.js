import axios from 'axios'

/**
 * Central HTTP client for the Herfaa API.
 * - Base URL points at the Laravel API (/api/v1).
 * - Request interceptor attaches the Sanctum bearer token.
 * - Response interceptor clears the token on 401 (expired/invalid).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: { Accept: 'application/json' },
})

export const TOKEN_KEY = 'herfaa_token'

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      // Module 1 (Auth) will redirect to /login from the AuthContext.
    }
    return Promise.reject(error)
  },
)

export default api
