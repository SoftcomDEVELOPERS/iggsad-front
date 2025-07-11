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
        </div>
      </div>
    </div>

    <!-- 🎯 SECCIÓN DE BÚSQUEDA Y ESTADÍSTICAS EN DOS COLUMNAS -->
    <div class="search-and-stats-section">
      <div class="search-and-stats-container">
        
        <!-- ===== COLUMNA IZQUIERDA: BÚSQUEDA ===== -->
        <div class="search-column">
          <div class="search-area">
            
            <!-- Botón de filtros arriba -->
            <div class="filters-button-container">
              <Button
                icon="pi pi-filter"
                :label="`Filtros Avanzados ${totalActiveFilters > 0 ? `(${totalActiveFilters})` : ''}`"
                outlined
                :severity="totalActiveFilters > 0 ? 'success' : 'secondary'"
                class="filters-button"
                @click="toggleFilters"
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
        @row-click="handleRowClick"
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
    <Dialog
      v-model:visible="showExpedienteDetail"
      :header="`Expediente ${selectedExpediente?.numero}`"
      :modal="true"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      class="expediente-detail-dialog"
    >
      <div class="expediente-detail-content" v-if="selectedExpediente">
        <div class="detail-tabs">
          <Tabs value="0">
            <TabList>
              <Tab value="0">Información General</Tab>
              <Tab value="1">Fechas</Tab>
              <Tab value="2">Importes</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel value="0">
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
              
              <TabPanel value="1">
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
              
              <TabPanel value="2">
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
            </TabPanels>
          </Tabs>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import SearchBar from '@/components/SearchBar.vue'
import ExpedientesTable from '@/components/expedientes/ExpedientesTable.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import FiltersDrawer from '@/components/filters/FiltersDrawer.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useFiltersDrawer } from '@/composables/useFiltersDrawer'
import { useToast } from '@/composables/useToast'
import { usePersistentView } from '@/composables/usePersistentView'

// Composables
const router = useRouter()
const route = useRoute()
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

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Métodos de búsqueda LOCALES (sincronizados con el composable)
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    showWarn('Búsqueda vacía', 'Por favor ingrese un criterio de búsqueda')
    return
  }
  
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
    showWarn(
      'Funcionalidad en desarrollo',
      `Edición del expediente ${selectedExpediente.value.numero} no está implementada aún`
    )
  }
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
  margin-bottom: var(--iggsad-spacing-md);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-lg);
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

/* ===== SECCIÓN DE BÚSQUEDA Y ESTADÍSTICAS EN DOS COLUMNAS ===== */
.search-and-stats-section {
  background: var(--iggsad-surface-white);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  margin-bottom: var(--iggsad-spacing-xl);
  overflow: visible;
  position: relative;
  z-index: 1;
}

.search-and-stats-container {
  display: grid;
  grid-template-columns: 1fr 800px;
  gap: var(--iggsad-spacing-2xl);
  padding: var(--iggsad-spacing-xl);
  align-items: start;
  width: 100%; /* 🔧 FIX: Asegurar que usa todo el ancho disponible */
}

/* ===== COLUMNA IZQUIERDA: BÚSQUEDA ALINEADA A LA IZQUIERDA ===== */
.search-column {
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* 🔧 FIX: Contenido alineado a la izquierda */
  align-items: flex-start;
}

.search-area {
  display: flex;
  flex-direction: column;
  gap: var(--iggsad-spacing-lg);
  width: 100%; /* 🔧 FIX: Usar todo el ancho disponible */
  /* 🔧 FIX: Contenido alineado a la izquierda */
  align-items: flex-start;
}

.filters-button-container {
  /* 🔧 FIX: Botón alineado a la izquierda */
  align-self: flex-start;
}

.filters-button {
  transition: all var(--iggsad-transition-fast);
}

.filters-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-md);
}

.search-input-wrapper {
  width: 100%;
}

.search-actions {
  display: flex;
  gap: var(--iggsad-spacing-md);
  /* 🔧 FIX: Botones alineados a la izquierda */
  align-self: flex-start;
}

.search-btn {
  background: var(--iggsad-primary-600);
  border-color: var(--iggsad-primary-600);
  transition: all var(--iggsad-transition-fast);
}

.search-btn:hover:not(:disabled) {
  background: var(--iggsad-primary-700);
  border-color: var(--iggsad-primary-700);
  transform: translateY(-2px);
  box-shadow: var(--iggsad-shadow-lg);
}

.clear-btn {
  transition: all var(--iggsad-transition-fast);
}

.clear-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-md);
}

/* Filtros activos (sin border-top, ya está integrado) */
.active-filters {
  /* 🔧 FIX: Sin border-top para integración más fluida */
  padding-top: 0;
  margin-top: var(--iggsad-spacing-md);
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

/* ===== COLUMNA DERECHA: ESTADÍSTICAS BALANCEADAS ===== */
.stats-column {
  width: 100%; /* 🔧 FIX: Usar todo el ancho asignado */
  flex-shrink: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: var(--iggsad-spacing-lg);
  height: fit-content;
}

.stat-card {
  background: var(--iggsad-surface-white);
  padding: var(--iggsad-spacing-lg);
  border-radius: var(--iggsad-radius-md);
  border: 1px solid var(--iggsad-surface-200);
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-md);
  transition: all var(--iggsad-transition-fast);
  /* 🔧 FIX: Altura fija para que todas las cards sean iguales */
  height: 90px;
  /* 🔧 FIX: Ancho fijo para que todas sean iguales */
  min-width: 0;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--iggsad-shadow-md);
  border-color: var(--iggsad-surface-300);
}

.stat-icon {
  width: 3rem; /* 🔧 FIX: Iconos más grandes */
  height: 3rem;
  border-radius: var(--iggsad-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem; /* 🔧 FIX: Iconos más grandes */
  color: white;
  flex-shrink: 0;
}

.stat-icon.total { background: var(--iggsad-primary-600); }
.stat-icon.active { background: #16a34a; } /* green-600 */
.stat-icon.urgent { background: #ea580c; } /* orange-600 */
.stat-icon.money { background: #7c3aed; } /* violet-600 */

.stat-content {
  flex: 1;
  min-width: 0;
  /* 🔧 FIX: Evitar que el contenido afecte el tamaño de las cards */
  overflow: hidden;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--iggsad-surface-800);
  line-height: 1;
  margin-bottom: 0.25rem;
  /* 🔧 FIX: Manejo de texto largo mejorado */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.2;
  /* 🔧 FIX: Permitir wrap en labels para que se vean completas */
  white-space: normal;
  word-wrap: break-word;
}

/* ===== SECCIÓN DE TABLA ===== */
.table-section {
  background: var(--iggsad-surface-white);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  overflow: visible;
  position: relative;
}

/* 🔧 FIX: Solo aplicar overflow hidden al contenido interno de la tabla */
.table-section :deep(.p-datatable-wrapper) {
  overflow: hidden;
  border-radius: var(--iggsad-radius-lg);
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

  .search-and-stats-container {
    grid-template-columns: 1fr;
    gap: var(--iggsad-spacing-lg);
  }

  .stats-column {
    width: 100%;
    order: -1; /* Mostrar estadísticas arriba en tablet */
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--iggsad-spacing-sm);
  }

  .stat-card {
    padding: var(--iggsad-spacing-sm);
    min-height: 60px;
  }

  .stat-icon {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }

  .stat-number {
    font-size: 1.125rem;
  }

  .stat-label {
    font-size: 0.75rem;
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
  .search-and-stats-section,
  .table-section {
    border-radius: var(--iggsad-radius-md);
  }

  .search-and-stats-container {
    padding: var(--iggsad-spacing-lg);
  }

  .search-area {
    gap: var(--iggsad-spacing-md);
  }

  .search-actions {
    flex-direction: column;
    gap: var(--iggsad-spacing-sm);
  }

  .search-btn,
  .clear-btn {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: var(--iggsad-spacing-sm);
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: var(--iggsad-spacing-sm);
    gap: var(--iggsad-spacing-xs);
    min-height: auto;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    align-items: center;
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

  .search-and-stats-container {
    padding: var(--iggsad-spacing-md);
  }

  .filters-button {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--iggsad-spacing-xs);
  }

  .stat-card {
    flex-direction: row;
    text-align: left;
    justify-content: flex-start;
    min-height: 50px;
  }

  .stat-icon {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }

  .stat-number {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.6875rem;
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