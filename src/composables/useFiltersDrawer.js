// src/composables/useFiltersDrawer.js
import { ref, computed } from 'vue'
import { useFilterPanel } from '@/composables/useFilterPanel'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'

/**
 * Composable para manejar la lógica del drawer de filtros
 * Centraliza toda la funcionalidad compartida entre Dashboard y ExpedientesView
 */
export function useFiltersDrawer(options = {}) {
  const {
    enableRedirection = false,
    redirectCallback = null
  } = options

  // Composables
  const expedientesStore = useExpedientesStore()
  const { showSuccess, showWarn, showError } = useToast()
  
  const {
    filters,
    activeFilters,
    getFilterLabel,
    getFilterValue,
    clearFilter: clearSingleFilter,
    clearAllFilters: clearAllFiltersLogic,
    applyFilters: applyFiltersLogic,
    normalizeFilters
  } = useFilterPanel()

  // Estado del drawer
  const showFilters = ref(false)
  const persistentFilters = ref({})
  const persistentExpedienteSearch = ref('')

  // Estado computado
  const totalActiveFilters = computed(() => {
    let count = 0
    Object.entries(persistentFilters.value).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        if (Array.isArray(value)) {
          const validItems = value.filter(v => v !== null && v !== '' && v !== undefined)
          if (validItems.length > 0) {
            count++
          }
        } else {
          count++
        }
      }
    })
    return count
  })

  const activeFiltersDisplay = computed(() => {
    const filters = []
    Object.entries(activeFilters.value).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        const label = getFilterLabel(key)
        const displayValue = getFilterValue(key, value)
        if (displayValue) {
          filters.push({
            key,
            label,
            value: displayValue,
            display: `${label}: ${displayValue}`
          })
        }
      }
    })
    return filters
  })

  // Métodos del drawer
  const toggleFilters = () => {
    showFilters.value = !showFilters.value
  }

  const closeFilters = () => {
    showFilters.value = false
  }

  // Métodos de filtros
  const handleApplyFilters = async (filterData) => {
    console.log('📋 Aplicando filtros desde FiltersDrawer:', filterData)
    
    // Guardar filtros persistentemente
    persistentFilters.value = { ...filterData }
    
    // Cerrar panel de filtros
    showFilters.value = false
    
    try {
      // Si hay redirección habilitada, usar el callback
      if (enableRedirection && redirectCallback) {
        await redirectCallback(filterData, persistentExpedienteSearch.value)
        return
      }
      
      // Comportamiento normal (sin redirección)
      const searchTerm = persistentExpedienteSearch.value
      if (searchTerm && searchTerm.trim()) {
        await expedientesStore.searchExpedientes(filterData, searchTerm.trim())
      }
      
      // Sincronizar con resultados del store si existen
      if (expedientesStore.hasExpedientes) {
        console.log('🔄 Filtros aplicados y sincronizados')
      }
      
      showSuccess('Filtros aplicados', 'Los filtros se han aplicado correctamente')
      console.log('✅ Filtros guardados correctamente')
      
    } catch (error) {
      console.error('❌ Error al aplicar filtros:', error)
      showError('Error al aplicar filtros', 'No se pudieron aplicar los filtros')
    }
  }

  const handleClearFilters = () => {
    console.log('Limpiando todos los filtros')
    
    // Limpiar estado persistente
    persistentFilters.value = {}
    persistentExpedienteSearch.value = ''
    
    // Limpiar store
    expedientesStore.clearResults()
    
    showSuccess('Filtros limpiados', 'Se han eliminado todos los filtros')
    console.log('✅ Filtros y búsquedas limpiados completamente')
  }

  const handleFilterChange = (filterData) => {
    console.log('Filtros cambiados:', filterData)
    
    // Actualizar filtros persistentes en tiempo real
    persistentFilters.value = { ...filterData }
  }

  const handleExpedienteSearch = async (expediente) => {
    console.log('🔍 Búsqueda desde FilterPanel:', expediente)
    
    // Sincronizar estados
    persistentExpedienteSearch.value = expediente || ''
    
    try {
      // Si hay redirección habilitada, usar el callback
      if (enableRedirection && redirectCallback && expediente && expediente.trim()) {
        await redirectCallback(persistentFilters.value, expediente.trim())
        return
      }
      
      // Comportamiento normal (sin redirección)
      if (expediente && expediente.trim()) {
        await expedientesStore.searchExpedientes(persistentFilters.value, expediente.trim())
      }
      
      // Los resultados ya están en el store desde FilterPanel
      if (expedientesStore.hasExpedientes) {
        console.log('🔄 Resultados sincronizados desde FilterPanel')
      }
      
    } catch (error) {
      console.error('❌ Error en búsqueda desde FilterPanel:', error)
      showError('Error en la búsqueda', 'No se pudo realizar la búsqueda')
    }
  }

  const handleToggleFullscreen = (isFullscreen) => {
    console.log('Drawer fullscreen:', isFullscreen)
  }

  // Métodos de filtros individuales
  const removeFilter = (filterKey) => {
    clearSingleFilter(filterKey)
    // Actualizar persistentFilters
    delete persistentFilters.value[filterKey]
  }

  const clearAllFilters = () => {
    clearAllFiltersLogic()
    persistentFilters.value = {}
    expedientesStore.clearResults()
  }

  // Métodos de configuración
  const loadFiltersFromQuery = (queryParams) => {
    const { search, ...filters } = queryParams
    
    if (search) {
      persistentExpedienteSearch.value = search
    }
    
    if (Object.keys(filters).length > 0) {
      persistentFilters.value = { ...filters }
      Object.assign(filters, filters)
    }
    
    console.log('✅ Filtros cargados desde URL:', { search, filters })
  }

  return {
    // Estado
    showFilters,
    persistentFilters,
    persistentExpedienteSearch,
    
    // Computed
    totalActiveFilters,
    activeFiltersDisplay,
    
    // Métodos del drawer
    toggleFilters,
    closeFilters,
    
    // Métodos de filtros
    handleApplyFilters,
    handleClearFilters,
    handleFilterChange,
    handleExpedienteSearch,
    handleToggleFullscreen,
    
    // Métodos de filtros individuales
    removeFilter,
    clearAllFilters,
    
    // Métodos de configuración
    loadFiltersFromQuery,
    
    // Acceso directo a composables internos
    filters,
    activeFilters,
    getFilterLabel,
    getFilterValue,
    normalizeFilters
  }
}