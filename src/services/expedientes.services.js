// services/expedientes.service.js
import { httpClient } from './httpInterceptor'

const API_BASE = import.meta.env.VITE_COREAPI_URL || '/api'

export const expedientesService = {
  
  /**
   * Buscar expedientes con filtros y paginación
   */
  async search(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Parámetros de paginación
      queryParams.append('page', params.page || 1)
      queryParams.append('pageSize', params.pageSize || 50)
      
      // Query de búsqueda
      if (params.searchQuery) {
        queryParams.append('q', params.searchQuery)
      }
      
      // Filtros específicos
      if (params.cliente && params.cliente.length > 0) {
        params.cliente.forEach(c => queryParams.append('cliente', c))
      }
      
      if (params.cartera && params.cartera.length > 0) {
        params.cartera.forEach(c => queryParams.append('cartera', c))
      }
      
      if (params.estadoExpediente && params.estadoExpediente.length > 0) {
        params.estadoExpediente.forEach(e => queryParams.append('estadoExpediente', e))
      }
      
      if (params.fechaExpediente && params.fechaExpediente[0] && params.fechaExpediente[1]) {
        queryParams.append('fechaDesde', params.fechaExpediente[0].toISOString())
        queryParams.append('fechaHasta', params.fechaExpediente[1].toISOString())
      }
      
      if (params.referencia) {
        queryParams.append('referencia', params.referencia)
      }
      
      if (params.contrato) {
        queryParams.append('contrato', params.contrato)
      }
      
      if (params.nig) {
        queryParams.append('nig', params.nig)
      }
      
      // ... agregar más filtros según necesidades
      
      const response = await httpClient.get(`${API_BASE}/expedientes/search?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error('Error en expedientesService.search:', error)
      throw error
    }
  },

  /**
   * Obtener un expediente por ID
   */
  async getById(id) {
    try {
      const response = await httpClient.get(`${API_BASE}/expedientes/${id}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
      
    } catch (error) {
      console.error('Error en expedientesService.getById:', error)
      throw error
    }
  },

  /**
   * Exportar resultados de búsqueda
   */
  async export(params = {}, format = 'excel') {
    try {
      const queryParams = new URLSearchParams()
      
      // Agregar todos los filtros de búsqueda
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v))
          } else {
            queryParams.append(key, value)
          }
        }
      })
      
      queryParams.append('format', format)
      
      const response = await httpClient.get(`${API_BASE}/expedientes/export?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      // Retornar blob para descarga
      return await response.blob()
      
    } catch (error) {
      console.error('Error en expedientesService.export:', error)
      throw error
    }
  }
}