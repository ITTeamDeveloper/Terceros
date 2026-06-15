import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

// ============================================================
// Conexión
// ============================================================

export const API_BASE_URL = "http://localhost:9303/api"

const TOKEN_KEY = 'authToken'

// ============================================================
// Instancia general de Axios
// ============================================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ============================================================
// Interceptors
// ============================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const url = error.config?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/')
    const status = error.response?.status

    if (isAuthEndpoint || (status !== 401 && status !== 403)) {
      return Promise.reject(error)
    }

    localStorage.removeItem(TOKEN_KEY)
    if (window.location.pathname !== '/login') {
      window.location.replace('/login')
    }

    return Promise.reject(error)
  },
)
