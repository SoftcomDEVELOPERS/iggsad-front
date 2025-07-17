// composables/datatable/useTablePagination.js
// 🔧 UNIFICADO - Ahora maneja TODA la lógica de paginación

import { ref, computed } from 'vue'
import { COMMON_PAGINATION_CONFIG } from '@/constants/datatableConfig/commonTableConfig'

export function useTablePagination(config, props, emit) {
  // ✅ ÚNICA FUENTE DE VERDAD para el tamaño de página
  const selectedPageSize = ref(
    config.pagination?.defaultPageSize || 
    COMMON_PAGINATION_CONFIG.defaultPageSize
  )
  
  // ✅ Opciones de tamaño de página como valores simples para PrimeVue
  const pageSizeValues = computed(() => 
    (config.pagination?.rowsPerPageOptions || COMMON_PAGINATION_CONFIG.rowsPerPageOptions)
      .map(option => option.value)
  )
  
  // ✅ Opciones completas con labels para dropdowns
  const pageSizeOptions = computed(() => 
    config.pagination?.rowsPerPageOptions || COMMON_PAGINATION_CONFIG.rowsPerPageOptions
  )
  
  // ✅ Configuración completa de paginación
  const paginationConfig = computed(() => ({
    ...COMMON_PAGINATION_CONFIG,
    ...config.pagination
  }))
  
  // ✅ Información calculada de paginación
  const paginationInfo = computed(() => {
    const { page = 1, pageSize = selectedPageSize.value, total = 0 } = props.pagination || {}
    const totalPages = Math.ceil(total / pageSize)
    const start = ((page - 1) * pageSize) + 1
    const end = Math.min(page * pageSize, total)
    
    return {
      page,
      pageSize,
      total,
      totalPages,
      start,
      end,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      showingText: `Mostrando ${start} - ${end} de ${total}`
    }
  })
  
  // ✅ EVENTOS DE PAGINACIÓN - Métodos principales
  
  // Cambio de página desde el paginador de PrimeVue
  const onPage = (event) => {
    // PrimeVue envía el evento con page basado en 0, lo convertimos a 1
    const pageNumber = event.page + 1
    emit('page', pageNumber)
  }
  
  // Cambio de tamaño de página
  const onPageSizeChange = (newSize) => {
    selectedPageSize.value = newSize
    emit('page-size-change', newSize)
    // También resetear a la primera página
    emit('page', 1)
  }
  
  // ✅ NAVEGACIÓN MANUAL - Métodos adicionales
  
  const goToFirstPage = () => {
    if (paginationInfo.value.hasPrevious) {
      emit('page', 1)
    }
  }
  
  const goToPreviousPage = () => {
    if (paginationInfo.value.hasPrevious) {
      emit('page', paginationInfo.value.page - 1)
    }
  }
  
  const goToNextPage = () => {
    if (paginationInfo.value.hasNext) {
      emit('page', paginationInfo.value.page + 1)
    }
  }
  
  const goToLastPage = () => {
    if (paginationInfo.value.hasNext) {
      emit('page', paginationInfo.value.totalPages)
    }
  }
  
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= paginationInfo.value.totalPages) {
      emit('page', pageNumber)
    }
  }
  
  // ✅ HANDLER UNIFICADO para update:rows de PrimeVue
  const handlePageSizeUpdate = (newSize) => {
    onPageSizeChange(newSize)
  }
  
  return {
    // ✅ Estado reactivo
    selectedPageSize,
    
    // ✅ Computed properties
    pageSizeValues,
    pageSizeOptions, 
    paginationConfig,
    paginationInfo,
    
    // ✅ Eventos principales
    onPage,
    onPageSizeChange,
    handlePageSizeUpdate,
    
    // ✅ Navegación manual
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    goToPage
  }
}