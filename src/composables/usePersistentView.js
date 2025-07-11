// src/composables/usePersistentView.js
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUrlPersistence } from '@/composables/useUrlPersistence'
import { useToast } from '@/composables/useToast'

/**
 * Composable para vistas con estado persistible (búsquedas, filtros, paginación)
 * Maneja automáticamente la restauración desde URL y sincronización
 */
export function usePersistentView(options = {}) {
  const {
    searchStore, // Store que contiene la función de búsqueda
    searchMethod = 'search', // Nombre del método en el store
    enableAutoSearch = true, // Si debe buscar automáticamente al restaurar
    debugName = 'Vista' // Nombre para logs
  } = options

  const route = useRoute()
  const { restoreFromUrl, syncToUrl, hasUrlState } = useUrlPersistence()
  const { showSuccess, showError } = useToast()

  // Estado local común
  const searchQuery = ref('')
  const currentPage = ref(1)
  const isInitialized = ref(false)

  /**
   * Restaurar estado desde URL automáticamente
   */
  const restoreState = async (persistentFilters, persistentSearch, loadFiltersFromQuery) => {
    if (!hasUrlState()) {
      console.log(`ℹ️ ${debugName}: No hay parámetros en URL, vista limpia`)
      return false
    }

    console.log(`🔄 ${debugName}: Restaurando estado desde URL:`, route.query)

    try {
      // Restaurar estado completo desde URL
      const restored = restoreFromUrl(route.query)

      // Aplicar estado restaurado
      searchQuery.value = restored.search
      persistentSearch.value = restored.search
      currentPage.value = restored.page

      // Cargar filtros (cada vista tiene su método)
      if (loadFiltersFromQuery) {
        loadFiltersFromQuery(route.query)
      }

      // Realizar búsqueda automática si hay búsqueda y store
      if (restored.search && enableAutoSearch && searchStore) {
        showSuccess('Restaurando búsqueda', 'Cargando resultados desde URL...')
        
        await searchStore[searchMethod](persistentFilters.value, restored.search, restored.page)
        
        console.log(`✅ ${debugName}: Estado restaurado correctamente desde URL`)
      }

      return true

    } catch (error) {
      console.error(`❌ ${debugName}: Error restaurando desde URL:`, error)
      showError('Error al restaurar', 'No se pudieron cargar los resultados desde URL')
      return false
    }
  }

  /**
   * Configurar sincronización automática con URL
   */
  const setupUrlSync = (persistentFilters) => {
    watch([searchQuery, currentPage, persistentFilters], 
      ([newSearch, newPage, newFilters]) => {
        if (!isInitialized.value) return // No sincronizar durante inicialización

        syncToUrl({
          search: newSearch,
          page: newPage,
          filters: newFilters
        })
      }, 
      { deep: true }
    )
  }

  /**
   * Marcar como inicializado (para evitar sync durante setup)
   */
  const markAsInitialized = () => {
    // Pequeño delay para asegurar que todo esté configurado
    setTimeout(() => {
      isInitialized.value = true
      console.log(`✅ ${debugName}: Inicialización completa`)
    }, 100)
  }

  return {
    // Estado
    searchQuery,
    currentPage,
    isInitialized,

    // Métodos
    restoreState,
    setupUrlSync,
    markAsInitialized,

    // Acceso directo a utilidades
    hasUrlState,
    syncToUrl
  }
}