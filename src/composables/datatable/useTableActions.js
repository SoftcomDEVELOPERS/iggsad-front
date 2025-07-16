// composables/datatable/useTableActions.js
// Acciones genéricas reutilizables para todas las tablas

import { useToast } from '@/composables/useToast'

export function useTableActions(config, props, emit) {
  const { showSuccess, showWarn, showError } = useToast()
  
  // ===== ACCIONES GENÉRICAS REUTILIZABLES =====
  
  /**
   * Ver elemento (genérico)
   */
  const viewItem = (data, entityName = config.meta.name) => {
    console.log(`👁️ Ver ${entityName}:`, data[config.meta.dataKey])
    emit('view-item', data)
  }
  
  /**
   * Editar elemento (genérico)
   */
  const editItem = (data, entityName = config.meta.name) => {
    console.log(`✏️ Editar ${entityName}:`, data[config.meta.dataKey])
    emit('edit-item', data)
  }
  
  /**
   * Duplicar elemento (genérico)
   */
  const duplicateItem = async (data, entityName = config.meta.name) => {
    console.log(`📋 Duplicar ${entityName}:`, data[config.meta.dataKey])
    
    try {
      // Crear datos duplicados
      const duplicatedData = {
        ...data,
        [config.meta.dataKey]: `${data[config.meta.dataKey]}-COPIA`,
        id: undefined, // Nuevo ID será asignado por el backend
        fechaCreacion: new Date().toISOString()
      }
      
      emit('duplicate-item', { original: data, duplicated: duplicatedData })
      showSuccess('Elemento duplicado', `${entityName} duplicado correctamente`)
      
    } catch (error) {
      console.error('❌ Error al duplicar:', error)
      showError('Error al duplicar', error.message)
    }
  }
  
  /**
   * Eliminar elemento (genérico)
   */
  const deleteItem = async (data, entityName = config.meta.name) => {
    console.log(`🗑️ Eliminar ${entityName}:`, data[config.meta.dataKey])
    
    // En una implementación real, aquí se mostraría un diálogo de confirmación
    emit('delete-item', data)
    showWarn('Confirmar eliminación', `¿Estás seguro de eliminar este ${entityName}?`)
  }
  
  /**
   * Archivar elemento (genérico)
   */
  const archiveItem = async (data, entityName = config.meta.name) => {
    console.log(`🗃️ Archivar ${entityName}:`, data[config.meta.dataKey])
    
    emit('archive-item', data)
    showSuccess('Elemento archivado', `${entityName} archivado correctamente`)
  }
  
  /**
   * Generar documento (genérico)
   */
  const generateDocument = async (data, documentType = 'PDF', entityName = config.meta.name) => {
    console.log(`📄 Generar documento ${documentType} para ${entityName}:`, data[config.meta.dataKey])
    
    const documentData = {
      item: data,
      type: documentType,
      timestamp: new Date().toISOString(),
      entityName
    }
    
    emit('generate-document', documentData)
    showSuccess('Documento generado', `Documento ${documentType} generado para ${entityName}`)
  }
  
  /**
   * Ver historial (genérico)
   */
  const viewHistory = (data, entityName = config.meta.name) => {
    console.log(`📚 Ver historial de ${entityName}:`, data[config.meta.dataKey])
    
    emit('view-history', data)
    showWarn('Función en desarrollo', 'El historial estará disponible próximamente')
  }
  
  /**
   * Exportar selección (genérico)
   */
  const exportSelection = (selectedItems, format = 'excel', entityName = config.meta.name) => {
    console.log(`📊 Exportar ${selectedItems.length} ${entityName}s en formato ${format}`)
    
    if (selectedItems.length === 0) {
      showWarn('Sin selección', `Selecciona al menos un ${entityName} para exportar`)
      return
    }
    
    const exportData = {
      items: selectedItems,
      format: format,
      entityName: entityName,
      timestamp: new Date().toISOString(),
      totalItems: selectedItems.length
    }
    
    emit('export-selection', exportData)
    showSuccess('Exportación iniciada', `Exportando ${selectedItems.length} ${entityName}s...`)
  }
  
  /**
   * Envío masivo (genérico)
   */
  const bulkAction = (selectedItems, actionType = 'email', entityName = config.meta.name) => {
    console.log(`📧 Acción masiva '${actionType}' a ${selectedItems.length} ${entityName}s`)
    
    if (selectedItems.length === 0) {
      showWarn('Sin selección', `Selecciona al menos un ${entityName} para la acción masiva`)
      return
    }
    
    const bulkData = {
      items: selectedItems,
      actionType: actionType,
      entityName: entityName,
      timestamp: new Date().toISOString(),
      totalItems: selectedItems.length
    }
    
    emit('bulk-action', bulkData)
    showSuccess('Acción masiva iniciada', `Ejecutando '${actionType}' en ${selectedItems.length} ${entityName}s...`)
  }
  
  /**
   * Refresh genérico
   */
  const refreshData = () => {
    console.log('🔄 Refrescando datos de la tabla')
    emit('refresh')
    showSuccess('Datos actualizados', 'La tabla se ha actualizado correctamente')
  }
  
  /**
   * Exportar todos los datos
   */
  const exportAll = (format = 'excel', entityName = config.meta.name) => {
    console.log(`📊 Exportar todos los ${entityName}s en formato ${format}`)
    
    const exportData = {
      format: format,
      entityName: entityName,
      timestamp: new Date().toISOString(),
      includeAll: true
    }
    
    emit('export-all', exportData)
    showSuccess('Exportación completa iniciada', `Generando archivo ${format.toUpperCase()}...`)
  }
  
  // ===== ROUTER DE ACCIONES GENÉRICO =====
  
  /**
   * Manejador principal de acciones
   */
  const handleAction = ({ action, data, selectedItems = [] }) => {
    const entityName = config.meta.name
    
    switch (action) {
      // Acciones individuales
      case 'view':
        viewItem(data, entityName)
        break
      case 'edit':
        editItem(data, entityName)
        break
      case 'duplicate':
        duplicateItem(data, entityName)
        break
      case 'delete':
        deleteItem(data, entityName)
        break
      case 'archive':
        archiveItem(data, entityName)
        break
      case 'generateDocument':
        generateDocument(data, 'PDF', entityName)
        break
      case 'generateExcel':
        generateDocument(data, 'Excel', entityName)
        break
      case 'viewHistory':
        viewHistory(data, entityName)
        break
        
      // Acciones masivas
      case 'exportSelection':
        exportSelection(selectedItems, 'excel', entityName)
        break
      case 'bulkEmail':
        bulkAction(selectedItems, 'email', entityName)
        break
      case 'bulkSMS':
        bulkAction(selectedItems, 'sms', entityName)
        break
      case 'bulkPrint':
        bulkAction(selectedItems, 'print', entityName)
        break
        
      // Acciones de tabla
      case 'refresh':
        refreshData()
        break
      case 'exportAll':
        exportAll('excel', entityName)
        break
        
      default:
        console.warn('Acción no reconocida:', action)
        showWarn('Acción no disponible', `La acción '${action}' no está implementada`)
    }
  }
  
  // ===== FUNCIONES DE UTILIDAD =====
  
  /**
   * Obtener estadísticas de selección genérica
   */
  const getSelectionStats = (selectedItems) => {
    if (selectedItems.length === 0) {
      return { total: 0, message: `No hay ${config.meta.name} seleccionados` }
    }
    
    return {
      total: selectedItems.length,
      message: `${selectedItems.length} ${config.meta.name}${selectedItems.length !== 1 ? 's' : ''} seleccionado${selectedItems.length !== 1 ? 's' : ''}`
    }
  }
  
  /**
   * Validar si una acción está disponible
   */
  const isActionAvailable = (actionKey) => {
    const action = config.actions?.[actionKey]
    return action && action.enabled === true
  }
  
  /**
   * Obtener configuración de una acción
   */
  const getActionConfig = (actionKey) => {
    return config.actions?.[actionKey] || null
  }
  
  return {
    // Acciones individuales
    viewItem,
    editItem,
    duplicateItem,
    deleteItem,
    archiveItem,
    generateDocument,
    viewHistory,
    
    // Acciones masivas
    exportSelection,
    bulkAction,
    refreshData,
    exportAll,
    
    // Router principal
    handleAction,
    
    // Utilidades
    getSelectionStats,
    isActionAvailable,
    getActionConfig
  }
}