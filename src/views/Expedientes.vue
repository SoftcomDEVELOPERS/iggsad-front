<template>
  <div class="expedientes-view">
    
    <!-- Header de la página -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="pi pi-folder title-icon"></i>
            Gestión de Expedientes
          </h1>
          <p class="page-subtitle">
            Administra y consulta todos los expedientes del sistema
          </p>
        </div>
        
        <div class="header-actions">
          <Button
            icon="pi pi-plus"
            label="Nuevo Expediente"
            class="header-action-btn"
            @click="createNewExpediente"
          />
          <Button
            icon="pi pi-filter"
            :label="`Filtros ${totalActiveFilters > 0 ? `(${totalActiveFilters})` : ''}`"
            outlined
            :severity="totalActiveFilters > 0 ? 'success' : 'secondary'"
            class="header-action-btn"
            @click="toggleFilters"
          />
        </div>
      </div>
      
      <!-- Breadcrumb -->
      <Breadcrumb 
        :model="breadcrumbItems" 
        class="page-breadcrumb"
      />
    </div>

    <!-- Barra de búsqueda principal -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <SearchBar
            v-model="searchQuery"
            label="Búsqueda de Expedientes"
            placeholder="Buscar por número, cliente, referencia..."
            size="large"
            :show-validation="true"
            validation-message="Ingrese un criterio de búsqueda"
            @search="handleSearch"
            @clear="handleClearSearch"
            class="main-search"
          />
        </div>
        
        <div class="search-actions">
          <Button
            icon="pi pi-search"
            label="Buscar"
            :loading="expedientesStore.isLoading"
            @click="handleSearch"
            class="search-btn"
          />
          <Button
            icon="pi pi-times"
            label="Limpiar"
            outlined
            severity="secondary"
            @click="handleClearAll"
            class="clear-btn"
          />
        </div>
      </div>
      
      <!-- Filtros activos -->
      <div class="active-filters" v-if="activeFiltersDisplay.length > 0">
        <div class="filters-header">
          <span class="filters-label">Filtros aplicados:</span>
          <Button
            icon="pi pi-times"
            label="Limpiar todos"
            text
            size="small"
            severity="secondary"
            @click="clearAllFilters"
            class="clear-all-btn"
          />
        </div>
        
        <div class="filters-list">
          <Tag
            v-for="filter in activeFiltersDisplay"
            :key="filter.key"
            :value="filter.display"
            severity="info"
            class="filter-tag"
          >
            <template #value>
              <span class="filter-content">
                <strong>{{ filter.label }}:</strong> {{ filter.value }}
                <Button
                  icon="pi pi-times"
                  text
                  rounded
                  size="small"
                  class="filter-remove-btn"
                  @click="removeFilter(filter.key)"
                />
              </span>
            </template>
          </Tag>
        </div>
      </div>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="stats-section" v-if="expedientesStore.expedientes.length > 0">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="pi pi-folder"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ expedientesStore.pagination.total }}</span>
            <span class="stat-label">Total Expedientes</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon active">
            <i class="pi pi-check-circle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ activeExpedientesCount }}</span>
            <span class="stat-label">Activos</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon urgent">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ urgentExpedientesCount }}</span>
            <span class="stat-label">Urgentes</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon money">
            <i class="pi pi-euro"></i>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ formatCurrency(totalAmount) }}</span>
            <span class="stat-label">Importe Total</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla principal - REUTILIZANDO EL COMPONENTE EXISTENTE -->
    <div class="table-section">
      <ExpedientesTable
        :expedientes="expedientesStore.expedientes"
        :loading="expedientesStore.isLoading"
        :pagination="expedientesStore.pagination"
        @page="handlePageChange"
        @row-click="handleRowClick"
      />
    </div>

    <!-- Panel lateral de filtros - REUTILIZANDO FILTERPANEL -->
     <FiltersDrawer
    v-model:visible="showFilters"
    title="Filtros de Búsqueda de Expedientes"
    :persistent-filters="persistentFilters"
    :persistent-expediente-search="persistentExpedienteSearch"
    @apply-filters="handleApplyFilters"
    @clear-filters="handleClearFilters"
    @filter-change="handleFilterChange"
    @search-expediente="handleExpedienteSearch"
    @toggle-fullscreen="handleToggleFullscreen"
  >
    <template #default="{ persistentFilters, persistentExpedienteSearch }">
      <FilterPanel
        :persistent-filters="persistentFilters"
        :persistent-expediente-search="persistentExpedienteSearch"
        @apply-filters="handleApplyFilters"
        @clear-filters="handleClearFilters"
        @filter-change="handleFilterChange"
        @search-expediente="handleExpedienteSearch"
        @toggle-fullscreen="handleToggleFullscreen"
      />
    </template>
  </FiltersDrawer>
    <!-- <Drawer
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
              :icon="drawerFullScreen ? 'pi pi-compress' : 'pi pi-expand'"
              :label="drawerFullScreen ? 'Ventana' : 'Pantalla Completa'"
              outlined
              size="small"
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
    </Drawer> -->

    <!-- Dialog de detalles del expediente -->
    <Dialog
      v-model:visible="showExpedienteDetail"
      :header="`Expediente ${selectedExpediente?.numero}`"
      :modal="true"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      class="expediente-detail-dialog"
    >
      <div class="expediente-detail-content" v-if="selectedExpediente">
        <div class="detail-tabs">
          <TabView>
            <TabPanel header="Información General">
              <div class="detail-section">
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Número de Expediente:</label>
                    <span class="expediente-code">{{ selectedExpediente.numero }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Cartera:</label>
                    <span>{{ selectedExpediente.cartera }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Nombre Titular:</label>
                    <span>{{ selectedExpediente.nombreTitular }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Principal:</label>
                    <span class="money-amount">{{ formatCurrency(selectedExpediente.principal) }}</span>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel header="Fechas">
              <div class="detail-section">
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Fecha de Envío:</label>
                    <span>{{ formatDate(selectedExpediente.fechaEnvio) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Fecha de Presentación:</label>
                    <span>{{ formatDate(selectedExpediente.fechaPresentacion) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Fecha de Admisión:</label>
                    <span>{{ formatDate(selectedExpediente.fechaAdmision) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Última Gestión:</label>
                    <span>{{ formatDate(selectedExpediente.ultFechaGesExp) }}</span>
                  </div>
                </div>
              </div>
            </TabPanel>
            
            <TabPanel header="Importes">
              <div class="detail-section">
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Principal:</label>
                    <span class="money-amount">{{ formatCurrency(selectedExpediente.principal) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Intereses:</label>
                    <span class="money-amount">{{ formatCurrency(selectedExpediente.intereses) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Costas:</label>
                    <span class="money-amount">{{ formatCurrency(selectedExpediente.costas) }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Ingresos Judiciales:</label>
                    <span class="money-amount">{{ formatCurrency(selectedExpediente.ingJud) }}</span>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <Button
            label="Editar"
            icon="pi pi-pencil"
            @click="editExpediente"
          />
          <Button
            label="Cerrar"
            icon="pi pi-times"
            outlined
            @click="showExpedienteDetail = false"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import Breadcrumb from 'primevue/breadcrumb'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import SearchBar from '@/components/SearchBar.vue'
import ExpedientesTable from '@/components/expedientes/ExpedientesTable.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import FiltersDrawer from '@/components/filters/FiltersDrawer.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useFilterPanel } from '@/composables/useFilterPanel'
import { useFiltersDrawer } from '@/composables/useFiltersDrawer'
import { useToast } from '@/composables/useToast'

// Composables
const router = useRouter()
const route = useRoute()
const expedientesStore = useExpedientesStore()
const { showSuccess, showWarn, showError } = useToast()

// Estado local - SIMILAR AL DASHBOARD
const searchQuery = ref('')
const showFilters = ref(false)
const showExpedienteDetail = ref(false)
const selectedExpediente = ref(null)
const drawerFullScreen = ref(false)

// Estado persistente de filtros - IGUAL QUE EN DASHBOARD
const persistentFilters = ref({})
const persistentExpedienteSearch = ref('')

// Filtros usando el mismo composable
const {
  filters,
  activeFilters,
  getFilterLabel,
  getFilterValue,
  clearFilter: clearSingleFilter,
  clearAllFilters: clearAllFiltersLogic,
  applyFilters: applyFiltersLogic,
  normalizeFilters
} = useFilterPanel()

const {
  showFilters,
  persistentFilters,
  persistentExpedienteSearch,
  totalActiveFilters,
  activeFiltersDisplay,
  toggleFilters,
  handleApplyFilters,
  handleClearFilters,
  handleFilterChange,
  handleExpedienteSearch,
  handleToggleFullscreen,
  removeFilter,
  clearAllFilters,
  loadFiltersFromQuery
} = useFiltersDrawer({
  enableRedirection: false // Sin redirección en ExpedientesView
})

// Computed
const drawerWidth = computed(() => drawerFullScreen.value ? '100vw' : '50rem')

const breadcrumbItems = ref([
  { label: 'Inicio', route: '/dashboard' },
  { label: 'Expedientes', route: '/expedientes' }
])

const totalActiveFilters = computed(() => {
  let count = 0
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

const activeFiltersDisplay = computed(() => {
  const filters = []
  Object.entries(activeFilters.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      const label = getFilterLabel(key)
      const displayValue = getFilterValue(key, value)
      if (displayValue) {
        filters.push({
          key,
          label,
          value: displayValue,
          display: `${label}: ${displayValue}`
        })
      }
    }
  })
  return filters
})

// Estadísticas computadas
const activeExpedientesCount = computed(() => {
  return expedientesStore.expedientes.filter(exp => exp.embargos === 'No').length
})

const urgentExpedientesCount = computed(() => {
  return expedientesStore.expedientes.filter(exp => {
    const principal = parseFloat(exp.principal) || 0
    const daysSinceEnvio = exp.fechaEnvio ? 
      Math.floor((new Date() - new Date(exp.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
    return principal > 5000 || daysSinceEnvio > 90
  }).length
})

const totalAmount = computed(() => {
  return expedientesStore.expedientes.reduce((total, exp) => {
    return total + (parseFloat(exp.principal) || 0)
  }, 0)
})

// Métodos de formateo
const formatCurrency = (amount) => {
  if (!amount) return '€0,00'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Métodos de eventos - MISMA LÓGICA QUE DASHBOARD
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    showWarn('Búsqueda vacía', 'Por favor ingrese un criterio de búsqueda')
    return
  }
  
  try {
    console.log('🔍 Búsqueda desde ExpedientesView:', searchQuery.value.trim())
    
    // Sincronizar con persistentExpedienteSearch
    persistentExpedienteSearch.value = searchQuery.value.trim()
    
    // Usar el store para buscar
    await expedientesStore.searchExpedientes(persistentFilters.value, searchQuery.value.trim())
    
    showSuccess('Búsqueda completada', `Se encontraron ${expedientesStore.pagination.total} expedientes`)
    
    console.log('✅ Búsqueda desde ExpedientesView completada')
  } catch (error) {
    console.error('❌ Error en búsqueda desde ExpedientesView:', error)
    showError('Error en la búsqueda', 'No se pudieron cargar los expedientes')
  }
}

const handleClearSearch = () => {
  searchQuery.value = ''
  persistentExpedienteSearch.value = ''
  expedientesStore.clearResults()
}

const handleClearAll = () => {
  searchQuery.value = ''
  persistentExpedienteSearch.value = ''
  persistentFilters.value = {}
  clearAllFiltersLogic()
  expedientesStore.clearResults()
  showSuccess('Filtros limpiados', 'Se han eliminado todos los filtros y criterios de búsqueda')
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
  if (showFilters.value) {
    drawerFullScreen.value = false
  }
}

const toggleDrawerFullscreen = () => {
  drawerFullScreen.value = !drawerFullScreen.value
}

// Métodos de filtros - IGUAL QUE DASHBOARD
// const handleApplyFilters = async (filterData) => {
//   console.log('📋 Aplicando filtros desde FilterPanel:', filterData)
  
//   // Guardar filtros persistentemente
//   persistentFilters.value = { ...filterData }
  
//   // Cerrar panel de filtros
//   showFilters.value = false
  
//   // Sincronizar con resultados del store si existen
//   if (expedientesStore.hasExpedientes) {
//     console.log('🔄 Filtros aplicados y sincronizados')
//   }
  
//   console.log('✅ Filtros guardados correctamente')
// }

// const handleClearFilters = () => {
//   console.log('Limpiando todos los filtros')
  
//   // Limpiar estado persistente
//   persistentFilters.value = {}
//   persistentExpedienteSearch.value = ''
  
//   // Limpiar búsquedas
//   searchQuery.value = ''
//   expedientesStore.clearResults()
  
//   console.log('✅ Filtros y búsquedas limpiados completamente')
// }

// const handleFilterChange = (filterData) => {
//   console.log('Filtros cambiados:', filterData)
  
//   // Actualizar filtros persistentes en tiempo real
//   persistentFilters.value = { ...filterData }
// }

// const handleExpedienteSearch = async (expediente) => {
//   console.log('🔍 Búsqueda desde FilterPanel:', expediente)
  
//   // Sincronizar estados
//   persistentExpedienteSearch.value = expediente || ''
  
//   if (expediente !== searchQuery.value) {
//     searchQuery.value = expediente || ''
//   }
  
//   // Los resultados ya están en el store desde FilterPanel
//   if (expedientesStore.hasExpedientes) {
//     console.log('🔄 Resultados sincronizados desde FilterPanel')
//   }
// }

// const handleToggleFullscreen = (isFullscreen) => {
//   drawerFullScreen.value = isFullscreen
//   console.log('Sidebar fullscreen desde FilterPanel:', isFullscreen)
// }

// const removeFilter = (filterKey) => {
//   clearSingleFilter(filterKey)
//   // Re-aplicar búsqueda automáticamente si hay búsqueda activa
//   if (searchQuery.value) {
//     handleSearch()
//   }
// }

// const clearAllFilters = () => {
//   clearAllFiltersLogic()
//   persistentFilters.value = {}
//   if (searchQuery.value) {
//     handleSearch()
//   }
// }

// Métodos de tabla - USANDO EL COMPONENTE EXISTENTE
const handlePageChange = async (page) => {
  await expedientesStore.changePage(page)
}

const handleRowClick = (expediente) => {
  console.log('Fila seleccionada:', expediente)
  selectedExpediente.value = expediente
  showExpedienteDetail.value = true
}

// Métodos de navegación
const createNewExpediente = () => {
  router.push('/expedientes/nuevo')
}

const editExpediente = () => {
  if (selectedExpediente.value) {
    router.push(`/expedientes/${selectedExpediente.value.id}/edit`)
  }
}

// Lifecycle - CARGAR DATOS DESDE URL COMO EN DASHBOARD
onMounted(async () => {
  console.log('ExpedientesView cargado')
  
  // Cargar filtros desde la URL
  loadFiltersFromQuery(route.query)
  
  // Realizar búsqueda inicial si hay parámetros
  const hasSearchParams = route.query.search || Object.keys(route.query).length > 1
  if (hasSearchParams) {
    await handleExpedienteSearch(route.query.search)
  }
  
  console.log('✅ ExpedientesView inicializado')
})

// Watchers para sincronizar con la URL - IGUAL QUE DASHBOARD
watch([searchQuery, persistentFilters], ([newSearch, newFilters]) => {
  const query = { ...newFilters }
  if (newSearch) {
    query.search = newSearch
  }
  
  // Actualizar URL sin recargar la página
  router.replace({ query })
}, { deep: true })
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.expedientes-view {
  min-height: 100vh;
  background: var(--iggsad-surface-25, #fefefe);
  padding: var(--iggsad-spacing-lg);
  font-family: var(--iggsad-font-primary);
}

/* ===== HEADER DE LA PÁGINA ===== */
.page-header {
  margin-bottom: var(--iggsad-spacing-2xl);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-xl);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
}

.title-section {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-md);
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--iggsad-surface-800);
  margin: 0 0 var(--iggsad-spacing-sm) 0;
  line-height: 1.2;
}

.title-icon {
  color: var(--iggsad-primary-600);
  font-size: 2rem;
}

.page-subtitle {
  color: var(--iggsad-surface-600);
  font-size: 1.125rem;
  line-height: 1.5;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--iggsad-spacing-md);
  align-items: center;
}

.header-action-btn {
  transition: all var(--iggsad-transition-fast);
}

.header-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--iggsad-shadow-lg);
}

.page-breadcrumb {
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-md) var(--iggsad-spacing-lg);
  border-radius: var(--iggsad-radius-md);
  border: 1px solid var(--iggsad-surface-200);
}

/* ===== SECCIÓN DE BÚSQUEDA ===== */
.search-section {
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-xl);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  margin-bottom: var(--iggsad-spacing-xl);
}

.search-container {
  display: flex;
  gap: var(--iggsad-spacing-lg);
  align-items: flex-end;
  margin-bottom: var(--iggsad-spacing-lg);
}

.search-input-wrapper {
  flex: 1;
}

.search-actions {
  display: flex;
  gap: var(--iggsad-spacing-sm);
}

.search-btn {
  background: var(--iggsad-primary-600);
  border-color: var(--iggsad-primary-600);
}

.search-btn:hover {
  background: var(--iggsad-primary-700);
  border-color: var(--iggsad-primary-700);
  transform: translateY(-2px);
}

/* Filtros activos */
.active-filters {
  border-top: 1px solid var(--iggsad-surface-200);
  padding-top: var(--iggsad-spacing-lg);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--iggsad-spacing-md);
}

.filters-label {
  font-weight: 600;
  color: var(--iggsad-surface-700);
  font-size: 0.875rem;
}

.filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--iggsad-spacing-sm);
}

.filter-tag {
  background: var(--iggsad-primary-50);
  border: 1px solid var(--iggsad-primary-200);
  color: var(--iggsad-primary-700);
}

.filter-content {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.filter-remove-btn {
  color: var(--iggsad-primary-600);
  opacity: 0.7;
  transition: opacity var(--iggsad-transition-fast);
}

.filter-remove-btn:hover {
  opacity: 1;
}

/* ===== ESTADÍSTICAS ===== */
.stats-section {
  margin-bottom: var(--iggsad-spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--iggsad-spacing-lg);
}

.stat-card {
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-lg);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-md);
  transition: all var(--iggsad-transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--iggsad-shadow-lg);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--iggsad-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.stat-icon.total { background: var(--iggsad-primary-600); }
.stat-icon.active { background: #16a34a; } /* green-600 */
.stat-icon.urgent { background: #ea580c; } /* orange-600 */
.stat-icon.money { background: #7c3aed; } /* violet-600 */

.stat-content {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--iggsad-surface-800);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  font-weight: 500;
}

/* ===== SECCIÓN DE TABLA ===== */
.table-section {
  background: var(--iggsad-surface-white);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  overflow: hidden;
}

/* ===== SIDEBAR DE FILTROS ===== */
/* :deep(.filters-sidebar) {
  .p-sidebar-header {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-bottom: 2px solid var(--iggsad-surface-200);
    padding: var(--iggsad-spacing-lg);
  }

  .p-sidebar-content {
    padding: 0;
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--iggsad-surface-800);
  margin: 0;
}

.sidebar-actions {
  display: flex;
  gap: var(--iggsad-spacing-sm);
} */

/* ===== DRAWER DE FILTROS ===== */
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

/* ===== DIALOG DE DETALLES ===== */
:deep(.expediente-detail-dialog) {
  .p-dialog-header {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-bottom: 2px solid var(--iggsad-surface-200);
  }

  .p-dialog-content {
    padding: 0;
  }
}

.expediente-detail-content {
  padding: var(--iggsad-spacing-lg);
}

.detail-section {
  padding: var(--iggsad-spacing-lg);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--iggsad-spacing-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--iggsad-spacing-xs);
}

.detail-item label {
  font-weight: 600;
  color: var(--iggsad-surface-700);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.detail-item span {
  color: var(--iggsad-surface-800);
  font-size: 0.9375rem;
}

.expediente-code {
  font-family: var(--iggsad-font-mono);
  background: var(--iggsad-primary-50);
  color: var(--iggsad-primary-700);
  padding: 0.25rem 0.5rem;
  border-radius: var(--iggsad-radius-sm);
  font-weight: 600;
  border: 1px solid var(--iggsad-primary-200);
  display: inline-block;
}

.money-amount {
  font-family: var(--iggsad-font-mono);
  font-weight: 600;
  color: var(--iggsad-surface-800);
}

.dialog-footer {
  display: flex;
  gap: var(--iggsad-spacing-sm);
  justify-content: flex-end;
  padding: var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-50);
  border-top: 1px solid var(--iggsad-surface-200);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .expedientes-view {
    padding: var(--iggsad-spacing-md);
  }

  .header-content {
    flex-direction: column;
    gap: var(--iggsad-spacing-md);
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .search-container {
    flex-direction: column;
    gap: var(--iggsad-spacing-md);
  }

  .search-actions {
    justify-content: stretch;
  }

  .search-actions .search-btn,
  .search-actions .clear-btn {
    flex: 1;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .expedientes-view {
    padding: var(--iggsad-spacing-sm);
    margin: 0 calc(-1 * var(--iggsad-spacing-sm));
  }

  .page-title {
    font-size: 1.75rem;
  }

  .header-content,
  .search-section,
  .table-section {
    border-radius: var(--iggsad-radius-md);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--iggsad-spacing-md);
  }

  .stat-card {
    padding: var(--iggsad-spacing-md);
  }

  .filters-list {
    flex-direction: column;
  }

  .filter-tag {
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--iggsad-spacing-sm);
  }

  .title-icon {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== ACCESIBILIDAD ===== */
@media (prefers-reduced-motion: reduce) {
  *,
  :deep(*) {
    transition: none !important;
    animation: none !important;
  }
}

/* Focus visible para navegación por teclado */
.header-action-btn:focus-visible,
.search-btn:focus-visible,
.clear-btn:focus-visible {
  outline: 2px solid var(--iggsad-primary-600);
  outline-offset: 2px;
}

.filter-remove-btn:focus-visible {
  outline: 2px solid var(--iggsad-primary-600);
  outline-offset: 1px;
  border-radius: var(--iggsad-radius-sm);
}

/* ===== ANIMACIONES ===== */
.expedientes-view {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Escalonado de animaciones para las cards */
.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

</style>