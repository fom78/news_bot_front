import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Interceptor para incluir token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de errores de autenticación
apiClient.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    if ([401, 403, 422].includes(status)) {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('userPhone')
      window.dispatchEvent(new Event('storage')) // Para sincronizar logout
      window.location.href = '/login' // Redirige al login
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (phone, password) => apiClient.post('/auth/login', { phone_number: phone, password }),
  register: (phone, password) => apiClient.post('/auth/register', { phone_number: phone, password }),
  verifyToken: () => apiClient.post('/auth/verify-token')
}

export const subscriptionService = {
  get: () => apiClient.get('/subscriptions').then(res => res.data.map(s => s.category)),
  add: (category) => apiClient.post('/subscriptions', { categories: category }),
  delete: (category) => apiClient.delete(`/subscriptions/${encodeURIComponent(category)}`)
}
