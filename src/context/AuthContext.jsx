import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [pending, setPending] = useState(true)

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('jwtToken')
    const phone = localStorage.getItem('userPhone')
    
    if (token && phone) {
      try {
        await authService.verifyToken()
        setUser({ phone })
      } catch (error) {
        logout()
      }
    }
    setPending(false)
  }, [])

  const login = useCallback(async (phone, password) => {
    const response = await authService.login(phone, password)
    setUser({ phone: response.data.user.phone_number })
  }, [])

  const register = useCallback(async (phone, password) => {
    const response = await authService.register(phone, password)
    setUser({ phone: response.data.phone_number })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userPhone')
    setUser(null)
  }, [])

  useEffect(() => {
    initAuth()
  }, [initAuth])

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