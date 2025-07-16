// composables/datatable/useTableSelection.js
// Lógica de selección extraída del ExpedientesTable.vue

import { ref, computed } from 'vue'

export function useTableSelection(config, props, emit) {
  // Estado local de selección (genérico)
  const selectedItems = ref([])
  
  // Modo de selección basado en configuración
  const selectionMode = computed(() => 
    config.meta.selectable ? 'checkbox' : null
  )
  
  // Función de cambio de selección (genérica)
  const onSelectionChange = (selection) => {
    selectedItems.value = selection
    
    console.log(`📋 ${config.meta.name.toUpperCase()} SELECCIONADOS:`)
    console.log('Total seleccionados:', selection.length)
    
    if (selection.length > 0) {
      const keyField = config.meta.dataKey || 'id'
      console.log(`Lista de ${keyField}:`, selection.map(item => item[keyField]))
      console.log('Detalle completo:', selection)
      
      // Mostrar datos específicos solo si es expedientes
      if (config.meta.name === 'expedientes') {
        const totalPrincipal = selection.reduce((sum, exp) => sum + (parseFloat(exp.principal) || 0), 0)
        console.log('💰 Total principal seleccionado:', totalPrincipal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }))
        
        const carteras = [...new Set(selection.map(exp => exp.cartera))]
        console.log('📁 Carteras involucradas:', carteras)
        
        const conEmbargos = selection.filter(exp => exp.embargos === 'Sí').length
        console.log('🔒 Con embargos:', conEmbargos, 'de', selection.length)
      }
      
    } else {
      console.log(`❌ No hay ${config.meta.name} seleccionados`)
    }
    
    // Emitir evento al componente padre
    emit('selection-change', selection)
  }
  
  // Función para obtener resumen de selección (genérica)
  const getSelectionSummary = () => {
    const selection = selectedItems.value
    
    if (selection.length === 0) {
      return `No hay ${config.meta.name} seleccionados`
    }
    
    const basicSummary = {
      total: selection.length,
      items: selection,
      ids: selection.map(item => item[config.meta.dataKey || 'id'])
    }
    
    // Añadir datos específicos para expedientes
    if (config.meta.name === 'expedientes') {
      const totalPrincipal = selection.reduce((sum, exp) => sum + (parseFloat(exp.principal) || 0), 0)
      const totalIntereses = selection.reduce((sum, exp) => sum + (parseFloat(exp.intereses) || 0), 0)
      const conEmbargos = selection.filter(exp => exp.embargos === 'Sí').length
      
      return {
        ...basicSummary,
        numeros: selection.map(exp => exp.numero),
        totalPrincipal: totalPrincipal,
        totalIntereses: totalIntereses,
        totalDeuda: totalPrincipal + totalIntereses,
        conEmbargos: conEmbargos,
        carteras: [...new Set(selection.map(exp => exp.cartera))]
      }
    }
    
    return basicSummary
  }
  
  // Función para limpiar la selección
  const clearSelection = () => {
    selectedItems.value = []
    console.log(`🧹 Selección de ${config.meta.name} limpiada`)
  }
  
  // Función para seleccionar todos los elementos visibles
  const selectAll = () => {
    const dataArray = props[config.meta.name] || props.data || []
    selectedItems.value = [...dataArray]
    console.log(`✅ Todos los ${config.meta.name} seleccionados:`, dataArray.length)
  }
  
  // Función para seleccionar elementos urgentes (solo para expedientes)
  const selectUrgent = () => {
    if (config.meta.name !== 'expedientes') {
      console.warn('selectUrgent solo está disponible para expedientes')
      return
    }
    
    const isUrgent = (data) => {
      const principal = parseFloat(data.principal) || 0
      const daysSinceEnvio = data.fechaEnvio ? 
        Math.floor((new Date() - new Date(data.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
      
      return principal > 5000 || daysSinceEnvio > 90
    }
    
    const dataArray = props.expedientes || []
    const urgentItems = dataArray.filter(item => isUrgent(item))
    selectedItems.value = urgentItems
    console.log(`🚨 ${config.meta.name} urgentes seleccionados:`, urgentItems.length)
  }
  
  // Computed para información de la selección
  const selectionInfo = computed(() => {
    const summary = getSelectionSummary()
    
    if (typeof summary === 'string') {
      return { hasSelection: false, message: summary }
    }
    
    const baseInfo = {
      hasSelection: true,
      total: summary.total,
      message: `${summary.total} ${config.meta.name}${summary.total !== 1 ? 's' : ''} seleccionado${summary.total !== 1 ? 's' : ''}`
    }
    
    // Añadir info específica para expedientes
    if (config.meta.name === 'expedientes' && summary.totalPrincipal !== undefined) {
      return {
        ...baseInfo,
        totalPrincipal: summary.totalPrincipal,
        totalIntereses: summary.totalIntereses,
        totalDeuda: summary.totalDeuda,
        conEmbargos: summary.conEmbargos,
        carteras: summary.carteras
      }
    }
    
    return baseInfo
  })
  
  return {
    // Estado
    selectedItems,
    
    // Computed
    selectionMode,
    selectionInfo,
    
    // Métodos
    onSelectionChange,
    getSelectionSummary,
    clearSelection,
    selectAll,
    selectUrgent
  }
}