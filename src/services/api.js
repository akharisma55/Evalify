import axios from 'axios'

// Base Axios instance – configure BASE_URL when backend is ready
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor – attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('evalify_user')
    if (user) {
      const { token } = JSON.parse(user)
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('evalify_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ─── Service methods (uncomment & use when backend ready) ─────────────────────

// export const authService = {
//   login: (data) => api.post('/auth/login', data),
//   register: (data) => api.post('/auth/register', data),
//   logout: () => api.post('/auth/logout'),
// }

// export const cvService = {
//   review: (formData) => api.post('/cv/review', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
// }

// export const interviewService = {
//   start: (role) => api.post('/interview/start', { role }),
//   result: (sessionId) => api.get(`/interview/result/${sessionId}`),
// }
