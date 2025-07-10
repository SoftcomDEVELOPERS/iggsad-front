<template>
  <div class="min-h-screen p-6">
    <!-- Header de bienvenida -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">
            Bienvenido, {{ `${authStore.user?.firstName} ${authStore.user?.lastName}` || 'Usuario' }}
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
            @click="performSearchAndRedirect"
            :loading="expedientesStore.isLoading"
            :disabled="!canPerformSearch"
            :severity="canPerformSearch ? undefined : 'secondary'"
            class="search-button"
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
      header="Filtros de Búsqueda"
      position="right" 
      class="filters-drawer" 
      :style="{ width: drawerWidth }"
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
        @search-expediente="handleExpedienteSearchAndRedirect"
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
import { useUserProfile } from '@/composables/useUserProfile'


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

const { addRecentSearch } = useUserProfile()

const drawerWidth = computed(() => drawerFullScreen.value ? '100vw' : '50rem')
// Estado reactivo ORIGINAL
const searchQuery = ref('')
const showFilters = ref(false)
const searchResults = ref([])
const lastAccess = ref('14 Jun 2025, 09:30')
const showExpedientesDrawer = ref(false)

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

// const addToRecentSearches = (query) => {
//   const newSearch = {
//     id: Date.now(),
//     expediente: query.includes('EXP-') ? query : `EXP-2024-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
//     cliente: query.includes('EXP-') ? 'Cliente Ejemplo' : query,
//     deuda: `€${(Math.random() * 100000).toFixed(0)}`
//   }
  
//   const exists = recentSearches.value.find(s => s.expediente === newSearch.expediente)
//   if (!exists) {
//     recentSearches.value.unshift(newSearch)
//     if (recentSearches.value.length > 5) {
//       recentSearches.value = recentSearches.value.slice(0, 5)
//     }
//   }
// }

const addToRecentSearches = async (query) => {
  const searchData = {
    id: Date.now(),
    expediente: query.includes('EXP-') ? query : `EXP-2024-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    cliente: query.includes('EXP-') ? 
      expedientesStore.expedientes[0]?.nombreTitular || 'Cliente no encontrado' : 
      `Cliente para ${query}`,
    deuda: expedientesStore.expedientes[0]?.principal ? 
      `€${expedientesStore.expedientes[0].principal}` : 
      `€${(Math.random() * 50000 + 1000).toFixed(2)}`,
    timestamp: new Date().toISOString()
  }
  
  // Usar useUserProfile para persistir
  await addRecentSearch(searchData)
  
  console.log('📝 Búsqueda añadida al historial:', searchData)
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
    // Abrimos el Drawer de resultados
    showExpedientesDrawer.value = true

    console.log('📂 Drawer de expedientes abierto con resultados ->', expedientesStore.expedientes)
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.nombreTitular,               // ← antes 'exp.cliente'
      lastUpdate: 'Hace 2h',
      priority: exp.embargos === 'Sí' ? 'high' : 'normal',    // ejemplo de prioridad
      status: exp.embargos === 'Sí' ? 'embargado' : 'normal',
      statusText: exp.embargos
    }))
    
    addToRecentSearches(expedienteQuery.trim())
    
    console.log('✅ Búsqueda desde Dashboard completada:', searchResults.value.length)
    
  } catch (error) {
    console.error('❌ Error en búsqueda desde Dashboard:', error)
    searchResults.value = []
  }
}

const performSearchAndRedirect = async () => {
  const expedienteQuery = searchQuery.value || persistentExpedienteSearch.value
  
  if (!expedienteQuery || !expedienteQuery.trim()) {
    console.warn('⚠️ No se puede buscar sin número de expediente')
    showSearchValidation()
    return
  }
  
  try {
    console.log('🔍 Búsqueda CON redirección desde Dashboard:', expedienteQuery.trim())
    
    // Actualizar estado persistente
    if (persistentExpedienteSearch.value !== expedienteQuery.trim()) {
      persistentExpedienteSearch.value = expedienteQuery.trim()
    }
    
    // Realizar búsqueda
    await expedientesStore.searchExpedientes(persistentFilters.value, expedienteQuery.trim())
    
    // Añadir a búsquedas recientes usando useUserProfile
    await addRecentSearch({
      id: Date.now(),
      expediente: expedienteQuery.trim(),
      cliente: expedientesStore.expedientes[0]?.nombreTitular || 'Cliente no encontrado',
      deuda: expedientesStore.expedientes[0]?.principal ? `€${expedientesStore.expedientes[0].principal}` : '€0',
      timestamp: new Date().toISOString()
    })
    
    // Preparar parámetros para la URL
    const queryParams = {
      search: expedienteQuery.trim(),
      ...persistentFilters.value
    }
    
    // Redirigir a ExpedientesView
    router.push({
      name: 'Expedientes',
      query: queryParams
    })
    
    showSuccess('Redirigiendo...', 'Mostrando resultados en la vista de expedientes')
    
    console.log('✅ Búsqueda y redirección completada')
    
  } catch (error) {
    console.error('❌ Error en búsqueda desde Dashboard:', error)
    showError('Error en la búsqueda', 'No se pudieron cargar los expedientes')
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
  // 2) Cerrar panel de filtros y abrir drawer de expedientes
  showFilters.value = false
  showExpedientesDrawer.value = true
  
  // Si tenemos resultados en el store, sincronizarlos
  if (expedientesStore.hasExpedientes) {
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.nombreTitular,               // ← antes 'exp.cliente'
      lastUpdate: 'Hace 2h',
      priority: exp.embargos === 'Sí' ? 'high' : 'normal',    // ejemplo de prioridad
      status: exp.embargos === 'Sí' ? 'embargado' : 'normal',
      statusText: exp.embargos
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

// const handleExpedienteSearch = async (expediente) => {
//   console.log('🔍 Búsqueda desde FilterPanel:', expediente)
  
//   // Solo actualizar sin disparar watchers
//   persistentExpedienteSearch.value = expediente || ''
  
//   // Sincronizar searchQuery directamente
//   if (expediente !== searchQuery.value) {
//     searchQuery.value = expediente || ''
//   }
  
//   // Los resultados ya están en el store desde FilterPanel
//   if (expedientesStore.hasExpedientes) {
//     searchResults.value = expedientesStore.expedientes.map(exp => ({
//       id: exp.id,
//       number: exp.numero,
//       client: exp.nombreTitular,               // ← antes 'exp.cliente'
//       lastUpdate: 'Hace 2h',
//       priority: exp.embargos === 'Sí' ? 'high' : 'normal',    // ejemplo de prioridad
//       status: exp.embargos === 'Sí' ? 'embargado' : 'normal',
//       statusText: exp.embargos
//     }))
    
//     if (expediente) {
//       addToRecentSearches(expediente)
//     }
//   }
// }

const handleExpedienteSearchAndRedirect = async (expediente) => {
  console.log('🔍 Búsqueda desde FilterPanel CON redirección:', expediente)
  
  if (!expediente || !expediente.trim()) {
    showWarn('Búsqueda vacía', 'Por favor ingrese un número de expediente')
    return
  }
  
  try {
    // Sincronizar estados
    persistentExpedienteSearch.value = expediente.trim()
    searchQuery.value = expediente.trim()
    
    // Realizar búsqueda
    await expedientesStore.searchExpedientes(persistentFilters.value, expediente.trim())
    
    // Añadir a búsquedas recientes usando useUserProfile
    await addRecentSearch({
      id: Date.now(),
      expediente: expediente.trim(),
      cliente: expedientesStore.expedientes[0]?.nombreTitular || 'Cliente no encontrado',
      deuda: expedientesStore.expedientes[0]?.principal ? `€${expedientesStore.expedientes[0].principal}` : '€0',
      timestamp: new Date().toISOString()
    })
    
    // Preparar parámetros para la URL
    const queryParams = {
      search: expediente.trim(),
      ...persistentFilters.value
    }
    
    // Redirigir a ExpedientesView
    router.push({
      name: 'Expedientes',
      query: queryParams
    })
    
    showSuccess('Búsqueda completada', 'Mostrando resultados en la vista de expedientes')
    
    console.log('✅ Búsqueda desde FilterPanel y redirección completada')
    
  } catch (error) {
    console.error('❌ Error en búsqueda desde FilterPanel:', error)
    showError('Error en la búsqueda', 'No se pudieron cargar los expedientes')
  }
}

// Método para alternar pantalla completa del drawer ORIGINAL
const toggleDrawerFullscreen = () => {
  drawerFullscreen.value = !drawerFullscreen.value
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
:deep(.filters-drawer) {
  .p-drawer-header {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-bottom: 2px solid var(--iggsad-surface-200);
    padding: var(--iggsad-spacing-lg);
  }

  .p-drawer-content {
    padding: 0;
  }
}
</style>