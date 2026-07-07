import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authApi } from '@/api/auth'
import { TOKEN_KEY } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On boot: if a token exists, resolve the current user.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const persist = useCallback((payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token)
    setUser(payload.user)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const res = await authApi.login(credentials)
      persist(res.data.data)
      return res.data.data.user
    },
    [persist],
  )

  const register = useCallback(
    async (data) => {
      const res = await authApi.register(data)
      persist(res.data.data)
      return res.data.data.user
    },
    [persist],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Ignore network/401 errors — we clear locally regardless.
    }
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
