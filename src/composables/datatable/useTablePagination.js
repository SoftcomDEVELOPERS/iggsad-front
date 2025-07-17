// composables/datatable/useTablePagination.js
// ✅ CORREGIDO - Se adapta a PrimeVue en lugar de luchar contra él

import { computed } from 'vue'
import { COMMON_PAGINATION_CONFIG } from '@/constants/datatableConfig/commonTableConfig'

export function useTablePagination(config, props, emit) {
  // ✅ Solo configuración, NO estado interno
  const paginationConfig = computed(() => ({
    ...COMMON_PAGINATION_CONFIG,
    ...config.pagination
  }))
  
  // ✅ Valores para PrimeVue rows-per-page-options (array de números)
  const pageSizeValues = computed(() => 
    paginationConfig.value.rowsPerPageOptions.map(option => option.value)
  )
  
  // ✅ Tamaño de página actual basado en props
  const currentPageSize = computed(() => 
    props.pagination?.pageSize || paginationConfig.value.defaultPageSize
  )
  
  // ✅ Índice del primer registro para PrimeVue :first
  const firstRowIndex = computed(() => 
    ((props.pagination?.page || 1) - 1) * currentPageSize.value
  )
  
  // ✅ Template del paginador
  const paginatorTemplate = computed(() => 
    paginationConfig.value.template
  )
  
  // ✅ Template del reporte actual
  const currentPageReportTemplate = computed(() => 
    paginationConfig.value.currentPageReportTemplate
  )
  
  // ✅ EVENTOS que PrimeVue envía automáticamente
  
  // Evento @page de PrimeVue
  const onPage = (event) => {
    // PrimeVue usa base 0, nosotros base 1
    const pageNumber = event.page + 1
    emit('page', pageNumber)
  }
  
  // Evento @update:rows de PrimeVue (cambio de tamaño de página)
  const onPageSizeChange = (event) => {
    // event.rows contiene el nuevo tamaño de página
    emit('page-size-change', event.rows)
    // También resetear a la primera página
    emit('page', 1)
  }
  
  // ✅ Información calculada de paginación (para displays, etc.)
  const paginationInfo = computed(() => {
    const page = props.pagination?.page || 1
    const pageSize = currentPageSize.value
    const total = props.pagination?.total || 0
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
  
  return {
    // ✅ Configuración para PrimeVue
    paginationConfig,
    pageSizeValues,
    currentPageSize,
    firstRowIndex,
    paginatorTemplate,
    currentPageReportTemplate,
    
    // ✅ Eventos para PrimeVue
    onPage,
    onPageSizeChange,
    
    // ✅ Información calculada
    paginationInfo
  }
}