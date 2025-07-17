// src/stores/expedientes.js
import { defineStore } from 'pinia'
import { expedientesService } from '@/services/expedientes.services.js'
import { generateExpedientePage } from '@/utils/mockExpedientesGenerator'

export const useExpedientesStore = defineStore('expedientes', {
  state: () => ({
    expedientes: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 50,
      total: 0,
      totalPages: 0
    },
    activeFilters: {},
    searchQuery: ''
  }),

  getters: {
    hasExpedientes: state => state.expedientes.length > 0,
    isLoading:    state => state.loading,
    currentPage:  state => state.pagination.page,
    totalExpedientes: state => state.pagination.total
  },

  actions: {
    async searchExpedientes(filters = {}, query = '', page = 1, pageSize = 50) {
      this.loading = true
      this.error = null

      // Montamos los params que espera tu CoreAPI
      const params = { page, pageSize, searchQuery: query, ...filters }
      console.log('🔍 Buscando expedientes con:', params)

      try {
        let response

        if (import.meta.env.DEV) {
          // En dev leemos el mock que tengas en public/mock-expedientes.json
          response = generateExpedientePage(page, pageSize, filters, query)
        } else {
          // En producción llamamos a tu servicio real
          response = await expedientesService.search(params)
        }

        // Esperamos { data, page, pageSize, total, totalPages }
        this.expedientes = response.data
        this.pagination = {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages
        }
        this.activeFilters = { ...filters }
        this.searchQuery    = query

        console.log('✅ Expedientes cargados:', this.expedientes.length)
        return response

      } catch (err) {
        this.error = err.message || 'Error al buscar expedientes'
        console.error('❌ Error al buscar expedientes:', err)
        throw err

      } finally {
        this.loading = false
      }
    },

    clearResults() {
      this.expedientes = []
      this.activeFilters = {}
      this.searchQuery = ''
      this.error = null
      this.pagination = { page: 1, pageSize: 50, total: 0, totalPages: 0 }
    },

    async changePage(newPage) {
      if (newPage > 0 && newPage <= this.pagination.totalPages) {
        await this.searchExpedientes(
          this.activeFilters,
          this.searchQuery,
          newPage,
          this.pagination.pageSize
        )
      }
    },

    async changePageSize(newPageSize) {
      await this.searchExpedientes(
        this.activeFilters,
        this.searchQuery,
        1,
        newPageSize
      )
    }
  }
})
