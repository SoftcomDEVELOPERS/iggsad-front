// stores/auth.js
import { defineStore } from 'pinia'
import * as authService from '@/services/auth.services.js'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    frontPermissions: [],
    userProfile: null, // ✨ NUEVO: Configuración personalizada del usuario
    isLoading: false
  }),
  
  getters: {
    isAuthenticated: (s) => !!s.user,
    /**
     * Comprueba si el usuario tiene este permiso
     * - Comodín '*'
     * - Permiso exacto ('user-readView')
     * - Permiso 'entity-allView' cubre cualquier acción de esa entidad
     */
    canAccess: (s) => (permission) => {
      const fps = s.frontPermissions || []
      if (fps.includes('*')) {
        return true
      }
      if (fps.includes(permission)) {
        return true
      }
      const [entity] = permission.split('-')
      return fps.some(fp => {
        const [fpEntity, fpAction] = fp.split('-')
        return fpEntity === entity && fpAction === 'allView'
      })
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

        const { frontPermissions, user, userProfile } = await authService.fetchMe()
        
        console.log('Datos del usuario obtenidos:', { user, frontPermissions, userProfile });
        
        // Paso 3: Guardar en el store
        this.user = user
        this.frontPermissions = frontPermissions
        this.userProfile = userProfile || this.getDefaultUserProfile() // ✨ NUEVO
        
        console.log('Login exitoso:', { user, frontPermissions, userProfile: this.userProfile })
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
     * ✨ NUEVO: Perfil por defecto si no viene del backend
     */
    getDefaultUserProfile() {
      return {
        dashboard: {
          layout: 'grid-auto',
          cards: [
            { id: 'casos-activos', type: 'stat', visible: true, order: 1, size: 'normal' },
            { id: 'audiencias-proximas', type: 'stat', visible: true, order: 2, size: 'normal' },
            { id: 'casos-urgentes', type: 'stat', visible: true, order: 3, size: 'normal' },
            { id: 'total-clientes', type: 'stat', visible: true, order: 4, size: 'normal' },
            { id: 'busquedas-recientes', type: 'content', visible: true, order: 5, size: 'large' },
            { id: 'notificaciones', type: 'sidebar', visible: true, order: 6, size: 'normal' },
            { id: 'chat', type: 'sidebar', visible: true, order: 7, size: 'normal' },
            { id: 'acciones-rapidas', type: 'sidebar', visible: true, order: 8, size: 'small' }
          ]
        },
        dock: {
          enabled: true,
          position: 'bottom',
          autoHide: false,
          items: [
            { id: 'casos', visible: true, order: 1 },
            { id: 'audiencias', visible: true, order: 2 },
            { id: 'clientes', visible: true, order: 3 },
            { id: 'documentos', visible: true, order: 4 },
            { id: 'perfil', visible: true, order: 5 }
          ]
        },
        filters: {
          defaults: {},
          favorites: [],
          expandedSections: ['procedimiento-basico']
        },
        preferences: {
          theme: 'light',
          language: 'es',
          dateFormat: 'dd/mm/yyyy'
        }
      }
    },

    /**
     * ✨ NUEVO: Actualizar configuración del dashboard
     */
    async updateDashboardConfig(config) {
      try {
        this.isLoading = true
        
        // Actualizar localmente
        if (this.userProfile) {
          this.userProfile.dashboard = { ...this.userProfile.dashboard, ...config }
        }
        
        // TODO: Guardar en backend cuando esté listo
        // await userSettingsService.updateDashboard(config)
        
        console.log('Configuración del dashboard actualizada:', config)
        return true
        
      } catch (error) {
        console.error('Error al actualizar configuración del dashboard:', error)
        throw error
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
        this.userProfile = null // ✨ NUEVO
        
        console.log('Logout exitoso')
        
      } catch (error) {
        console.error('Error en logout:', error)
        // Limpiar estado local aunque falle la llamada al servidor
        this.user = null
        this.frontPermissions = []
        this.userProfile = null // ✨ NUEVO
        
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Verifica si el usuario está autenticado (útil al iniciar la app)
     */
    async checkAuth() {
      
      this.isLoading = true
      try {
        
        const { user, frontPermissions, userProfile } = await authService.fetchMe()
        this.user = user
        this.frontPermissions = frontPermissions
        this.userProfile = userProfile || this.getDefaultUserProfile() // ✨ NUEVO
        
        console.log('Usuario autenticado:', user)
        return true
        
      } catch (error) {
        console.log('Error al verificar autenticación:', error);
        
        if (error.response?.status === 401) {
          const refreshed = await authService.refreshToken().catch(() => false)
          if (refreshed) {
            const { user, frontPermissions, userProfile } = await authService.fetchMe()
            this.user = user
            this.frontPermissions = frontPermissions
            this.userProfile = userProfile || this.getDefaultUserProfile() // ✨ NUEVO
            return true
          }
        }
        // demás errores o refresh fallido
        this.user = null
        this.frontPermissions = []
        this.userProfile = null // ✨ NUEVO
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
          const { user, frontPermissions, userProfile } = await authService.fetchMe()
          this.user = user
          this.frontPermissions = frontPermissions
          this.userProfile = userProfile || this.getDefaultUserProfile() // ✨ NUEVO
          return true
        }
        
        return false
        
      } catch (error) {
        console.error('Error al refrescar token:', error)
        return false
      }
    },

    /**
     * ✨ NUEVO: Solicita recuperación de contraseña
     */
    async requestPasswordReset(email) {
      try {
        this.isLoading = true
        
        const response = await authService.requestPasswordReset(email)
        
        console.log('Solicitud de recuperación enviada para:', email)
        return response // Retorna { success, message, data, statusCode }
        
      } catch (error) {
        console.error('Error en requestPasswordReset:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * ✨ NUEVO: Verifica token de recuperación
     */
    async verifyResetToken(token) {
      try {
        this.isLoading = true
        
        const response = await authService.verifyResetToken(token)
        
        console.log('Token verificado:', token)
        return response // Retorna { success, message, data, statusCode }
        
      } catch (error) {
        console.error('Error en verifyResetToken:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * ✨ NUEVO: Resetea contraseña con token
     */
    async resetPassword(token, newPassword, confirmPassword) {
      try {
        this.isLoading = true
        
        const response = await authService.resetPassword(token, newPassword, confirmPassword)
        
        console.log('Contraseña reseteada exitosamente')
        return response // Retorna { success, message, data, statusCode }
        
      } catch (error) {
        console.error('Error en resetPassword:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * ✨ NUEVO: Cambia contraseña del usuario autenticado
     */
    async changePassword(currentPassword, newPassword) {
      try {
        this.isLoading = true
        
        const response = await authService.changePassword(currentPassword, newPassword)
        
        console.log('Contraseña cambiada exitosamente')
        return response // Retorna { success, message, data, statusCode }
        
      } catch (error) {
        console.error('Error en changePassword:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})