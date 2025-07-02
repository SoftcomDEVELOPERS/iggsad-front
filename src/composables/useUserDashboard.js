// src/composables/useUserDashboard.js - VERSIÓN ACTUALIZADA
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useUserDashboard() {
  const authStore = useAuthStore()
  
  // Estado reactivo
  const isConfigMode = ref(false)
  const isDragging = ref(false)
  const isResizing = ref(false)
  const currentBreakpoint = ref('lg')
  const autoSaveTimer = ref(null)
  
  // Layout por defecto
  const defaultLayout = [
    { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
    { i: 'recent-searches', x: 8, y: 0, w: 4, h: 4 },
    { i: 'notifications', x: 0, y: 4, w: 6, h: 3 },
    { i: 'chat', x: 6, y: 4, w: 6, h: 3 }
  ]
  
  // Configuración por defecto de las cards
  const defaultCardsConfig = {
    'stats-dashboard': {
      selectedStats: ['casos-activos', 'audiencias-proximas', 'casos-urgentes', 'total-clientes'],
      gridLayout: 'auto',
      refreshInterval: 30000, // 30 segundos
      minW: 6,
      minH: 3,
      maxW: 12,
      maxH: 6
    },
    'recent-searches': {
      maxItems: 5,
      showClearButton: true,
      autoRefresh: false,
      minW: 3,
      minH: 3,
      maxW: 6,
      maxH: 8
    },
    'notifications': {
      maxItems: 10,
      showReadAll: true,
      autoRefresh: true,
      refreshInterval: 60000, // 1 minuto
      minW: 3,
      minH: 3,
      maxW: 8,
      maxH: 6
    },
    'chat': {
      autoRefresh: true,
      showOnlineUsers: true,
      refreshInterval: 5000, // 5 segundos
      minW: 4,
      minH: 3,
      maxW: 8,
      maxH: 8
    },
    'quick-actions': {
      actions: ['nuevo-caso', 'nueva-audiencia', 'subir-documento'],
      layout: 'grid',
      minW: 2,
      minH: 2,
      maxW: 4,
      maxH: 4
    }
  }
  
  // Computed properties
  const dashboardConfig = computed(() => {
    return authStore.userProfile?.dashboard || {
      layout: defaultLayout,
      cardsConfig: defaultCardsConfig,
      lastModified: new Date().toISOString()
    }
  })
  
  const dashboardLayout = computed(() => {
    return dashboardConfig.value.layout || defaultLayout
  })
  
  const cardsConfig = computed(() => {
    return dashboardConfig.value.cardsConfig || defaultCardsConfig
  })
  
  // Definición de cards disponibles
  const availableCards = ref([
    {
      id: 'stats-dashboard',
      title: 'Estadísticas',
      description: 'Resumen de casos, audiencias y métricas clave',
      icon: 'pi pi-chart-bar',
      category: 'analytics',
      defaultSize: { w: 8, h: 4 }
    },
    {
      id: 'recent-searches',
      title: 'Búsquedas Recientes',
      description: 'Historial de búsquedas y accesos rápidos',
      icon: 'pi pi-search',
      category: 'navigation',
      defaultSize: { w: 4, h: 4 }
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Alertas, recordatorios y notificaciones del sistema',
      icon: 'pi pi-bell',
      category: 'communication',
      defaultSize: { w: 6, h: 3 }
    },
    {
      id: 'chat',
      title: 'Chat y Mensajes',
      description: 'Comunicación con el equipo y clientes',
      icon: 'pi pi-comments',
      category: 'communication',
      defaultSize: { w: 6, h: 3 }
    },
    {
      id: 'quick-actions',
      title: 'Acciones Rápidas',
      description: 'Botones para las tareas más frecuentes',
      icon: 'pi pi-bolt',
      category: 'productivity',
      defaultSize: { w: 3, h: 3 }
    },
    {
      id: 'calendar-widget',
      title: 'Calendario',
      description: 'Vista rápida del calendario y próximas citas',
      icon: 'pi pi-calendar',
      category: 'scheduling',
      defaultSize: { w: 4, h: 4 }
    },
    {
      id: 'tasks-widget',
      title: 'Tareas Pendientes',
      description: 'Lista de tareas y recordatorios',
      icon: 'pi pi-check-square',
      category: 'productivity',
      defaultSize: { w: 4, h: 5 }
    },
    {
      id: 'documents-widget',
      title: 'Documentos Recientes',
      description: 'Acceso rápido a documentos recientes',
      icon: 'pi pi-file',
      category: 'documents',
      defaultSize: { w: 4, h: 3 }
    }
  ])
  
  // Métodos de gestión del layout
  const updateDashboardLayout = async (newLayout) => {
    try {
      const updatedConfig = {
        ...dashboardConfig.value,
        layout: newLayout,
        lastModified: new Date().toISOString()
      }
      
      // Usar el método del store para actualizar el perfil
      await authStore.updateDashboardConfig({
        dashboard: updatedConfig
      })
      
      console.log('✅ Layout actualizado correctamente')
      return true
    } catch (error) {
      console.error('❌ Error al actualizar layout:', error)
      throw error
    }
  }
  
  const updateCardConfig = async (cardId, newConfig) => {
    try {
      const updatedCardsConfig = {
        ...cardsConfig.value,
        [cardId]: {
          ...cardsConfig.value[cardId],
          ...newConfig
        }
      }
      
      const updatedDashboardConfig = {
        ...dashboardConfig.value,
        cardsConfig: updatedCardsConfig,
        lastModified: new Date().toISOString()
      }
      
      // Usar el método del store para actualizar el perfil
      await authStore.updateDashboardConfig({
        dashboard: updatedDashboardConfig
      })
      
      console.log(`✅ Configuración de card ${cardId} actualizada`)
      return true
    } catch (error) {
      console.error(`❌ Error al actualizar configuración de card ${cardId}:`, error)
      throw error
    }
  }
  
  const addCard = async (cardId, position = null) => {
    try {
      const cardDefinition = availableCards.value.find(card => card.id === cardId)
      if (!cardDefinition) {
        throw new Error(`Card ${cardId} no encontrada`)
      }
      
      // Calcular posición automática si no se proporciona
      const finalPosition = position || findOptimalPosition(cardDefinition.defaultSize)
      
      const newLayoutItem = {
        i: cardId,
        x: finalPosition.x,
        y: finalPosition.y,
        w: finalPosition.w || cardDefinition.defaultSize.w,
        h: finalPosition.h || cardDefinition.defaultSize.h
      }
      
      const newLayout = [...dashboardLayout.value, newLayoutItem]
      
      // Asegurar que la card tenga configuración por defecto
      if (!cardsConfig.value[cardId]) {
        await updateCardConfig(cardId, defaultCardsConfig[cardId] || {})
      }
      
      await updateDashboardLayout(newLayout)
      console.log(`✅ Card ${cardId} añadida al dashboard`)
      return true
    } catch (error) {
      console.error(`❌ Error al añadir card ${cardId}:`, error)
      throw error
    }
  }
  
  const removeCard = async (cardId) => {
    try {
      const newLayout = dashboardLayout.value.filter(item => item.i !== cardId)
      await updateDashboardLayout(newLayout)
      console.log(`✅ Card ${cardId} eliminada del dashboard`)
      return true
    } catch (error) {
      console.error(`❌ Error al eliminar card ${cardId}:`, error)
      throw error
    }
  }
  
  const resetDashboard = async () => {
    try {
      const resetConfig = {
        layout: defaultLayout,
        cardsConfig: defaultCardsConfig,
        lastModified: new Date().toISOString()
      }
      
      // Usar el método del store para actualizar el perfil
      await authStore.updateDashboardConfig({
        dashboard: resetConfig
      })
      
      console.log('✅ Dashboard restablecido a configuración por defecto')
      return true
    } catch (error) {
      console.error('❌ Error al restablecer dashboard:', error)
      throw error
    }
  }
  
  // Métodos de utilidad
  const findOptimalPosition = (cardSize) => {
    const existingItems = dashboardLayout.value
    const colNum = 12
    const { w, h } = cardSize
    
    // Buscar posición libre empezando desde arriba a la izquierda
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x <= colNum - w; x++) {
        const isOccupied = existingItems.some(item => 
          x < item.x + item.w && 
          x + w > item.x && 
          y < item.y + item.h && 
          y + h > item.y
        )
        
        if (!isOccupied) {
          return { x, y, w, h }
        }
      }
    }
    
    // Si no encuentra posición libre, colocar al final
    const maxY = Math.max(...existingItems.map(item => item.y + item.h), 0)
    return { x: 0, y: maxY, w, h }
  }
  
  const validateLayout = (layout) => {
    // Validar que no hay overlaps
    for (let i = 0; i < layout.length; i++) {
      for (let j = i + 1; j < layout.length; j++) {
        const item1 = layout[i]
        const item2 = layout[j]
        
        const overlap = !(
          item1.x + item1.w <= item2.x ||
          item2.x + item2.w <= item1.x ||
          item1.y + item1.h <= item2.y ||
          item2.y + item2.h <= item1.y
        )
        
        if (overlap) {
          console.warn(`Overlap detectado entre ${item1.i} y ${item2.i}`)
          return false
        }
      }
    }
    return true
  }
  
  const compactLayout = (layout) => {
    // Algoritmo simple para compactar el layout verticalmente
    const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x)
    const compacted = []
    
    sorted.forEach(item => {
      let newY = 0
      
      // Encontrar la posición Y más baja posible
      for (const existing of compacted) {
        if (!(item.x + item.w <= existing.x || existing.x + existing.w <= item.x)) {
          newY = Math.max(newY, existing.y + existing.h)
        }
      }
      
      compacted.push({
        ...item,
        y: newY
      })
    })
    
    return compacted
  }
  
  // Métodos de modo configuración
  const toggleConfigMode = () => {
    isConfigMode.value = !isConfigMode.value
    console.log(`Modo configuración: ${isConfigMode.value ? 'ACTIVADO' : 'DESACTIVADO'}`)
    return isConfigMode.value
  }
  
  const enterConfigMode = () => {
    isConfigMode.value = true
    console.log('Entrando en modo configuración')
  }
  
  const exitConfigMode = async (saveChanges = true) => {
    isConfigMode.value = false
    console.log('Saliendo del modo configuración')
    
    if (saveChanges) {
      // Aquí podrías implementar guardado automático si hay cambios pendientes
      console.log('Guardando cambios pendientes...')
    }
  }
  
  // Métodos de auto-guardado
  const scheduleAutoSave = (layout, delay = 2000) => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
    
    autoSaveTimer.value = setTimeout(async () => {
      try {
        await updateDashboardLayout(layout)
        console.log('✅ Auto-guardado completado')
      } catch (error) {
        console.error('❌ Error en auto-guardado:', error)
      }
    }, delay)
  }
  
  // Métodos de exportación e importación
  const exportDashboardConfig = () => {
    const config = {
      version: '1.0',
      exported: new Date().toISOString(),
      dashboard: dashboardConfig.value
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { 
      type: 'application/json' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ Configuración exportada')
  }
  
  const importDashboardConfig = async (configFile) => {
    try {
      const config = JSON.parse(await configFile.text())
      
      if (!config.dashboard) {
        throw new Error('Formato de archivo inválido')
      }
      
      // Usar el método del store para actualizar el perfil
      await authStore.updateDashboardConfig({
        dashboard: config.dashboard
      })
      
      console.log('✅ Configuración importada correctamente')
      return true
    } catch (error) {
      console.error('❌ Error al importar configuración:', error)
      throw error
    }
  }
  
  // Métodos de datos de cards
  const getCardData = (cardId) => {
    // Este método sería implementado para obtener datos específicos de cada card
    // Por ahora retorna datos de ejemplo
    const mockData = {
      'stats-dashboard': {
        casosActivos: 145,
        audienciasProximas: 12,
        casosUrgentes: 8,
        totalClientes: 89,
        lastUpdated: new Date().toISOString()
      },
      'recent-searches': [
        { id: 1, expediente: 'EXP-2024-001', cliente: 'Juan Pérez', deuda: '€2,500' },
        { id: 2, expediente: 'EXP-2024-002', cliente: 'María García', deuda: '€1,800' },
        { id: 3, expediente: 'EXP-2024-003', cliente: 'Carlos López', deuda: '€3,200' }
      ],
      'notifications': [
        { id: 1, type: 'audiencia', message: 'Audiencia programada para mañana', time: '2 min' },
        { id: 2, type: 'documento', message: 'Documento subido por el cliente', time: '15 min' },
        { id: 3, type: 'recordatorio', message: 'Recordatorio: Revisar expediente', time: '1 hora' }
      ],
      'chat': {
        unreadCount: 3,
        lastMessage: 'Nuevo mensaje de María García',
        onlineUsers: 5,
        lastActivity: new Date().toISOString()
      }
    }
    
    return mockData[cardId] || {}
  }
  
  // Watchers para auto-guardado
  watch(dashboardLayout, (newLayout) => {
    if (newLayout && validateLayout(newLayout)) {
      scheduleAutoSave(newLayout)
    }
  }, { deep: true })
  
  // Cleanup
  const cleanup = () => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
  }
  
  // Retornar API pública
  return {
    // Estado
    isConfigMode,
    isDragging,
    isResizing,
    currentBreakpoint,
    
    // Datos
    dashboardConfig,
    dashboardLayout,
    cardsConfig,
    availableCards,
    
    // Métodos de gestión del layout
    updateDashboardLayout,
    updateCardConfig,
    addCard,
    removeCard,
    resetDashboard,
    
    // Métodos de configuración
    toggleConfigMode,
    enterConfigMode,
    exitConfigMode,
    
    // Métodos de utilidad
    findOptimalPosition,
    validateLayout,
    compactLayout,
    scheduleAutoSave,
    
    // Métodos de importación/exportación
    exportDashboardConfig,
    importDashboardConfig,
    
    // Métodos de datos
    getCardData,
    
    // Cleanup
    cleanup
  }
}