// composables/datatable/useTableData.js
// Lógica de datos extraída del ExpedientesTable.vue

import { ref, computed } from 'vue'

export function useTableData(config, props, emit) {
  // Estado local (exacto del ExpedientesTable original)
  const expandedRows = ref([]) // ← ARRAY
  const selectedPageSize = ref(config.pagination?.defaultPageSize || 50)
  
  // Opciones de tamaño de página (exactas del original)
  const pageSizeOptions = computed(() => 
    config.pagination?.rowsPerPageOptions || [
      { label: '25 filas', value: 25 },
      { label: '50 filas', value: 50 },
      { label: '100 filas', value: 100 },
      { label: '200 filas', value: 200 }
    ]
  )
  
  // Columnas visibles (exacto del original)
  const allColumns = ref([...config.columns])
  const visibleColumns = computed(() => {
    return allColumns.value.filter(col => col.visible)
  })
  
  // Métodos de eventos (exactos del original)
  const onPage = (e) => {
    emit('page', e.page + 1)
  }
  
  // Métodos de expansión (exactos del original)
  const onRowExpand = (e) => {
    emit('row-expand', e.data)
  }
  
  const onRowCollapse = (e) => {
    emit('row-collapse', e.data)
  }
  
  // Métodos de paginación (exactos del original)
  const onPageSizeChange = () => {
    emit('page-size-change', selectedPageSize.value)
  }
  
  const refreshTable = () => {
    emit('refresh')
  }
  
  const exportToExcel = () => {
    emit('export', 'excel')
  }
  
  // Métodos de paginación manual (exactos del original)
  const goToFirstPage = () => {
    emit('page', 1)
  }
  
  const goToPreviousPage = () => {
    if (props.pagination.page > 1) {
      emit('page', props.pagination.page - 1)
    }
  }
  
  const goToNextPage = () => {
    const maxPage = Math.ceil(props.pagination.total / props.pagination.pageSize)
    if (props.pagination.page < maxPage) {
      emit('page', props.pagination.page + 1)
    }
  }
  
  const goToLastPage = () => {
    const lastPage = Math.ceil(props.pagination.total / props.pagination.pageSize)
    emit('page', lastPage)
  }
  
  return {
    // Estado
    expandedRows,
    selectedPageSize,
    allColumns,
    
    // Computed
    visibleColumns,
    
    // Métodos de eventos
    onPage,
    onRowExpand,
    onRowCollapse,
    onPageSizeChange,
    
    // Métodos de tabla
    refreshTable,
    exportToExcel,
    
    // Métodos de paginación
    goToFirstPage,
    goToPreviousPage,
    goToNextPage,
    goToLastPage
  }
}