// services/httpInterceptor.js
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
  
  // Solo interceptar peticiones a nuestras APIs
  if (typeof url === 'string' && isApiUrl(url)) {
    // Asegurar que las cookies se envíen siempre
    options.credentials = 'include'
    
    // Agregar headers por defecto si no existen
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  // Realizar la petición original
  const response = await originalFetch.apply(this, [url, options])

  // Interceptor para respuestas
  if (typeof url === 'string' && isApiUrl(url)) {
    const auth = useAuthStore()
    
    // Si es error 401, el token ha expirado o es inválido
    if (response.status === 401 && !isRefreshing) {
      console.warn('Token expirado o inválido, intentando refresh...')
      
      // Evitar llamadas múltiples al refresh
      isRefreshing = true
      
      try {
        // Intentar refresh token
        const refreshed = await auth.tryRefreshToken()
        
        if (refreshed) {
          console.log('Token renovado exitosamente')
          // Reintentar la petición original
          const retryResponse = await originalFetch.apply(this, [url, {
            ...options,
            credentials: 'include'
          }])
          return retryResponse
        }
      } catch (error) {
        console.error('Error al renovar token:', error)
      } finally {
        isRefreshing = false
      }
      
      // Si no se pudo renovar, hacer logout y redirigir
      console.log('No se pudo renovar el token, cerrando sesión...')
      await auth.logout()
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
    
    // Si es error 403, no hay permisos
    if (response.status === 403) {
      console.warn('Acceso denegado - Sin permisos suficientes')
      // Aquí podrías mostrar un toast o redirigir a una página de error
    }
  }

  return response
}

// Cliente HTTP simplificado (opcional)
export const httpClient = {
  async get(url, options = {}) {
    return await fetch(url, {
      method: 'GET',
      credentials: 'include',
      ...options
    })
  },

  async post(url, data, options = {}) {
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      body: JSON.stringify(data),
      ...options
    })
  },

  async put(url, data, options = {}) {
    return await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include',
      body: JSON.stringify(data),
      ...options
    })
  },

  async delete(url, options = {}) {
    return await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      ...options
    })
  }
}

// Función para inicializar el interceptor
export const initializeHttpInterceptor = () => {
  console.log('🔧 HTTP Interceptor inicializado - Usando cookies del backend')
}

export default httpClient