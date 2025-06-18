// stores/auth.js
import { defineStore } from 'pinia'
import * as authService from '@/services/auth.services.js'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    frontPermissions: [],
    isLoading: false
  }),
  
  getters: {
    isAuthenticated: (s) => !!s.user,
    canAccess: (s) => (routeName) =>
      s.frontPermissions.includes('*') ||
      s.frontPermissions.includes(routeName),
    // Verificar si tenemos token en cookies
    hasToken: () => {
      return !!Cookies.get('access_token')
    }
  },
  
  actions: {
    /**
     * Realiza el login completo:
     * 1) POST /auth/login  → cookie HttpOnly  
     * 2) GET /me          → datos y permisos  
     * 3) guardarlos en el store
     */
    async doLogin(payload) {
      
      // Validar payload
      if (!payload || !payload.email || !payload.password) {
        throw new Error('Email y contraseña son requeridos')
      }
      
      try {
        this.isLoading = true
        
        // Paso 1: Hacer login (las cookies se establecen automáticamente)
        console.log('Enviando credenciales al servidor...')
        const loginResponse = await authService.login(payload)
        
        // Paso 2: Obtener datos del usuario
        console.log('Obteniendo datos del usuario...')

        const { frontPermissions, user } = await authService.fetchMe()
        
        console.log('Datos del usuario obtenidos:', { user, frontPermissions });
        
        // Paso 3: Guardar en el store
        this.user = user
        this.frontPermissions = frontPermissions
        
        console.log('Login exitoso:', { user, frontPermissions })
        return loginResponse
        
      } catch (error) {
        console.error('Error en doLogin:', error)
        // Limpiar estado en caso de error
        this.user = null
        this.frontPermissions = []
        throw error // Re-lanzar para que el componente lo maneje
        
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Cierra la sesión del usuario
     */
    async logout() {
      try {
        this.isLoading = true
        
        // Llamar a /auth/logout para limpiar cookie del servidor
        await authService.logout()
        
        // Limpiar estado local
        this.user = null
        this.frontPermissions = []
        
        console.log('Logout exitoso')
        
      } catch (error) {
        console.error('Error en logout:', error)
        // Limpiar estado local aunque falle la llamada al servidor
        this.user = null
        this.frontPermissions = []
        
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Verifica si el usuario está autenticado (útil al iniciar la app)
     */
    async checkAuth() {
      // Primero verificar si hay token en cookies
      if (!this.hasToken) {
        console.log('No hay token en cookies')
        this.user = null
        this.frontPermissions = []
        return false
      }
      
      try {
        this.isLoading = true
        
        const { user, frontPermissions } = await authService.fetchMe()
        this.user = user
        this.frontPermissions = frontPermissions
        
        console.log('Usuario autenticado:', user)
        return true
        
      } catch (error) {
        console.log('Usuario no autenticado:', error.message)
        this.user = null
        this.frontPermissions = []
        return false
        
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Intenta refrescar el token automáticamente
     */
    async tryRefreshToken() {
      try {
        const refreshed = await authService.refreshToken()
        
        if (refreshed) {
          // Recargar datos del usuario
          const { user, frontPermissions } = await authService.fetchMe()
          this.user = user
          this.frontPermissions = frontPermissions
          return true
        }
        
        return false
        
      } catch (error) {
        console.error('Error al refrescar token:', error)
        return false
      }
    }
  }
})