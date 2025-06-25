<!-- src/views/Dashboard.vue - COMPLETO CON GRID SYSTEM -->
<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header de bienvenida -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">
            Sistema de Gestión Procesal
          </h1>
          <p class="text-slate-600">
            Dashboard principal - {{ new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm text-slate-500">Último acceso</p>
            <p class="text-slate-700 font-medium">{{ lastAccess }}</p>
          </div>
          <div class="flex gap-2">
            <Button 
              icon="pi pi-sliders-h"
              label="Configuración Avanzada"
              outlined
              size="small"
              @click="showConfigPanel = true"
            />
            <Button 
              :icon="isConfigMode ? 'pi pi-check' : 'pi pi-cog'"
              :label="isConfigMode ? 'Guardar' : 'Personalizar'"
              :severity="isConfigMode ? 'success' : 'secondary'"
              @click="toggleConfigMode"
              size="small"
            />
          </div>
        </div>
      </div>
      
      <!-- Mensaje de estado global -->
      <div v-if="globalMessage" class="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
        <p class="text-green-800 text-sm font-medium">{{ globalMessage }}</p>
      </div>
    </div>

    <!-- Barra de búsqueda principal -->
    <div class="mb-8" :class="{ 'opacity-50': isConfigMode }">
      <div class="flex gap-3">
        <div class="flex-1">
          <SearchBar
            v-model="searchQuery"
            placeholder="Buscar expedientes por número, cliente, tipo..."
            :show-validation="true"
            validation-message="Ingrese un número de expediente"
            @search="performSearch"
            @clear="clearSearchFromBothSources"
            :disabled="isConfigMode"
          />
        </div>
        <Button 
          icon="pi pi-filter" 
          label="Filtros"
          @click="toggleFilters"
          :badge="totalActiveFilters > 0 ? totalActiveFilters.toString() : null"
          :severity="totalActiveFilters > 0 ? 'primary' : undefined"
          :outlined="totalActiveFilters === 0"
          :disabled="isConfigMode"
        />
        <Button 
          icon="pi pi-search" 
          label="Buscar"
          @click="performSearch"
          :disabled="!canPerformSearch || isConfigMode"
          :severity="canPerformSearch ? undefined : 'secondary'"
        />
      </div>
    </div>

    <!-- NUEVO: Dashboard Grid Layout -->
    <DashboardGrid 
      :layout="dashboardLayout"
      :cards-config="cardsConfig"
      :cards-data="cardsData"
      :config-mode="isConfigMode"
      @layout-updated="handleLayoutUpdate"
      @card-removed="handleCardRemoved"
      @card-configured="handleCardConfigured"
      @card-config-updated="handleCardConfigUpdated"
      @show-card-library="showConfigPanel = true"
      @breakpoint-changed="handleBreakpointChanged"
    />

    <!-- Panel de configuración avanzada -->
    <DashboardConfigPanel
      v-model:visible="showConfigPanel"
      :dashboard-layout="dashboardLayout"
      :cards-config="cardsConfig"
      :available-cards="availableCards"
      @save="handleConfigSave"
      @cancel="handleConfigCancel"
      @layout-updated="handleLayoutUpdate"
      @card-added="handleCardAdded"
      @card-removed="handleCardRemoved"
      @reset-config="handleResetConfig"
    />

    <!-- Componente Dock personalizado -->
    <Dock 
      :items="dockItems"
      @item-click="handleDockClick"
      @dock-hidden="onDockHidden"
      @dock-shown="onDockShown"
      hide-tooltip="Ocultar panel de navegación"
      show-tooltip="Mostrar panel de navegación"
      :auto-hide="false"
    />

    <!-- Drawer de filtros avanzado con tamaño dinámico -->
    <Drawer 
      v-model:visible="showFilters" 
      position="bottom" 
      :modal="!drawerFullscreen"
      :dismissable-mask="!drawerFullscreen"
      class="filter-drawer"
      :style="drawerFullscreen ? 'height: 100vh; width: 100vw;' : 'height: 75vh;'"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-semibold text-slate-800">Filtros de Búsqueda de Expedientes</h2>
          <div class="flex gap-2">
            <Button 
              :icon="drawerFullscreen ? 'pi pi-compress' : 'pi pi-expand'"
              :label="drawerFullscreen ? 'Ventana' : 'Pantalla Completa'"
              outlined 
              size="small"
              class="text-xs"
              @click="toggleDrawerFullscreen"
            />
          </div>
        </div>
      </template>

      <FilterPanel 
        :persistent-filters="persistentFilters"
        :persistent-expediente-search="persistentExpedienteSearch"
        @apply-filters="handleApplyFilters"
        @clear-filters="handleClearFilters"
        @filter-change="handleFilterChange"
        @search-expediente="handleExpedienteSearch"
        @toggle-fullscreen="handleToggleFullscreen"
      />
    </Drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Dock from '@/components/Dock.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import SearchBar from '@/components/SearchBar.vue'
import DashboardGrid from '@/components/dashboard/DashboardGrid.vue'
import DashboardConfigPanel from '@/components/dashboard/config/DashboardConfigPanel.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showWarn, showError, showSuccess } = useToast()

// ===== ESTADO ORIGINAL (SIN CAMBIOS) =====
const searchQuery = ref('')
const showFilters = ref(false)
const searchResults = ref([])
const lastAccess = ref('14 Jun 2025, 09:30')
const persistentFilters = ref({})
const persistentExpedienteSearch = ref('')
const drawerFullscreen = ref(false)

const expedientesStore = useExpedientesStore()

// Mensaje global del sistema
const globalMessage = ref('Estamos a 23. Has recuperado 0,00 €. Muy lejos del objetivo de 0,00 €. Estás dando pérdidas.')

// ===== NUEVO: ESTADO DEL GRID SYSTEM =====
const isConfigMode = ref(false)
const showConfigPanel = ref(false)

// Layout del dashboard (se guardará en userProfile)
const dashboardLayout = ref([
  { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
  { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
  { i: 'notifications', x: 8, y: 0, w: 4, h: 6 },
  { i: 'chat', x: 8, y: 6, w: 4, h: 4 },
  { i: 'quick-actions', x: 8, y: 10, w: 4, h: 3 }
])

// Configuración de las cards
const cardsConfig = ref({
  'stats-dashboard': {
    title: 'Estadísticas',
    selectedStats: ['casos-activos', 'audiencias-proximas', 'casos-urgentes', 'total-clientes'],
    gridLayout: 'auto'
  },
  'recent-searches': {
    title: 'Búsquedas Recientes',
    maxItems: 5,
    showActions: true
  },
  'notifications': {
    title: 'Notificaciones',
    maxItems: 10,
    showMarkAllRead: true
  },
  'chat': {
    title: 'Chat',
    maxMessages: 5,
    showOpenChat: true
  },
  'quick-actions': {
    title: 'Acciones Rápidas',
    layout: 'vertical'
  }
})

// Cards disponibles para añadir
const availableCards = ref([
  { id: 'stats-dashboard', title: 'Estadísticas', icon: 'pi pi-chart-bar', type: 'stats' },
  { id: 'recent-searches', title: 'Búsquedas Recientes', icon: 'pi pi-search', type: 'content' },
  { id: 'notifications', title: 'Notificaciones', icon: 'pi pi-bell', type: 'sidebar' },
  { id: 'chat', title: 'Chat', icon: 'pi pi-comments', type: 'sidebar' },
  { id: 'quick-actions', title: 'Acciones Rápidas', icon: 'pi pi-bolt', type: 'sidebar' }
])

// Datos para las cards (conectar con tus stores reales)
const cardsData = computed(() => ({
  'stats-dashboard': {
    // Los datos vienen del StatsDashboard internamente
  },
  'recent-searches': {
    searches: [
      { 
        id: 1, 
        expediente: 'EXP-2024-001', 
        cliente: 'García López, María',
        deuda: '€25,450',
        fecha: 'Hace 2h'
      },
      { 
        id: 2, 
        expediente: 'EXP-2024-045', 
        cliente: 'Empresas del Norte S.L.',
        deuda: '€87,230',
        fecha: 'Hace 4h'
      },
      { 
        id: 3, 
        expediente: 'EXP-2024-023', 
        cliente: 'Martín Rodríguez, Juan',
        deuda: '€12,800',
        fecha: 'Ayer'
      }
    ]
  },
  'notifications': {
    notifications: [
      { id: 1, title: 'Audiencia mañana', message: 'EXP-2024-001 a las 10:00', time: 'Hace 1h', read: false },
      { id: 2, title: 'Documento subido', message: 'Nuevo archivo en EXP-2024-045', time: 'Hace 2h', read: false },
      { id: 3, title: 'Plazo próximo', message: 'Alegaciones EXP-2024-023', time: 'Ayer', read: true }
    ],
    unreadCount: 2
  },
  'chat': {
    messages: [
      { id: 1, sender: 'María García', preview: '¿Podemos revisar el contrato mañana?', time: 'Hace 30 min', unread: true },
      { id: 2, sender: 'Juan Martín', preview: 'Adjunto documentación solicitada', time: 'Hace 1h', unread: true }
    ],
    unreadCount: 2
  },
  'quick-actions': {
    actions: [
      { id: 'nuevo-caso', label: 'Nuevo Caso', icon: 'pi pi-plus' },
      { id: 'subir-doc', label: 'Subir Documento', icon: 'pi pi-upload' },
      { id: 'nuevo-cliente', label: 'Nuevo Cliente', icon: 'pi pi-user-plus' }
    ]
  }
}))

// Items del Dock (SIN CAMBIOS)
const dockItems = ref([
  {
    id: 'casos',
    label: 'Casos',
    icon: 'pi pi-folder',
    active: false,
    command: () => router.push('/casos')
  },
  {
    id: 'audiencias',
    label: 'Audiencias',
    icon: 'pi pi-calendar',
    badge: '12',
    command: () => router.push('/audiencias')
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: 'pi pi-users',
    command: () => router.push('/clientes')
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: 'pi pi-file',
    command: () => router.push('/documentos')
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => router.push('/perfil')
  }
])

// ===== COMPUTED ORIGINALES (SIN CAMBIOS) =====
const totalActiveFilters = computed(() => {
  let count = 0
  Object.entries(persistentFilters.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        const validItems = value.filter(v => v !== null && v !== '' && v !== undefined)
        if (validItems.length > 0) count++
      } else {
        count++
      }
    }
  })
  return count
})

const canPerformSearch = computed(() => {
  const hasExpediente = (searchQuery.value && searchQuery.value.trim()) || 
                       (persistentExpedienteSearch.value && persistentExpedienteSearch.value.trim())
  return hasExpediente
})

// ===== MÉTODOS NUEVOS DEL GRID SYSTEM =====
const toggleConfigMode = () => {
  isConfigMode.value = !isConfigMode.value
  if (isConfigMode.value) {
    showSuccess('Modo Personalización', 'Ahora puedes arrastrar y redimensionar las tarjetas')
  } else {
    showSuccess('Cambios Guardados', 'La configuración se ha guardado correctamente')
  }
}

const handleLayoutUpdate = (newLayout) => {
  // Evitar bucles comparando contenido real
  const currentStr = JSON.stringify(dashboardLayout.value)
  const newStr = JSON.stringify(newLayout)
  
  if (currentStr !== newStr) {
    console.log('Layout actualizado con cambios reales:', newLayout.length, 'cards')
    dashboardLayout.value = [...newLayout]
    
    // 🎯 GUARDAR DIRECTAMENTE EN EL BACKEND
    saveDashboardConfig({
      layout: newLayout,
      cardsConfig: cardsConfig.value
    })
  }
}

const handleCardRemoved = (cardId) => {
  dashboardLayout.value = dashboardLayout.value.filter(item => item.i !== cardId)
  delete cardsConfig.value[cardId]
  showSuccess('Card eliminada', `La tarjeta ${cardId} ha sido eliminada`)
}

const handleCardConfigured = (cardId) => {
  console.log('Configurar card:', cardId)
  // Abrir panel específico de configuración de la card
}

const handleCardConfigUpdated = (cardId, newConfig) => {
  cardsConfig.value[cardId] = { ...cardsConfig.value[cardId], ...newConfig }
  console.log('Configuración de card actualizada:', cardId, newConfig)
}

const handleBreakpointChanged = ({ breakpoint, layout }) => {
  console.log('Breakpoint changed:', breakpoint)
  // Aquí podrías guardar layouts específicos por breakpoint
}

const handleCardAdded = (cardType) => {
  const newCardId = `${cardType}-${Date.now()}`
  const newItem = {
    i: newCardId,
    x: 0,
    y: 0,
    w: 4,
    h: 4
  }
  
  dashboardLayout.value.push(newItem)
  cardsConfig.value[newCardId] = { title: cardType }
  showSuccess('Card añadida', `Nueva tarjeta ${cardType} añadida al dashboard`)
}

const handleConfigSave = () => {
  showSuccess('Configuración guardada', 'Todos los cambios se han aplicado correctamente')
  showConfigPanel.value = false
}

const handleConfigCancel = () => {
  showConfigPanel.value = false
}

const handleResetConfig = () => {
  // Restablecer al layout por defecto
  dashboardLayout.value = [
    { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
    { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
    { i: 'notifications', x: 8, y: 0, w: 4, h: 6 },
    { i: 'chat', x: 8, y: 6, w: 4, h: 4 },
    { i: 'quick-actions', x: 8, y: 10, w: 4, h: 3 }
  ]
  showSuccess('Configuración restablecida', 'Se ha restaurado el layout por defecto')
}

// ===== MÉTODOS ORIGINALES (SIN CAMBIOS) =====
const toggleFilters = () => {
  showFilters.value = !showFilters.value
  if (showFilters.value) {
    drawerFullscreen.value = false
  }
}

const addToRecentSearches = (query) => {
  const newSearch = {
    id: Date.now(),
    expediente: query.includes('EXP-') ? query : `EXP-2024-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    cliente: query.includes('EXP-') ? 'Cliente Ejemplo' : query,
    deuda: `€${(Math.random() * 100000).toFixed(0)}`,
    fecha: 'Ahora'
  }
  
  // Actualizar datos de recent-searches
  const currentSearches = cardsData.value['recent-searches'].searches
  currentSearches.unshift(newSearch)
  if (currentSearches.length > 5) {
    currentSearches.splice(5)
  }
}

const showSearchValidation = () => {
  console.warn('⚠️ Debe ingresar un número de expediente para realizar la búsqueda')
  showWarn(
    'Búsqueda requerida',
    'Debe ingresar un número de expediente para realizar la búsqueda'
  )
}

const performSearch = async () => {
  const expedienteQuery = searchQuery.value || persistentExpedienteSearch.value
  
  if (!expedienteQuery || !expedienteQuery.trim()) {
    console.warn('⚠️ No se puede buscar sin número de expediente')
    showSearchValidation()
    return
  }
  
  try {
    console.log('🔍 Iniciando búsqueda desde Dashboard:', expedienteQuery.trim())
    
    if (persistentExpedienteSearch.value !== expedienteQuery.trim()) {
      persistentExpedienteSearch.value = expedienteQuery.trim()
    }
    
    await expedientesStore.searchExpedientes(persistentFilters.value, expedienteQuery.trim())
    
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(),
      statusText: exp.estado
    }))
    
    addToRecentSearches(expedienteQuery.trim())
    console.log('✅ Búsqueda desde Dashboard completada:', searchResults.value.length)
    
  } catch (error) {
    console.error('❌ Error en búsqueda desde Dashboard:', error)
    searchResults.value = []
  }
}

const clearSearchFromBothSources = () => {
  searchQuery.value = ''
  persistentExpedienteSearch.value = ''
  searchResults.value = []
  expedientesStore.clearResults()
  console.log('🧹 Búsqueda limpiada desde ambas fuentes')
}

const handleApplyFilters = async (filterData) => {
  console.log('📋 Aplicando filtros desde FilterPanel:', filterData)
  persistentFilters.value = { ...filterData }
  
  if (expedientesStore.hasExpedientes) {
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(),
      statusText: exp.estado
    }))
    console.log('🔄 Resultados sincronizados desde store:', searchResults.value.length)
  }
}

const handleClearFilters = () => {
  console.log('Limpiando todos los filtros')
  persistentFilters.value = {}
  persistentExpedienteSearch.value = ''
  clearSearchFromBothSources()
  console.log('✅ Filtros y búsquedas limpiados completamente')
}

const handleFilterChange = (filterData) => {
  console.log('Filtros cambiados:', filterData)
  persistentFilters.value = { ...filterData }
}

const handleExpedienteSearch = async (expediente) => {
  console.log('🔍 Búsqueda desde FilterPanel:', expediente)
  persistentExpedienteSearch.value = expediente || ''
  
  if (expediente !== searchQuery.value) {
    searchQuery.value = expediente || ''
  }
  
  if (expedientesStore.hasExpedientes) {
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(), 
      statusText: exp.estado
    }))
    
    if (expediente) {
      addToRecentSearches(expediente)
    }
  }
}

const toggleDrawerFullscreen = () => {
  drawerFullscreen.value = !drawerFullscreen.value
  console.log('Drawer fullscreen:', drawerFullscreen.value)
}

const handleToggleFullscreen = (isFullscreen) => {
  drawerFullscreen.value = isFullscreen
  console.log('Drawer fullscreen desde FilterPanel:', isFullscreen)
}

const handleDockClick = (item) => {
  console.log('Dock item clicked:', item)
  dockItems.value.forEach(dockItem => {
    dockItem.active = dockItem.id === item.id
  })
  if (item.command) {
    item.command()
  }
}

const onDockHidden = () => {
  console.log('Dock ocultado')
}

const onDockShown = () => {
  console.log('Dock mostrado')
}

onMounted(() => {
  console.log('Dashboard cargado con grid system')
  dockItems.value[0].active = true
})
</script>

<style scoped>
.filter-drawer :deep(.p-drawer-full .p-drawer) {
  height: 100vh !important;
  width: 100vw !important;
}

.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}
</style>