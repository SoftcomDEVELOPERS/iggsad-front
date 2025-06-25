<template>
  <div class="min-h-screen p-6">
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
        <div class="text-right">
          <p class="text-sm text-slate-500">Último acceso</p>
          <p class="text-slate-700 font-medium">{{ lastAccess }}</p>
        </div>
      </div>
      
      <!-- Mensaje de estado global -->
      <div v-if="globalMessage" class="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
        <p class="text-green-800 text-sm font-medium">{{ globalMessage }}</p>
      </div>
    </div>

    <!-- Barra de búsqueda principal -->
    <div class="">
      <div class="flex gap-6">  <!-- Cambiar gap-3 por gap-6 -->
        <div class="flex-1">
          <SearchBar
            v-model="searchQuery"
            placeholder="Buscar expedientes por número, cliente, tipo..."
            :show-validation="true"
            validation-message="Ingrese un número de expediente"
            @search="performSearch"
            @clear="clearSearchFromBothSources"
          />
        </div>
        <div class="flex gap-3">  <!-- Agrupar botones en su propio contenedor -->
          <Button 
            icon="pi pi-filter" 
            label="Filtros"
            @click="toggleFilters"
            :badge="totalActiveFilters > 0 ? totalActiveFilters.toString() : null"
            :severity="totalActiveFilters > 0 ? 'primary' : undefined"
            :outlined="totalActiveFilters === 0"
          />
          <Button 
            icon="pi pi-search" 
            label="Buscar"
            @click="performSearch"
            :disabled="!canPerformSearch"
            :severity="canPerformSearch ? undefined : 'secondary'"
          />
        </div>
      </div>
    </div>

    <!-- Grid Dashboard Intuitivo -->
    <div class="mb-8 mt-6">

      <!-- Grid Principal -->
      <div class="dashboard-grid-section" :class="{ 'config-mode-active': isConfigMode }">
        <!-- Banner de modo configuración -->
        <div v-if="isConfigMode" class="config-mode-banner">
          <div class="banner-content">
            <i class="pi pi-cog text-blue-600"></i>
            <div class="banner-text">
              <strong>Modo Configuración Activo</strong>
              <span>Arrastra las cards para moverlas, usa la esquina inferior derecha para redimensionar</span>
            </div>
            <Button
              icon="pi pi-times"
              text
              rounded
              @click="handleToggleConfigMode"
              title="Salir del modo configuración"
            />
          </div>
        </div>
        
        <DashboardGrid
          :layout="currentDashboardLayout"
          :cards-config="currentCardsConfig"
          :cards-data="currentCardsData"
          @layout-updated="handleLayoutUpdate"
          @card-removed="handleCardRemoved"
          @card-configured="handleCardConfigured"
          @config-mode-changed="handleConfigModeChanged"
          @card-config-updated="handleCardConfigUpdate"
        />
      </div>
    </div>

    <!-- Componente Dock personalizado ORIGINAL -->
    <Dock 
      :items="dockItems"
      @item-click="handleDockClick"
      @dock-hidden="onDockHidden"
      @dock-shown="onDockShown"
      hide-tooltip="Ocultar panel de navegación"
      show-tooltip="Mostrar panel de navegación"
      :auto-hide="false"
    />

    <!-- Drawer de filtros avanzado ORIGINAL -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Dock from '@/components/Dock.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'

//Componente del grid intuitivo
import DashboardGrid from '@/components/dashboard/DashboardGrid.vue'
import { useUserDashboard } from '@/composables/useUserDashboard'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { showWarn, showError, showSuccess } = useToast()

// Composables para el grid
const authStore = useAuthStore()
const { 
  dashboardConfig, 
  dashboardLayout,
  cardsConfig,
  updateDashboardLayout,
  removeCard,
  updateCardConfig,
  isConfigMode,
  toggleConfigMode,
  getCardData
} = useUserDashboard()

// Estado reactivo ORIGINAL
const searchQuery = ref('')
const showFilters = ref(false)
const searchResults = ref([])
const lastAccess = ref('14 Jun 2025, 09:30')

// Estado persistente de filtros ORIGINAL
const persistentFilters = ref({})
const persistentExpedienteSearch = ref('')
const drawerFullscreen = ref(false)

const expedientesStore = useExpedientesStore()

// Mensaje global del sistema ORIGINAL
const globalMessage = ref('Estamos a 23. Has recuperado 0,00 €. Muy lejos del objetivo de 0,00 €. Estás dando pérdidas.')

// Datos ORIGINALES
const stats = ref({
  totalCases: 147,
  upcomingHearings: 12,
  urgentCases: 5,
  totalClients: 89
})

const recentSearches = ref([
  { 
    id: 1, 
    expediente: 'EXP-2024-001', 
    cliente: 'García López, María',
    deuda: '€25,450'
  },
  { 
    id: 2, 
    expediente: 'EXP-2024-045', 
    cliente: 'Empresas del Norte S.L.',
    deuda: '€87,230'
  },
  { 
    id: 3, 
    expediente: 'EXP-2024-023', 
    cliente: 'Martín Rodríguez, Juan',
    deuda: '€12,800'
  }
])




// Items del Dock ORIGINALES
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
    badge: stats.value.upcomingHearings.toString(),
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

// Computed para el grid
const currentDashboardLayout = computed(() => dashboardLayout.value)
const currentCardsConfig = computed(() => cardsConfig.value)

// Datos dinámicos de las cards (obtenidos del composable)
const currentCardsData = computed(() => {
  const data = {}
  currentDashboardLayout.value.forEach(item => {
    data[item.i] = getCardData(item.i)
  })
  return data
})


// Calcular filtros activos desde el estado persistente ORIGINAL
const totalActiveFilters = computed(() => {
  let count = 0
  
  // NO contar la búsqueda por expediente como filtro
  // Solo contar filtros del objeto persistente (NO la búsqueda)
  Object.entries(persistentFilters.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        const validItems = value.filter(v => v !== null && v !== '' && v !== undefined)
        if (validItems.length > 0) {
          count++
        }
      } else {
        count++
      }
    }
  })
  
  return count
})

// Computed para validar si se puede buscar ORIGINAL
const canPerformSearch = computed(() => {
  const hasExpediente = (searchQuery.value && searchQuery.value.trim()) || 
                       (persistentExpedienteSearch.value && persistentExpedienteSearch.value.trim())
  return hasExpediente
})

// NUEVO: Métodos del grid
const handleLayoutUpdate = async (newLayout) => {
  try {
    await updateDashboardLayout(newLayout)
    showSuccess('Layout Guardado', 'La configuración del dashboard se ha guardado')
  } catch (error) {
    showError('Error de Guardado', 'No se pudo guardar la configuración del layout')
  }
}

const handleCardRemoved = async (cardId) => {
  try {
    await removeCard(cardId)
    showSuccess('Card Eliminada', 'La card ha sido eliminada del dashboard')
  } catch (error) {
    showError('Error', 'No se pudo eliminar la card')
  }
}

const handleCardConfigured = (cardId) => {
  console.log('Configurando card:', cardId)
  showSuccess('Configuración', `Configurando ${cardId}`)
}

const handleCardConfigUpdate = async (cardId, newConfig) => {
  try {
    await updateCardConfig(cardId, newConfig)
    showSuccess('Card Actualizada', `Configuración de ${cardId} guardada`)
  } catch (error) {
    showError('Error', 'No se pudo actualizar la configuración de la card')
  }
}

const handleConfigModeChanged = (configMode) => {
  if (configMode) {
    showSuccess('Modo Configuración', 'Arrastra las cards para reorganizarlas')
  } else {
    showSuccess('Configuración Guardada', 'Los cambios han sido guardados')
  }
}

const handleToggleConfigMode = () => {
  const newConfigMode = toggleConfigMode()
  if (newConfigMode) {
    showSuccess('Modo Configuración', 'Ahora puedes reorganizar las cards arrastrándolas')
  } else {
    showSuccess('Modo Normal', 'Dashboard guardado y bloqueado')
  }
}

// Métodos ORIGINALES (SIN CAMBIOS)
const toggleFilters = () => {
  showFilters.value = !showFilters.value
  
  // Siempre abrir en modo minimizado
  if (showFilters.value) {
    drawerFullscreen.value = false
  }
}

const addToRecentSearches = (query) => {
  const newSearch = {
    id: Date.now(),
    expediente: query.includes('EXP-') ? query : `EXP-2024-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    cliente: query.includes('EXP-') ? 'Cliente Ejemplo' : query,
    deuda: `€${(Math.random() * 100000).toFixed(0)}`
  }
  
  const exists = recentSearches.value.find(s => s.expediente === newSearch.expediente)
  if (!exists) {
    recentSearches.value.unshift(newSearch)
    if (recentSearches.value.length > 5) {
      recentSearches.value = recentSearches.value.slice(0, 5)
    }
  }
}

// Método para mostrar mensaje de validación ORIGINAL
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
    
    // NO actualizar persistentExpedienteSearch aquí si ya está igual
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

// Manejar filtros de forma persistente ORIGINAL
const handleApplyFilters = async (filterData) => {
  console.log('📋 Aplicando filtros desde FilterPanel:', filterData)
  
  // Guardar filtros persistentemente
  persistentFilters.value = { ...filterData }
  
  // No hacer búsqueda automática aquí, ya la hace el FilterPanel
  // Solo actualizar el estado local
  console.log('✅ Filtros guardados correctamente')
  
  // Si tenemos resultados en el store, sincronizarlos
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

// Metodos para gestión de filtros ORIGINALES
const handleClearFilters = () => {
  console.log('Limpiando todos los filtros')
  
  // Limpiar estado persistente
  persistentFilters.value = {}
  persistentExpedienteSearch.value = ''
  
  // Limpiar resultados y búsquedas
  clearSearchFromBothSources()
  
  console.log('✅ Filtros y búsquedas limpiados completamente')
}

const handleFilterChange = (filterData) => {
  console.log('Filtros cambiados:', filterData)
  
  // Actualizar filtros persistentes en tiempo real
  persistentFilters.value = { ...filterData }
}

const handleExpedienteSearch = async (expediente) => {
  console.log('🔍 Búsqueda desde FilterPanel:', expediente)
  
  // Solo actualizar sin disparar watchers
  persistentExpedienteSearch.value = expediente || ''
  
  // Sincronizar searchQuery directamente
  if (expediente !== searchQuery.value) {
    searchQuery.value = expediente || ''
  }
  
  // Los resultados ya están en el store desde FilterPanel
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

// Método para alternar pantalla completa del drawer ORIGINAL
const toggleDrawerFullscreen = () => {
  drawerFullscreen.value = !drawerFullscreen.value
  console.log('Drawer fullscreen:', drawerFullscreen.value)
}

// Mantener este método para recibir eventos del FilterPanel ORIGINAL
const handleToggleFullscreen = (isFullscreen) => {
  drawerFullscreen.value = isFullscreen
  console.log('Drawer fullscreen desde FilterPanel:', isFullscreen)
}

// Métodos del Dock ORIGINALES
const handleDockClick = (item) => {
  console.log('Dock item clicked:', item)
  
  // Actualizar estado activo
  dockItems.value.forEach(dockItem => {
    dockItem.active = dockItem.id === item.id
  })
  
  // Ejecutar comando si existe
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
  console.log('Dashboard cargado')
  // Marcar el item actual como activo (ejemplo: dashboard)
  dockItems.value[0].active = true
})
</script>

<style scoped>
.dashboard-grid-section {
  background: white;
  border-radius: 5px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dashboard-grid-section.config-mode-active {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* Banner de modo configuración */
.config-mode-banner {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  animation: slideDown 0.3s ease-out;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.banner-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.banner-text strong {
  color: #1e40af;
  font-weight: 600;
}

.banner-text span {
  color: #1e40af;
  font-size: 0.875rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ESTILOS ORIGINALES */
/* Clases para estilos básicos */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Drawer fullscreen usando las clases nativas de PrimeVue */
.filter-drawer :deep(.p-drawer-full .p-drawer) {
  height: 100vh !important;
  width: 100vw !important;
}
</style>