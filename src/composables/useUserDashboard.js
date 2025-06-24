// composables/useUserDashboard.js
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useUserDashboard() {
  const authStore = useAuthStore()
  
  // Estado reactivo
  const isConfigMode = ref(false)
  
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
        return 'grid grid-cols-1 lg:grid-cols-3 gap-6'
      case 'grid-auto':
        return 'grid grid-cols-1 lg:grid-cols-3 gap-6'
      case 'custom':
        return 'grid grid-cols-1 lg:grid-cols-12 gap-6' // Para posicionamiento custom
      default:
        return 'grid grid-cols-1 lg:grid-cols-3 gap-6'
    }
  })
  
  // Mapeo de cards a componentes/datos
  const cardDefinitions = {
    'casos-activos': {
      title: 'Casos Activos',
      icon: 'pi pi-folder',
      color: 'blue',
      component: 'StatCard',
      getData: () => ({ value: 147, label: 'Casos Activos' })
    },
    'audiencias-proximas': {
      title: 'Audiencias Próximas',
      icon: 'pi pi-calendar',
      color: 'green',
      component: 'StatCard',
      getData: () => ({ value: 12, label: 'Audiencias Próximas' })
    },
    'casos-urgentes': {
      title: 'Casos Urgentes',
      icon: 'pi pi-exclamation-triangle',
      color: 'amber',
      component: 'StatCard',
      getData: () => ({ value: 5, label: 'Casos Urgentes' })
    },
    'total-clientes': {
      title: 'Total Clientes',
      icon: 'pi pi-users',
      color: 'purple',
      component: 'StatCard',
      getData: () => ({ value: 89, label: 'Clientes' })
    },
    'busquedas-recientes': {
      title: 'Búsquedas Recientes',
      icon: 'pi pi-search',
      color: 'slate',
      component: 'RecentSearches',
      getData: () => ({})
    },
    'notificaciones': {
      title: 'Notificaciones',
      icon: 'pi pi-bell',
      color: 'blue',
      component: 'NotificationsPanel',
      getData: () => ({})
    },
    'chat': {
      title: 'Chat',
      icon: 'pi pi-comments',
      color: 'green',
      component: 'ChatPanel',
      getData: () => ({})
    },
    'acciones-rapidas': {
      title: 'Acciones Rápidas',
      icon: 'pi pi-bolt',
      color: 'orange',
      component: 'QuickActions',
      getData: () => ({})
    }
  }
  
  // Métodos para gestionar configuración
  const toggleCard = async (cardId) => {
    const cards = [...dashboardConfig.value.cards]
    const cardIndex = cards.findIndex(c => c.id === cardId)
    
    if (cardIndex !== -1) {
      cards[cardIndex].visible = !cards[cardIndex].visible
      await updateDashboardConfig({ cards })
    }
  }
  
  const reorderCards = async (newOrder) => {
    const cards = [...dashboardConfig.value.cards]
    newOrder.forEach((cardId, index) => {
      const cardIndex = cards.findIndex(c => c.id === cardId)
      if (cardIndex !== -1) {
        cards[cardIndex].order = index + 1
      }
    })
    
    await updateDashboardConfig({ cards })
  }
  
  const changeCardSize = async (cardId, newSize) => {
    const cards = [...dashboardConfig.value.cards]
    const cardIndex = cards.findIndex(c => c.id === cardId)
    
    if (cardIndex !== -1) {
      cards[cardIndex].size = newSize
      await updateDashboardConfig({ cards })
    }
  }
  
  const changeLayout = async (newLayout) => {
    await updateDashboardConfig({ layout: newLayout })
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
  }
  
  const exitConfigMode = () => {
    isConfigMode.value = false
  }
  
  const toggleConfigMode = () => {
    isConfigMode.value = !isConfigMode.value
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
  
  return {
    // Estado
    isConfigMode,
    
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
    
    // Métodos de configuración
    toggleCard,
    reorderCards,
    changeCardSize,
    changeLayout,
    updateDashboardConfig,
    
    // Modo configuración
    enterConfigMode,
    exitConfigMode,
    toggleConfigMode,
    
    // Helpers
    getCardDefinition,
    getCardSizeClasses,
    getCardData
  }
}