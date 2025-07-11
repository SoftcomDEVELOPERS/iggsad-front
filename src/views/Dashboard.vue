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
      <div class="flex gap-6">
        <div class="flex-1">
          <SearchBar
            v-model="searchQuery"
            placeholder="Buscar expedientes por número, cliente, tipo..."
            :show-validation="true"
            validation-message="Ingrese un número de expediente"
            @search="performSearchAndRedirect"
            @clear="clearSearch"
          />
        </div>
        <div class="flex gap-3">
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

    <!-- USAR SOLO EL FILTERSDRAWER COMPONENT -->
    <FiltersDrawer
      v-model:visible="showFilters"
      title="Filtros de Búsqueda de Expedientes"
      :persistent-filters="persistentFilters"
      :persistent-expediente-search="persistentExpedienteSearch"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
      @filter-change="handleFilterChange"
      @search-expediente="handleExpedienteSearchAndRedirect"
      @toggle-fullscreen="handleToggleFullscreen"
    >
      <template #default="{ persistentFilters, persistentExpedienteSearch }">
        <FilterPanel
          :persistent-filters="persistentFilters"
          :persistent-expediente-search="persistentExpedienteSearch"
          @apply-filters="handleApplyFilters"
          @clear-filters="handleClearFilters"
          @filter-change="handleFilterChange"
          @search-expediente="handleExpedienteSearchAndRedirect"
          @toggle-fullscreen="handleToggleFullscreen"
        />
      </template>
    </FiltersDrawer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Dock from '@/components/Dock.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import FiltersDrawer from '@/components/filters/FiltersDrawer.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'
import { useUserProfile } from '@/composables/useUserProfile'

// Componente del grid intuitivo
import DashboardGrid from '@/components/dashboard/DashboardGrid.vue'
import { useUserDashboard } from '@/composables/useUserDashboard'
import { useAuthStore } from '@/stores/auth'

// 🎯 USAR SOLO EL COMPOSABLE FILTERSDRAWER - SIN DUPLICACIONES
import { useFiltersDrawer } from '@/composables/useFiltersDrawer'

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
const expedientesStore = useExpedientesStore()

// 🎯 USAR SOLO EL COMPOSABLE FILTERSDRAWER CON REDIRECCIÓN
const {
  // Estado del drawer
  showFilters,
  persistentFilters,
  persistentExpedienteSearch,
  
  // Computed
  totalActiveFilters,
  
  // Métodos del drawer
  toggleFilters,
  
  // Métodos de filtros
  handleApplyFilters,
  handleClearFilters,
  handleFilterChange,
  handleExpedienteSearch,
  handleToggleFullscreen
} = useFiltersDrawer({
  enableRedirection: true,
  redirectCallback: async (filterData, expedienteQuery) => {
    // Callback personalizado para Dashboard con redirección
    console.log('🔍 Redirección desde FilterPanel:', { filterData, expedienteQuery })
    
    try {
      // 🔄 COMPORTAMIENTO ESPECÍFICO DEL DASHBOARD:
      // 1. Hacer búsqueda
      await expedientesStore.searchExpedientes(filterData, expedienteQuery)
      
      // 2. Añadir a historial de búsquedas recientes
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
        ...filterData
      }
      
      // 3. 🚀 REDIRIGIR a la vista de Expedientes
      router.push({
        name: 'Expedientes',
        query: queryParams
      })
      
      showSuccess('Búsqueda completada', 'Mostrando resultados en la vista de expedientes')
      
    } catch (error) {
      console.error('❌ Error en redirección desde FilterPanel:', error)
      showError('Error en la búsqueda', 'No se pudieron cargar los expedientes')
    }
  }
})

// Estado local ESPECÍFICO del Dashboard (NO duplicar filtros)
const searchQuery = ref('')
const searchResults = ref([])
const lastAccess = ref('14 Jun 2025, 09:30')

// Mensaje global del sistema
const globalMessage = ref('Estamos a 23. Has recuperado 0,00 €. Muy lejos del objetivo de 0,00 €. Estás dando pérdidas.')

// Datos del dashboard
const stats = ref({
  totalCases: 147,
  upcomingHearings: 12,
  urgentCases: 5,
  totalClients: 89
})

// Items del Dock
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

// Datos dinámicos de las cards
const currentCardsData = computed(() => {
  const data = {}
  currentDashboardLayout.value.forEach(item => {
    data[item.i] = getCardData(item.i)
  })
  return data
})

// Computed para validar si se puede buscar
const canPerformSearch = computed(() => {
  const hasExpediente = (searchQuery.value && searchQuery.value.trim()) || 
                       (persistentExpedienteSearch.value && persistentExpedienteSearch.value.trim())
  return hasExpediente
})

// Métodos del grid
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

// Método para mostrar mensaje de validación
const showSearchValidation = () => {
  console.warn('⚠️ Debe ingresar un número de expediente para realizar la búsqueda')
  showWarn(
    'Búsqueda requerida',
    'Debe ingresar un número de expediente para realizar la búsqueda'
  )
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
    
    // Sincronizar con el composable
    persistentExpedienteSearch.value = expedienteQuery.trim()
    
    // Realizar búsqueda
    await expedientesStore.searchExpedientes(persistentFilters.value, expedienteQuery.trim())
    
    // Añadir a búsquedas recientes
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

const clearSearch = () => {
  searchQuery.value = ''
  persistentExpedienteSearch.value = ''
  searchResults.value = []
  expedientesStore.clearResults()
  console.log('🧹 Búsqueda limpiada')
}

// Método personalizado para búsqueda con redirección desde FilterPanel
const handleExpedienteSearchAndRedirect = async (expediente) => {
  console.log('🔍 Búsqueda desde FilterPanel CON redirección:', expediente)
  
  if (!expediente || !expediente.trim()) {
    showWarn('Búsqueda vacía', 'Por favor ingrese un número de expediente')
    return
  }
  
  // Usar el callback de redirección configurado en el composable
  await handleExpedienteSearch(expediente)
}

// Métodos del Dock
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
.config-mode-banner {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  color: #1e3a8a;
  font-size: 0.875rem;
}

.config-mode-active {
  position: relative;
}

.search-button {
  transition: all 0.2s ease;
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dashboard-grid-section {
  transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .banner-text {
    text-align: center;
  }
}
</style>