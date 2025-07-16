// composables/datatable/useTablePagination.js
// Lógica de paginación extraída y generalizada

import { ref, computed } from 'vue'
import { COMMON_PAGINATION_CONFIG } from '@/constants/datatableConfig/commonTableConfig'

export function useTablePagination(config, props, emit) {
  // Estado local de paginación
  const selectedPageSize = ref(config.pagination?.defaultPageSize || COMMON_PAGINATION_CONFIG.defaultPageSize)
  
  // Opciones de tamaño de página como valores simples
  const pageSizeValues = computed(() => 
    (config.pagination?.rowsPerPageOptions || COMMON_PAGINATION_CONFIG.rowsPerPageOptions)
      .map(option => option.value)
  )
  
  // Configuración de paginación
  const paginationConfig = computed(() => ({
    ...COMMON_PAGINATION_CONFIG,
    ...config.pagination
  }))
  
  // Información de paginación calculada
  const paginationInfo = computed(() => {
    const { page = 1, pageSize = 50, total = 0 } = props.pagination || {}
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
  
  // Métodos de navegación de página (exactos del original)
  const onPage = (e) => {
    emit('page', e.page + 1)
  }
  
  const goToFirstPage = () => {
    emit('page', 1)
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
    emit('page', paginationInfo.value.totalPages)
  }
  
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= paginationInfo.value.totalPages) {
      emit('page', pageNumber)
    }
  }
  
  // Cambio de tamaño de página (exacto del original)
  const onPageSizeChange = () => {
    emit('page-size-change', selectedPageSize.value)
  }
  
  return {
    // Estado
    selectedPageSize,
    
    // Computed
    pageSizeValues,
    paginationConfig,
    paginationInfo,
    
    // Métodos
    onPage,
    onPageSizeChange,
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage,
    goToPage
  }
}