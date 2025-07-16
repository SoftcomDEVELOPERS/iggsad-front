// composables/useExpedientesTable.js
// Composable específico para la tabla de expedientes

import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

export function useExpedientesTable(props, emit) {
  // Estado específico de expedientes
  const selectedItems = ref([])
  const expandedRows = ref([]) // ← ARRAY, no Object
  
  // Composables
  const { showSuccess, showWarn, showError } = useToast()
  
  // Métodos de eventos (mantienen la interfaz original)
  const onPage = (e) => {
    emit('page', e)
  }
  
  const onSort = (sortEvent) => {
    if (sortEvent.sortedData) {
      // Mantener la funcionalidad exacta del componente original
      console.log('📊 Expedientes ordenados en useExpedientesTable')
    }
    emit('sort', sortEvent)
  }
  
  const onRefresh = () => {
    emit('refresh')
  }
  
  const onExport = (type) => {
    emit('export', type)
  }
  
  const onRowExpand = (e) => {
    emit('row-expand', e)
  }
  
  const onRowCollapse = (e) => {
    emit('row-collapse', e)
  }
  
  const onSelectionChange = (selection) => {
    selectedItems.value = selection
    emit('selection-change', selection)
  }
  
  // Métodos específicos de expedientes
  const viewExpediente = (data) => {
    emit('view-expediente', data)
  }
  
  const editExpediente = (data) => {
    console.log('Editar expediente:', data)
    showWarn('Función en desarrollo', 'La edición estará disponible próximamente')
  }
  
  const generateDocument = (data) => {
    showWarn('Función en desarrollo', 'La generación de documentos estará disponible próximamente')
  }
  
  const viewHistory = (data) => {
    showWarn('Función en desarrollo', 'El historial estará disponible próximamente')
  }
  
  const duplicateExpediente = (data) => {
    showWarn('Función en desarrollo', 'La duplicación estará disponible próximamente')
  }
  
  const archiveExpediente = (data) => {
    showWarn('Función en desarrollo', 'El archivado estará disponible próximamente')
  }
  
  // Funciones de exportación específicas de expedientes
  const onExportSelection = (selectedExpedientes) => {
    console.log('📊 Exportando expedientes seleccionados:', selectedExpedientes.length)
    
    if (selectedExpedientes.length === 0) {
      showWarn('Sin selección', 'Selecciona al menos un expediente para exportar')
      return
    }
    
    // Lógica específica de exportación de expedientes
    const totalPrincipal = selectedExpedientes.reduce((sum, exp) => sum + (parseFloat(exp.principal) || 0), 0)
    const carteras = [...new Set(selectedExpedientes.map(exp => exp.cartera))]
    
    console.log('💰 Total principal a exportar:', totalPrincipal)
    console.log('📁 Carteras en exportación:', carteras)
    
    showWarn('Función en desarrollo', 'La exportación de selección estará disponible próximamente')
  }
  
  const onBulkEmail = (selectedExpedientes) => {
    console.log('📧 Envío masivo a expedientes:', selectedExpedientes.length)
    
    if (selectedExpedientes.length === 0) {
      showWarn('Sin selección', 'Selecciona al menos un expediente para envío masivo')
      return
    }
    
    // Lógica específica de envío masivo de expedientes
    const clientesUnicos = [...new Set(selectedExpedientes.map(exp => exp.nombreTitular))]
    console.log('👥 Clientes únicos para envío:', clientesUnicos.length)
    
    showWarn('Función en desarrollo', 'El envío masivo estará disponible próximamente')
  }
  
  // Manejo de acciones (mantiene la funcionalidad original)
  const onAction = ({ action, data }) => {
    switch (action) {
      case 'view':
        viewExpediente(data)
        break
      case 'edit':
        editExpediente(data)
        break
      case 'generateDocument':
        generateDocument(data)
        break
      case 'viewHistory':
        viewHistory(data)
        break
      case 'duplicateExpediente':
        duplicateExpediente(data)
        break
      case 'archiveExpediente':
        archiveExpediente(data)
        break
      default:
        console.warn('Acción no reconocida:', action)
    }
  }
  
  // Funciones de análisis específicas de expedientes
  const getExpedientesStats = () => {
    const expedientes = props.expedientes || []
    
    if (expedientes.length === 0) {
      return {
        total: 0,
        totalPrincipal: 0,
        totalIntereses: 0,
        urgentes: 0,
        conEmbargos: 0,
        carteras: []
      }
    }
    
    const totalPrincipal = expedientes.reduce((sum, exp) => sum + (parseFloat(exp.principal) || 0), 0)
    const totalIntereses = expedientes.reduce((sum, exp) => sum + (parseFloat(exp.intereses) || 0), 0)
    
    // Usar la función isUrgent de la configuración
    const urgentes = expedientes.filter(exp => {
      const principal = parseFloat(exp.principal) || 0
      const daysSinceEnvio = exp.fechaEnvio ? 
        Math.floor((new Date() - new Date(exp.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
      return principal > 5000 || daysSinceEnvio > 90
    }).length
    
    const conEmbargos = expedientes.filter(exp => exp.embargos === 'Sí').length
    const carteras = [...new Set(expedientes.map(exp => exp.cartera))]
    
    return {
      total: expedientes.length,
      totalPrincipal,
      totalIntereses,
      totalDeuda: totalPrincipal + totalIntereses,
      urgentes,
      conEmbargos,
      carteras
    }
  }
  
  return {
    // Estado
    selectedItems,
    expandedRows,
    
    // Métodos de eventos
    onPage,
    onSort,
    onRefresh,
    onExport,
    onRowExpand,
    onRowCollapse,
    onSelectionChange,
    
    // Métodos de acciones
    onAction,
    onExportSelection,
    onBulkEmail,
    
    // Métodos específicos
    viewExpediente,
    editExpediente,
    generateDocument,
    viewHistory,
    duplicateExpediente,
    archiveExpediente,
    
    // Utilidades
    getExpedientesStats
  }
}