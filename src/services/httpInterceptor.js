import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Función para verificar si la URL es de nuestra API
const isApiUrl = (url) => {
  const apiUrls = [
    import.meta.env.VITE_SSO_URL,
    '/api'
  ].filter(Boolean)

  return apiUrls.some(apiUrl => url.includes(apiUrl))
}

// Guardar el fetch original
const originalFetch = window.fetch

// Flag para evitar loops infinitos en refresh
let isRefreshing = false

// Interceptor para peticiones y respuestas
window.fetch = async function(...args) {
  const [url, options = {}] = args
  const auth = useAuthStore()

  // Excluir logout y refresh antes de any intercept
  if (typeof url === 'string' && (url.includes('/api/auth/logout') || url.includes('/api/auth/refresh'))) {
    return await originalFetch.apply(this, [url, options])
  }

  // Si no hay usuario (store vacío) y no es logout/refresh, no interceptar
  if (typeof url === 'string' && isApiUrl(url) && !auth.user) {
    return await originalFetch.apply(this, [url, options])
  }

  // Solo interceptar peticiones a nuestras APIs cuando hay usuario
  if (typeof url === 'string' && isApiUrl(url)) {
    options.credentials = 'include'
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  // Realizar petición original
  const response = await originalFetch.apply(this, [url, options])

  // Interceptor de respuestas de la API
  if (typeof url === 'string' && isApiUrl(url)) {
    // Excluir logout/refresh en respuesta
    if (url.includes('/api/auth/logout') || url.includes('/api/auth/refresh')) {
      return response
    }

    // 401 -> intentar refresh
    if (response.status === 401 && !isRefreshing) {
      console.warn('Token expirado o inválido, intentando refresh...')
      isRefreshing = true
      try {
        const refreshed = await auth.tryRefreshToken()
        if (refreshed) {
          console.log('Token renovado exitosamente')
          return await originalFetch.apply(this, [url, { ...options, credentials: 'include' }])
        }
      } catch (error) {
        console.error('Error al renovar token:', error)
      } finally {
        isRefreshing = false
      }

      console.log('No se pudo renovar el token, haciendo logout...')
      await auth.logout()
      // Desactivar interceptor y restaurar fetch original
      window.fetch = originalFetch
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }

    // 403 -> acceso denegado
    if (response.status === 403) {
      console.warn('Acceso denegado - Sin permisos suficientes')
    }
  }

  return response
}

// Cliente HTTP simplificado
export const httpClient = {
  async get(url, options = {}) {
    return await fetch(url, { method: 'GET', credentials: 'include', ...options })
  },
  async post(url, data, options = {}) {
    return await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...options.headers }, credentials: 'include', body: JSON.stringify(data), ...options })
  },
  async put(url, data, options = {}) {
    return await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...options.headers }, credentials: 'include', body: JSON.stringify(data), ...options })
  },
  async delete(url, options = {}) {
    return await fetch(url, { method: 'DELETE', credentials: 'include', ...options })
  }
}

// Inicializar interceptor
export const initializeHttpInterceptor = () => {
  console.log('🔧 HTTP Interceptor inicializado - Usando cookies del backend')
}

export default httpClient
