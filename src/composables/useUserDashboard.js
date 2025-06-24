// composables/useUserDashboard.js - VERSIÓN COMPLETA
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useUserDashboard() {
  const authStore = useAuthStore()
  
  // Estado reactivo
  const isConfigMode = ref(false)
  const isDragging = ref(false)
  
  // Computed para obtener configuración del dashboard
  const dashboardConfig = computed(() => {
    return authStore.userProfile?.dashboard || authStore.getDefaultUserProfile().dashboard
  })
  
  // Computed para tarjetas visibles ordenadas
  const visibleCards = computed(() => {
    return dashboardConfig.value.cards
      .filter(card => card.visible)
      .sort((a, b) => a.order - b.order)
  })
  
  // Computed para tarjetas por tipo
  const statCards = computed(() => 
    visibleCards.value.filter(card => card.type === 'stat')
  )
  
  const contentCards = computed(() => 
    visibleCards.value.filter(card => card.type === 'content')
  )
  
  const sidebarCards = computed(() => 
    visibleCards.value.filter(card => card.type === 'sidebar')
  )
  
  // Computed para layout del grid
  const gridLayout = computed(() => {
    return dashboardConfig.value.layout || 'grid-auto'
  })
  
  // Computed para clases CSS del layout
  const gridClasses = computed(() => {
    switch (gridLayout.value) {
      case 'grid-2-cols':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      case 'grid-3-cols':
        return 'grid grid-cols-1 lg:grid-cols-4 gap-6' // 3 para main + 1 para sidebar
      case 'grid-auto':
        return 'grid grid-cols-1 lg:grid-cols-4 gap-6' // 3 para main + 1 para sidebar
      case 'custom':
        return 'grid grid-cols-1 lg:grid-cols-12 gap-6' // Para posicionamiento custom
      default:
        return 'grid grid-cols-1 lg:grid-cols-4 gap-6'
    }
  })
  
  // Mapeo completo de cards a componentes/datos
  const cardDefinitions = {
    'casos-activos': {
      title: 'Casos Activos',
      icon: 'pi pi-folder',
      color: 'blue',
      component: 'StatCard',
      type: 'stat',
      getData: () => ({ value: 147, label: 'Casos Activos' })
    },
    'audiencias-proximas': {
      title: 'Audiencias Próximas',
      icon: 'pi pi-calendar',
      color: 'green',
      component: 'StatCard',
      type: 'stat',
      getData: () => ({ value: 12, label: 'Audiencias Próximas' })
    },
    'casos-urgentes': {
      title: 'Casos Urgentes',
      icon: 'pi pi-exclamation-triangle',
      color: 'amber',
      component: 'StatCard',
      type: 'stat',
      getData: () => ({ value: 5, label: 'Casos Urgentes' })
    },
    'total-clientes': {
      title: 'Total Clientes',
      icon: 'pi pi-users',
      color: 'purple',
      component: 'StatCard',
      type: 'stat',
      getData: () => ({ value: 89, label: 'Clientes' })
    },
    'busquedas-recientes': {
      title: 'Búsquedas Recientes',
      icon: 'pi pi-search',
      color: 'slate',
      component: 'ContentCard',
      type: 'content',
      getData: () => ({
        searches: [
          { id: 1, expediente: 'EXP-2024-001', cliente: 'García López, María', deuda: '€25,450' },
          { id: 2, expediente: 'EXP-2024-045', cliente: 'Empresas del Norte S.L.', deuda: '€87,230' },
          { id: 3, expediente: 'EXP-2024-023', cliente: 'Martín Rodríguez, Juan', deuda: '€12,800' }
        ]
      })
    },
    'notificaciones': {
      title: 'Notificaciones',
      icon: 'pi pi-bell',
      color: 'blue',
      component: 'SidebarCard',
      type: 'sidebar',
      getData: () => ({
        notifications: [
          { id: 1, title: 'Audiencia mañana', message: 'EXP-2024-001 a las 10:00', time: 'Hace 1h', read: false },
          { id: 2, title: 'Documento subido', message: 'Nuevo archivo en EXP-2024-045', time: 'Hace 2h', read: false },
          { id: 3, title: 'Plazo próximo', message: 'Alegaciones EXP-2024-023', time: 'Ayer', read: true }
        ],
        unreadCount: 2
      })
    },
    'chat': {
      title: 'Chat',
      icon: 'pi pi-comments',
      color: 'green',
      component: 'SidebarCard',
      type: 'sidebar',
      getData: () => ({
        messages: [
          { id: 1, sender: 'María García', preview: '¿Podemos revisar el contrato mañana?', time: 'Hace 30 min', unread: true },
          { id: 2, sender: 'Juan Martín', preview: 'Adjunto documentación solicitada', time: 'Hace 1h', unread: true }
        ],
        unreadCount: 2
      })
    },
    'acciones-rapidas': {
      title: 'Acciones Rápidas',
      icon: 'pi pi-bolt',
      color: 'orange',
      component: 'SidebarCard',
      type: 'sidebar',
      getData: () => ({
        actions: [
          { id: 'nuevo-caso', label: 'Nuevo Caso', icon: 'pi pi-plus' },
          { id: 'subir-doc', label: 'Subir Documento', icon: 'pi pi-upload' },
          { id: 'nuevo-cliente', label: 'Nuevo Cliente', icon: 'pi pi-user-plus' }
        ]
      })
    }
  }
  
  // Métodos para gestionar configuración
  const toggleCard = async (cardId) => {
    try {
      const cards = [...dashboardConfig.value.cards]
      const cardIndex = cards.findIndex(c => c.id === cardId)
      
      if (cardIndex !== -1) {
        cards[cardIndex].visible = !cards[cardIndex].visible
        await updateDashboardConfig({ cards })
        
        console.log(`Card ${cardId} ${cards[cardIndex].visible ? 'mostrada' : 'ocultada'}`)
      }
    } catch (error) {
      console.error('Error al alternar tarjeta:', error)
      throw error
    }
  }
  
  const reorderCards = async (newOrder) => {
    try {
      const cards = [...dashboardConfig.value.cards]
      newOrder.forEach((cardId, index) => {
        const cardIndex = cards.findIndex(c => c.id === cardId)
        if (cardIndex !== -1) {
          cards[cardIndex].order = index + 1
        }
      })
      
      await updateDashboardConfig({ cards })
      console.log('Cards reordenadas exitosamente')
    } catch (error) {
      console.error('Error al reordenar tarjetas:', error)
      throw error
    }
  }
  
  const changeCardSize = async (cardId, newSize) => {
    try {
      const cards = [...dashboardConfig.value.cards]
      const cardIndex = cards.findIndex(c => c.id === cardId)
      
      if (cardIndex !== -1) {
        cards[cardIndex].size = newSize
        await updateDashboardConfig({ cards })
        
        console.log(`Card ${cardId} cambió a tamaño ${newSize}`)
      }
    } catch (error) {
      console.error('Error al cambiar tamaño de tarjeta:', error)
      throw error
    }
  }
  
  const changeLayout = async (newLayout) => {
    try {
      await updateDashboardConfig({ layout: newLayout })
      console.log(`Layout cambiado a ${newLayout}`)
    } catch (error) {
      console.error('Error al cambiar layout:', error)
      throw error
    }
  }
  
  const updateDashboardConfig = async (updates) => {
    try {
      await authStore.updateDashboardConfig(updates)
      console.log('✅ Configuración del dashboard actualizada')
    } catch (error) {
      console.error('❌ Error al actualizar configuración:', error)
      throw error
    }
  }
  
  // Métodos para modo configuración
  const enterConfigMode = () => {
    isConfigMode.value = true
    console.log('Modo configuración activado')
  }
  
  const exitConfigMode = async () => {
    try {
      // Aquí podrías guardar cambios pendientes
      isConfigMode.value = false
      console.log('Modo configuración desactivado')
    } catch (error) {
      console.error('Error al salir del modo configuración:', error)
      throw error
    }
  }
  
  const toggleConfigMode = async () => {
    if (isConfigMode.value) {
      await exitConfigMode()
    } else {
      enterConfigMode()
    }
  }
  
  // Métodos para drag and drop
  const startCardDrag = (cardId) => {
    isDragging.value = true
    console.log(`Iniciando drag de card: ${cardId}`)
  }
  
  const endCardDrag = () => {
    isDragging.value = false
    console.log('Drag terminado')
  }
  
  const swapCards = async (draggedCardId, targetCardId) => {
    try {
      const cards = [...dashboardConfig.value.cards]
      const draggedIndex = cards.findIndex(c => c.id === draggedCardId)
      const targetIndex = cards.findIndex(c => c.id === targetCardId)
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Intercambiar órdenes
        const draggedOrder = cards[draggedIndex].order
        const targetOrder = cards[targetIndex].order
        
        cards[draggedIndex].order = targetOrder
        cards[targetIndex].order = draggedOrder
        
        await updateDashboardConfig({ cards })
        console.log(`Cards intercambiadas: ${draggedCardId} ↔ ${targetCardId}`)
      }
    } catch (error) {
      console.error('Error al intercambiar cards:', error)
      throw error
    }
  }
  
  // Helper para obtener definición de una card
  const getCardDefinition = (cardId) => {
    return cardDefinitions[cardId] || null
  }
  
  // Helper para obtener clases CSS según el tamaño
  const getCardSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'col-span-1'
      case 'normal':
        return 'col-span-1'
      case 'large':
        return 'col-span-1 lg:col-span-2'
      case 'xl':
        return 'col-span-1 lg:col-span-3'
      default:
        return 'col-span-1'
    }
  }
  
  // Helper para obtener datos de una card
  const getCardData = (cardId) => {
    const definition = cardDefinitions[cardId]
    return definition ? definition.getData() : {}
  }
  
  // Métodos para gestión de cards específicas
  const addCard = async (cardId, type = 'stat', size = 'normal') => {
    try {
      const cards = [...dashboardConfig.value.cards]
      const maxOrder = Math.max(...cards.map(c => c.order), 0)
      
      const newCard = {
        id: cardId,
        type,
        visible: true,
        order: maxOrder + 1,
        size
      }
      
      cards.push(newCard)
      await updateDashboardConfig({ cards })
      
      console.log(`Card ${cardId} añadida`)
    } catch (error) {
      console.error('Error al añadir card:', error)
      throw error
    }
  }
  
  const removeCard = async (cardId) => {
    try {
      const cards = dashboardConfig.value.cards.filter(c => c.id !== cardId)
      await updateDashboardConfig({ cards })
      
      console.log(`Card ${cardId} eliminada`)
    } catch (error) {
      console.error('Error al eliminar card:', error)
      throw error
    }
  }
  
  const resetToDefault = async () => {
    try {
      const defaultProfile = authStore.getDefaultUserProfile()
      await updateDashboardConfig(defaultProfile.dashboard)
      
      console.log('Dashboard restablecido a configuración por defecto')
    } catch (error) {
      console.error('Error al restablecer dashboard:', error)
      throw error
    }
  }
  
  // Métodos de validación
  const validateCardConfig = (cardConfig) => {
    const requiredFields = ['id', 'type', 'visible', 'order', 'size']
    return requiredFields.every(field => cardConfig.hasOwnProperty(field))
  }
  
  const validateDashboardConfig = (config) => {
    if (!config.cards || !Array.isArray(config.cards)) {
      return false
    }
    
    return config.cards.every(validateCardConfig)
  }
  
  // Computed para estadísticas del dashboard
  const dashboardStats = computed(() => {
    const totalCards = dashboardConfig.value.cards.length
    const visibleCardsCount = visibleCards.value.length
    const hiddenCardsCount = totalCards - visibleCardsCount
    
    return {
      total: totalCards,
      visible: visibleCardsCount,
      hidden: hiddenCardsCount,
      statCards: statCards.value.length,
      contentCards: contentCards.value.length,
      sidebarCards: sidebarCards.value.length
    }
  })
  
  // Métodos para exportar/importar configuración
  const exportDashboardConfig = () => {
    const config = {
      dashboard: dashboardConfig.value,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    console.log('Configuración exportada')
  }
  
  const importDashboardConfig = async (configFile) => {
    try {
      const text = await configFile.text()
      const config = JSON.parse(text)
      
      if (validateDashboardConfig(config.dashboard)) {
        await updateDashboardConfig(config.dashboard)
        console.log('Configuración importada exitosamente')
        return true
      } else {
        throw new Error('Configuración inválida')
      }
    } catch (error) {
      console.error('Error al importar configuración:', error)
      throw error
    }
  }
  
  return {
    // Estado
    isConfigMode,
    isDragging,
    
    // Configuración
    dashboardConfig,
    gridLayout,
    gridClasses,
    
    // Cards organizadas
    visibleCards,
    statCards,
    contentCards,
    sidebarCards,
    
    // Definiciones
    cardDefinitions,
    
    // Métodos de configuración básicos
    toggleCard,
    reorderCards,
    changeCardSize,
    changeLayout,
    updateDashboardConfig,
    
    // Modo configuración
    enterConfigMode,
    exitConfigMode,
    toggleConfigMode,
    
    // Drag and drop
    startCardDrag,
    endCardDrag,
    swapCards,
    
    // Gestión avanzada de cards
    addCard,
    removeCard,
    resetToDefault,
    
    // Helpers
    getCardDefinition,
    getCardSizeClasses,
    getCardData,
    
    // Estadísticas
    dashboardStats,
    
    // Importar/Exportar
    exportDashboardConfig,
    importDashboardConfig,
    
    // Validación
    validateCardConfig,
    validateDashboardConfig
  }
}