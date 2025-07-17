// composables/datatable/useTableSelection.js
// ✅ MEJORADO - Gestión completa de selección sin duplicaciones

import { ref, computed, watch } from 'vue'

export function useTableSelection(config, props, emit) {
  // ✅ Estado de selección reactivo
  const selectedItems = ref([...props.selectedItems])
  
  // ✅ Modo de selección basado en configuración
  const selectionMode = computed(() => {
    if (!config.meta?.selectable) return null
    return config.meta.selectionMode || 'multiple'
  })
  
  // ✅ Información calculada de selección
  const selectionInfo = computed(() => {
    const count = selectedItems.value?.length || 0
    const total = props.data?.length || 0
    const hasSelection = count > 0
    const isAllSelected = total > 0 && count === total
    const isPartiallySelected = count > 0 && count < total
    
    return {
      count,
      total,
      hasSelection,
      isAllSelected,
      isPartiallySelected,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }
  })
  
  // ✅ Sincronizar con props cuando cambien
  watch(
    () => props.selectedItems,
    (newValue) => {
      selectedItems.value = [...(newValue || [])]
    },
    { deep: true }
  )
  
  // ✅ MÉTODOS DE SELECCIÓN
  
  // Cambio de selección desde DataTable
  const onSelectionChange = (newSelection) => {
    selectedItems.value = newSelection || []
    emit('selection-change', selectedItems.value)
  }
  
  // Limpiar selección
  const clearSelection = () => {
    selectedItems.value = []
    emit('selection-change', [])
  }
  
  // Seleccionar todo
  const selectAll = () => {
    selectedItems.value = [...(props.data || [])]
    emit('selection-change', selectedItems.value)
  }
  
  // Alternar selección de todo
  const toggleSelectAll = () => {
    if (selectionInfo.value.isAllSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }
  
  // Seleccionar por índices
  const selectByIndices = (indices) => {
    const items = indices
      .filter(index => index >= 0 && index < props.data.length)
      .map(index => props.data[index])
    selectedItems.value = items
    emit('selection-change', selectedItems.value)
  }
  
  // Seleccionar por condición
  const selectByCondition = (conditionFn) => {
    const items = (props.data || []).filter(conditionFn)
    selectedItems.value = items
    emit('selection-change', selectedItems.value)
  }
  
  // Verificar si un elemento está seleccionado
  const isSelected = (item) => {
    const dataKey = config.meta?.dataKey
    if (!dataKey || !item) return false
    
    return selectedItems.value.some(
      selected => selected[dataKey] === item[dataKey]
    )
  }
  
  // Alternar selección de un elemento
  const toggleSelection = (item) => {
    if (!item) return
    
    const dataKey = config.meta?.dataKey
    if (!dataKey) return
    
    const index = selectedItems.value.findIndex(
      selected => selected[dataKey] === item[dataKey]
    )
    
    if (index > -1) {
      // Deseleccionar
      selectedItems.value.splice(index, 1)
    } else {
      // Seleccionar
      selectedItems.value.push(item)
    }
    
    emit('selection-change', selectedItems.value)
  }
  
  // ✅ MÉTODOS DE UTILIDAD
  
  // Obtener IDs de elementos seleccionados
  const getSelectedIds = () => {
    const dataKey = config.meta?.dataKey
    if (!dataKey) return []
    
    return selectedItems.value.map(item => item[dataKey])
  }
  
  // Obtener estadísticas de selección
  const getSelectionStats = () => {
    return {
      ...selectionInfo.value,
      selectedIds: getSelectedIds(),
      selectedItems: selectedItems.value
    }
  }
  
  return {
    // ✅ Estado reactivo
    selectedItems,
    
    // ✅ Computed properties
    selectionMode,
    selectionInfo,
    
    // ✅ Métodos principales
    onSelectionChange,
    clearSelection,
    selectAll,
    toggleSelectAll,
    
    // ✅ Métodos de selección avanzada
    selectByIndices,
    selectByCondition,
    isSelected,
    toggleSelection,
    
    // ✅ Utilidades
    getSelectedIds,
    getSelectionStats,
    
    // ✅ Computed helpers (para compatibilidad)
    isAllSelected: computed(() => selectionInfo.value.isAllSelected),
    hasSelection: computed(() => selectionInfo.value.hasSelection)
  }
}