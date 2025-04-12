import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [pending, setPending] = useState(true)

  const login = useCallback(async (phone, password) => {
    const response = await authService.login(phone, password)
    localStorage.setItem('jwtToken', response.data.access_token)
    localStorage.setItem('userPhone', response.data.user.phone_number)
    setUser({ phone: response.data.user.phone_number })
  }, [])

  const register = useCallback(async (phone, password) => {
    const response = await authService.register(phone, password)
    localStorage.setItem('jwtToken', response.data.access_token)
    localStorage.setItem('userPhone', response.data.user.phone_number)
    setUser({ phone: response.data.user.phone_number })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userPhone')
    window.dispatchEvent(new Event('storage'))
    setUser(null)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const phone = localStorage.getItem('userPhone')

    if (token && phone) {
      setUser({ phone })
    }

    setPending(false)

    const handleStorageChange = () => {
      const token = localStorage.getItem('jwtToken')
      const phone = localStorage.getItem('userPhone')
      setUser(token && phone ? { phone } : null)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ user, pending, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
