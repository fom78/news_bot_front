import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Interceptor para manejar JWT
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuestas
apiClient.interceptors.response.use(
  response => {
    // Guardar token al hacer login/register
    if (response.config.url.includes('/auth') && response.data.access_token) {
      const { access_token, user } = response.data
      localStorage.setItem('jwtToken', access_token)
      localStorage.setItem('userPhone', user.phone_number)
    }
    return response
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('userPhone')
      window.location = '/login'
    }
    
    const errorMessage = error.response?.data?.message || 
      `Error: ${error.code || 'Connection failed'}`
    
    throw new Error(errorMessage)
  }
)

export const authService = {
  login: (phone, password) => apiClient.post('/auth/login', { phone_number:phone, password }),
  register: (phone, password) => apiClient.post('/auth/register', { phone_number:phone, password }),
  verifyToken: () => apiClient.post('/auth/verify-token')
}

export const subscriptionService = {
  get: () => apiClient.get('/subscriptions').then(res => res.data.map(s => s.category)),
  add: (category) => apiClient.post('/subscriptions', { category }),
  delete: (category) => apiClient.delete(`/subscriptions/${encodeURIComponent(category)}`)
}