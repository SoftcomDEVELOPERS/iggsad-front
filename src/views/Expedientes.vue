<template>
  <div class="expedientes-view">
    
    <!-- 🎯 SECCIÓN DE BÚSQUEDA Y ESTADÍSTICAS EN DOS COLUMNAS -->
    <div class="search-and-stats-section">
      <div class="search-and-stats-container">
        
        <!-- ===== COLUMNA IZQUIERDA: BÚSQUEDA ===== -->
        <div class="search-column">
          <div class="search-area">
            
            <!-- Botón de filtros arriba -->
            <div class="title-section">
               <h1 class="page-title">
                <i class="pi pi-folder title-icon"></i>
                Gestión de Expedientes
              </h1>
              <Button
                  icon="pi pi-plus"
                  label="Nuevo Expediente"
                  class="header-action-btn"
                  @click="createNewExpediente"
                />
            </div>
            
            <!-- Barra de búsqueda -->
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
            
            <!-- Botones de acción -->
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
                label="Limpiar Todo"
                outlined
                severity="secondary"
                @click="handleClearAll"
                class="clear-btn"
              />

              <Button
                icon="pi pi-filter"
                :label="`Filtros Avanzados ${totalActiveFilters > 0 ? `(${totalActiveFilters})` : ''}`"
                outlined
                :severity="totalActiveFilters > 0 ? 'success' : 'secondary'"
                class="filters-button"
                @click="toggleFilters"
              />
            </div>
            
            <!-- Filtros activos (MOVIDO ABAJO) -->
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
        </div>

        <!-- ===== COLUMNA DERECHA: ESTADÍSTICAS COMPACTAS ===== -->
        <div class="stats-column" v-if="expedientesStore.expedientes.length > 0">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="pi pi-folder"></i>
              </div>
              <div class="stat-content">
                <span class="stat-number">{{ expedientesStore.pagination.total }}</span>
                <span class="stat-label">Total</span>
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
                <span class="stat-label">Importe</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Tabla principal -->
    <div class="table-section">
      <ExpedientesTable
        :expedientes="expedientesStore.expedientes"
        :loading="expedientesStore.isLoading"
        :pagination="expedientesStore.pagination"
        @page="handlePageChange"
        @sort="handleSort"
        @view-expediente="handleViewExpediente"
        @selection-change="handleSelectionChange"
      />
    </div>

    <!-- USAR SOLO EL FILTERSDRAWER COMPONENT -->
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

    <!-- Dialog de detalles del expediente -->
    <ExpedientesDetailDialog
      v-model:visible="showExpedienteDetail"
      :expediente="selectedExpediente"
      @edit-expediente="editExpediente"
      @print-expediente="printExpediente"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import SearchBar from '@/components/SearchBar.vue'
import ExpedientesTable from '@/components/expedientes/ExpedientesTable.vue'
import ExpedientesDetailDialog from '@/components/expedientes/ExpedientesDetailDialog.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import FiltersDrawer from '@/components/filters/FiltersDrawer.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useFiltersDrawer } from '@/composables/useFiltersDrawer'
import { useToast } from '@/composables/useToast'
import { usePersistentView } from '@/composables/usePersistentView'

// Composables
const router = useRouter()
const expedientesStore = useExpedientesStore()
const { showSuccess, showWarn, showError } = useToast()

// 🎯 USAR SOLO EL COMPOSABLE FILTERSDRAWER - SIN DUPLICACIONES
const {
  // Estado del drawer
  showFilters,
  persistentFilters,
  persistentExpedienteSearch,
  
  // Computed
  totalActiveFilters,
  activeFiltersDisplay,
  
  // Métodos del drawer
  toggleFilters,
  
  // Métodos de filtros
  handleApplyFilters,
  handleClearFilters,
  handleFilterChange,
  handleExpedienteSearch,
  handleToggleFullscreen,
  
  // Métodos de filtros individuales
  removeFilter,
  clearAllFilters,
  
  // Métodos de configuración
  loadFiltersFromQuery
} = useFiltersDrawer({
  enableRedirection: false // Sin redirección en ExpedientesView
})

// 🎯 PERSISTENCIA USANDO EL PATRÓN SIMPLIFICADO
const {
  searchQuery,
  setupUrlSync,
  restoreState,
  markAsInitialized
} = usePersistentView({
  searchStore: expedientesStore,
  searchMethod: 'searchExpedientes',
  enableAutoSearch: true,
  debugName: 'ExpedientesView'
})

// Estado local ESPECÍFICO de esta vista (NO duplicar filtros)
const showExpedienteDetail = ref(false)
const selectedExpediente = ref(null)

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

// Métodos de búsqueda LOCALES (sincronizados con el composable)
const handleSearch = async () => {
  
  try {
    console.log('🔍 Búsqueda desde ExpedientesView:', searchQuery.value.trim())
    
    // Sincronizar con el composable
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
  clearAllFilters()
  expedientesStore.clearResults()
  showSuccess('Filtros limpiados', 'Se han eliminado todos los filtros y criterios de búsqueda')
}

// Métodos de tabla
const handlePageChange = async (page) => {
  await expedientesStore.changePage(page)
}

const handleViewExpediente = (expediente) => {
  console.log('Fila seleccionada:', expediente)
  selectedExpediente.value = expediente
  showExpedienteDetail.value = true
}

const handleSort = (sortEvent) => {
  if (sortEvent.sortedData) {
    // Actualizar los datos en el store con los datos ordenados
    expedientesStore.expedientes = sortEvent.sortedData
    console.log('📊 Expedientes ordenados en el store')
  }
}

const handleSelectionChange = (selectedExpedientes) => {
  console.log('🎯 Selección actualizada en Expedientes.vue:', selectedExpedientes.length)
  
  // Preparado para trabajar con múltiples selecciones
    exportSelectedToExcel(selectedExpedientes)
  sendMassiveEmail(selectedExpedientes)
  generateMassiveReport(selectedExpedientes)
}

const exportSelectedToExcel = (selectedExpedientes) => { // ✅ Recibe como parámetro
  if (selectedExpedientes.length === 0) {
    showWarn('Sin selección', 'Selecciona al menos un expediente para exportar')
    return
  }
  console.log('📊 Exportando expedientes:', selectedExpedientes.map(exp => exp.numero))
}

const sendMassiveEmail = (selectedExpedientes) => { // ✅ Recibe como parámetro
  if (selectedExpedientes.length === 0) {
    showWarn('Sin selección', 'Selecciona al menos un expediente para envío masivo')
    return
  }
  console.log('📧 Envío masivo a expedientes:', selectedExpedientes.length)
}

const generateMassiveReport = (selectedExpedientes) => { // ✅ Recibe como parámetro
  if (selectedExpedientes.length === 0) {
    showWarn('Sin selección', 'Selecciona al menos un expediente para generar reporte')
    return
  }
  console.log('📋 Generando reporte masivo:', selectedExpedientes.length)
}



// Métodos de navegación
const createNewExpediente = () => {
  router.push('/expedientes/nuevo')
}

const editExpediente = () => {
  if (selectedExpediente.value) {
    showWarn(
      'Funcionalidad en desarrollo',
      `Edición del expediente ${selectedExpediente.value.numero} no está implementada aún`
    )
  }
}

const printExpediente = () => {
  showWarn('Funcionalidad en desarrollo', 'La impresión del expediente estará disponible próximamente')
}

// 🔧 LIFECYCLE SIMPLIFICADO Y CORREGIDO
onMounted(async () => {
  console.log('ExpedientesView cargado')
  
  // Restaurar estado desde URL automáticamente
  await restoreState(persistentFilters, persistentExpedienteSearch, loadFiltersFromQuery)
  
  // Configurar sincronización automática
  setupUrlSync(persistentFilters)
  
  // Marcar como inicializado
  markAsInitialized()
})
</script>

<style src="@/styles/expedientes.css"></style>