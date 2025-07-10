// src/stores/auth.js
import { defineStore } from 'pinia'
import * as authService from '@/services/auth.services.js'
import { getDefaultUserProfile } from '@/utils/defaultUserProfile.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    frontPermissions: [],
    userProfile: getDefaultUserProfile(),
    isLoading: false
  }),

  getters: {
    isAuthenticated: s => !!s.user,
    canAccess: s => permission => {
      const fps = s.frontPermissions || []
      if (fps.includes('*')) return true
      if (fps.includes(permission)) return true
      const [entity] = permission.split('-')
      return fps.some(fp => {
        const [fpEntity, fpAction] = fp.split('-')
        return fpEntity === entity && fpAction === 'allView'
      })
    }
  },

  actions: {
    // — Helpers para localStorage —
    _getStorageKey(key) {
      const uid = this.user?.id || 'guest'
      return `userProfile_${uid}_${key}`
    },
    _saveToLocalStorage() {
      if (!this.user || !this.user.id) return
      try {
        localStorage.setItem(
          this._getStorageKey('profile'),
          JSON.stringify(this.userProfile)
        )
        localStorage.setItem(
          this._getStorageKey('lastSync'),
          new Date().toISOString()
        )
        console.log('💾 userProfile guardado en localStorage')
      } catch (err) {
        console.error('❌ Error guardando userProfile en LS:', err)
      }
    },
    _loadFromLocalStorage() {
      if (!this.user || !this.user.id) return false
      try {
        const raw = localStorage.getItem(this._getStorageKey('profile'))
        if (raw) {
          this.userProfile = JSON.parse(raw)
          console.log('📱 userProfile cargado desde localStorage')
          return true
        }
      } catch (err) {
        console.error('❌ Error cargando userProfile desde LS:', err)
      }
      return false
    },
    _clearLocalStorage() {
      if (!this.user || !this.user.id) return
      try {
        localStorage.removeItem(this._getStorageKey('profile'))
        localStorage.removeItem(this._getStorageKey('lastSync'))
        console.log('🧹 userProfile eliminado de localStorage')
      } catch (err) {
        console.error('❌ Error limpiando localStorage:', err)
      }
    },

    // —— Método genérico de parcheo de perfil ——
    async updateUserProfile(patch) {
      // patch es un objeto parcial, ej { dashboard: {...} }
      this.userProfile = { ...this.userProfile, ...patch }
      this._saveToLocalStorage()
      // TODO: disparar llamada a backend cuando esté implementado
      console.log('📝 userProfile parcheado:', patch)
      return true
    },

    // —— Login / carga inicial ——
    async doLogin({ email, password }) {
      if (!email || !password) throw new Error('Email y contraseña son requeridos')
      this.isLoading = true
      try {
        console.log('🔐 Enviando credenciales…')
        const loginResp = await authService.login({ email, password })
        console.log('👤 Fetching perfil…')
        const { user, frontPermissions, userProfile } = await authService.fetchMe()
        this.user = user
        this.frontPermissions = frontPermissions
        this.userProfile = userProfile || getDefaultUserProfile()

        // Priorizar LS si existe
        const usedLocal = this._loadFromLocalStorage()
        if (!usedLocal) this._saveToLocalStorage()
        console.log('✅ Login completado:', this.user)
        return loginResp
      } catch (err) {
        console.error('❌ Error en doLogin:', err)
        this.user = null
        this.frontPermissions = []
        this.userProfile = getDefaultUserProfile()
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // —— Verificar token vivo al refrescar página ——
    async checkAuth() {
      this.isLoading = true
      try {
        const { user, frontPermissions, userProfile } = await authService.fetchMe()
        this.user = user
        this.frontPermissions = frontPermissions
        this.userProfile = userProfile || getDefaultUserProfile()
        const usedLocal = this._loadFromLocalStorage()
        if (!usedLocal) this._saveToLocalStorage()
        console.log('🔄 Auth verificado:', user)
        return true
      } catch (err) {
        console.warn('⚠️ No autenticado:', err)
        // Si era 401, limpiar todo
        if (err.response?.status === 401) {
          this.user = null
          this.frontPermissions = []
          this.userProfile = getDefaultUserProfile()
          this._clearLocalStorage()
          return false
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // —— Logout limpio ——
    async logout() {
      this.isLoading = true
      try {
        this._clearLocalStorage()
        await authService.logout()
        this.user = null
        this.frontPermissions = []
        this.userProfile = getDefaultUserProfile()
        console.log('🚪 Logout exitoso')
      } catch (err) {
        console.error('❌ Error en logout:', err)
        this.user = null
        this.frontPermissions = []
        this.userProfile = getDefaultUserProfile()
      } finally {
        this.isLoading = false
      }
    },

    // —— Refresh token automático ——
    async tryRefreshToken() {
      try {
        const ok = await authService.refreshToken()
        if (ok) {
          const { user, frontPermissions, userProfile } = await authService.fetchMe()
          this.user = user
          this.frontPermissions = frontPermissions
          this.userProfile = userProfile || getDefaultUserProfile()
          this._saveToLocalStorage()
          return true
        }
      } catch (err) {
        console.error('❌ Error refrescando token:', err)
      }
      return false
    },

    // —— Recuperación de contraseña ——
    async requestPasswordReset(email) {
      this.isLoading = true
      try {
        const resp = await authService.requestPasswordReset(email)
        console.log('✉️ Reset solicitado para:', email)
        return resp
      } finally {
        this.isLoading = false
      }
    },
    async verifyResetToken(token) {
      this.isLoading = true
      try {
        const resp = await authService.verifyResetToken(token)
        console.log('🔏 Token verificado:', token)
        return resp
      } finally {
        this.isLoading = false
      }
    },
    async resetPassword(token, newPassword, confirmPassword) {
      this.isLoading = true
      try {
        const resp = await authService.resetPassword(token, newPassword, confirmPassword)
        console.log('🔄 Contraseña reseteada')
        return resp
      } finally {
        this.isLoading = false
      }
    },
    async changePassword(currentPassword, newPassword) {
      this.isLoading = true
      try {
        const resp = await authService.changePassword(currentPassword, newPassword)
        console.log('🔒 Contraseña cambiada')
        return resp
      } finally {
        this.isLoading = false
      }
    }
  }
})
