// composables/datatable/useTableSorting.js
// Lógica de ordenación extraída y generalizada

import { ref } from 'vue'
import { COMMON_TABLE_HELPERS } from '@/constants/datatableConfig/commonTableConfig'

export function useTableSorting(config, props, emit) {
  // Estado local de ordenación
  const multiSortMeta = ref([])
  
  // Método de ordenación (exacto del ExpedientesTable original pero generalizado)
  const onSort = (e) => {
    multiSortMeta.value = e.multiSortMeta
    
    // Si no hay datos que ordenar, emitir el evento y salir
    const dataArray = props[config.meta.name] || props.data || []
    if (!dataArray || dataArray.length === 0) {
      emit('sort', e)
      return
    }
    
    // Usar la función común de ordenación
    const sortedData = COMMON_TABLE_HELPERS.sortData(dataArray, e.multiSortMeta, config)
    
    // Emitir evento con los datos ordenados
    emit('sort', {
      originalEvent: e,
      sortedData: sortedData,
      multiSortMeta: e.multiSortMeta
    })
    
    console.log('✅ Datos ordenados correctamente:', {
      criterios: e.multiSortMeta.map(s => `${s.field}: ${s.order === 1 ? 'ASC' : 'DESC'}`),
      totalFilas: sortedData.length
    })
  }
  
  // Limpiar ordenación
  const clearSort = () => {
    multiSortMeta.value = []
  }
  
  // Aplicar ordenación específica
  const applySorting = (field, order = 1) => {
    multiSortMeta.value = [{ field, order }]
    const mockEvent = {
      multiSortMeta: multiSortMeta.value
    }
    onSort(mockEvent)
  }
  
  // Añadir criterio de ordenación
  const addSortCriteria = (field, order = 1) => {
    const existingIndex = multiSortMeta.value.findIndex(sort => sort.field === field)
    
    if (existingIndex !== -1) {
      // Actualizar criterio existente
      multiSortMeta.value[existingIndex].order = order
    } else {
      // Añadir nuevo criterio
      multiSortMeta.value.push({ field, order })
    }
    
    const mockEvent = {
      multiSortMeta: multiSortMeta.value
    }
    onSort(mockEvent)
  }
  
  // Remover criterio de ordenación
  const removeSortCriteria = (field) => {
    multiSortMeta.value = multiSortMeta.value.filter(sort => sort.field !== field)
    
    if (multiSortMeta.value.length > 0) {
      const mockEvent = {
        multiSortMeta: multiSortMeta.value
      }
      onSort(mockEvent)
    }
  }
  
  return {
    // Estado
    multiSortMeta,
    
    // Métodos
    onSort,
    clearSort,
    applySorting,
    addSortCriteria,
    removeSortCriteria
  }
}