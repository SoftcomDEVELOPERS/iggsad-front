// src/composables/useUrlPersistence.js
// Solo manejar la conversión entre objetos JavaScript y query parameters de URL.
import { useRoute, useRouter } from 'vue-router'

export function useUrlPersistence() {
  const route = useRoute()
  const router = useRouter()
  
  // 🎯 RESTAURAR ESTADO DESDE URL
  const restoreFromUrl = (queryParams) => {
    const restored = {}
    
    // Restaurar filtros
    Object.keys(queryParams).forEach(key => {
      if (key !== 'search' && key !== 'page') {
        let value = queryParams[key]
        
        // Convertir arrays de query params
        if (Array.isArray(value)) {
          restored[key] = value
        } else if (value === 'true') {
          restored[key] = true
        } else if (value === 'false') {
          restored[key] = false
        } else if (!isNaN(value) && value !== '') {
          restored[key] = Number(value)
        } else {
          restored[key] = value
        }
      }
    })
    
    return {
      search: queryParams.search || '',
      page: Number(queryParams.page) || 1,
      filters: restored
    }
  }
  
  // 🎯 SINCRONIZAR ESTADO CON URL
  const syncToUrl = (state, options = {}) => {
    const { replace = true } = options
    
    const query = {}
    
    // Añadir búsqueda
    if (state.search && state.search.trim()) {
      query.search = state.search.trim()
    }
    
    // Añadir página
    if (state.page && state.page > 1) {
      query.page = state.page
    }
    
    // Añadir filtros
    if (state.filters) {
      Object.entries(state.filters).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          if (Array.isArray(value)) {
            if (value.length > 0) query[key] = value
          } else {
            query[key] = value
          }
        }
      })
    }
    
    // Actualizar URL
    const method = replace ? 'replace' : 'push'
    router[method]({ 
      name: route.name,
      query
    })
  }
  
  // 🎯 DETECTAR SI HAY ESTADO EN URL
  const hasUrlState = () => {
    return Object.keys(route.query).length > 0
  }
  
  return {
    restoreFromUrl,
    syncToUrl,
    hasUrlState
  }
}

