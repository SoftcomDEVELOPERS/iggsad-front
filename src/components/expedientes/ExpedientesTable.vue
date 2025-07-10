<!-- src/components/expedientes/ExpedientesTable.vue -->
<template>
  <div class="expedientes-table-container">
    
    <!-- Header mejorado de la tabla -->
    <div class="table-header">
      <div class="table-title-section">
        <h3 class="table-title">
          <i class="pi pi-folder table-title-icon"></i>
          Expedientes
        </h3>
        <div class="table-stats">
          <Badge 
            :value="pagination.total" 
            severity="info"
            class="total-badge"
          />
          <span class="stats-text">expedientes encontrados</span>
        </div>
      </div>
      
      <div class="table-actions">
        <Button
          icon="pi pi-refresh"
          outlined
          size="small"
          severity="secondary"
          v-tooltip="'Actualizar resultados'"
          :loading="loading"
          @click="refreshTable"
          class="action-button"
        />
        <Button
          icon="pi pi-download"
          outlined
          size="small"
          severity="secondary"
          label="Exportar"
          v-tooltip="'Exportar a Excel'"
          @click="exportToExcel"
          class="action-button"
        />
        <Button
          icon="pi pi-cog"
          outlined
          size="small"
          severity="secondary"
          v-tooltip="'Configurar columnas'"
          @click="showColumnConfig = true"
          class="action-button"
        />
      </div>
    </div>

    <!-- Barra de herramientas rápidas -->
    <div class="table-toolbar" v-if="expedientes.length > 0">
      <div class="toolbar-left">
        <span class="showing-text">
          Mostrando {{ ((pagination.page - 1) * pagination.pageSize) + 1 }} - 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} de {{ pagination.total }}
        </span>
      </div>
      
      <div class="toolbar-right">
        <Dropdown
          v-model="selectedPageSize"
          :options="pageSizeOptions"
          option-label="label"
          option-value="value"
          placeholder="Filas por página"
          class="page-size-dropdown"
          @change="onPageSizeChange"
        />
      </div>
    </div>

    <!-- Tabla principal mejorada -->
    <div class="table-wrapper">
      <DataTable
        :value="expedientes"
        :loading="loading"
        paginator
        :rows="pagination.pageSize"
        :totalRecords="pagination.total"
        :first="(pagination.page - 1) * pagination.pageSize"
        @page="onPage"
        @row-click="onRowClick"
        class="expedientes-datatable"
        responsiveLayout="scroll"
        scrollable
        :scrollHeight="tableHeight"
        sortMode="multiple"
        removableSort
        stripedRows
        size="small"
        :pt="{
          root: 'expedientes-table-root',
          header: 'expedientes-table-header',
          body: 'expedientes-table-body',
          row: 'expedientes-table-row'
        }"
      >
        <!-- Loading template personalizado -->
        <template #loading>
          <div class="loading-overlay">
            <ProgressSpinner class="loading-spinner" />
            <p class="loading-text">Cargando expedientes...</p>
          </div>
        </template>

        <!-- Empty state personalizado -->
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-folder-open empty-icon"></i>
            <h4 class="empty-title">No se encontraron expedientes</h4>
            <p class="empty-text">
              Ajuste los filtros de búsqueda o intente con otros criterios
            </p>
          </div>
        </template>

        <!-- Paginador personalizado -->
        <template #paginatorstart>
          <div class="paginator-info">
            <i class="pi pi-info-circle"></i>
            <span>Página {{ pagination.page }} de {{ Math.ceil(pagination.total / pagination.pageSize) }}</span>
          </div>
        </template>

        <template #paginatorend>
          <div class="paginator-actions">
            <Button
              icon="pi pi-angle-double-left"
              text
              @click="goToFirstPage"
              :disabled="pagination.page === 1"
              v-tooltip="'Primera página'"
            />
            <Button
              icon="pi pi-angle-double-right"
              text
              @click="goToLastPage"
              :disabled="pagination.page === Math.ceil(pagination.total / pagination.pageSize)"
              v-tooltip="'Última página'"
            />
          </div>
        </template>

        <!-- Columnas mejoradas con estilos aplicados -->
        <Column
          v-for="col in visibleColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :body="col.body"
          :style="col.style"
          :sortable="col.sortable !== false"
          :frozen="col.frozen"
          :class="getColumnClass(col)"
        >
          <!-- Template personalizado para columna de expediente -->
          <template #body="{ data }" v-if="col.field === 'numero'">
            <div class="expediente-cell">
              <code class="expediente-code">{{ data.numero }}</code>
              <Badge
                v-if="isUrgent(data)"
                value="URGENTE"
                severity="danger"
                class="urgente-badge"
              />
            </div>
          </template>

          <!-- Template para importes monetarios -->
          <template #body="{ data }" v-if="isMoneyColumn(col.field)">
            <div class="money-cell">
              <span class="money-amount" :class="getMoneyClass(data[col.field])">
                {{ formatCurrency(data[col.field]) }}
              </span>
            </div>
          </template>

          <!-- Template para fechas -->
          <template #body="{ data }" v-if="isDateColumn(col.field)">
            <div class="date-cell">
              <span class="date-value" :class="getDateClass(data[col.field])">
                {{ formatDate(data[col.field]) }}
              </span>
            </div>
          </template>

          <!-- Template para embargos -->
          <template #body="{ data }" v-if="col.field === 'embargos'">
            <Tag
              :value="data.embargos"
              :severity="data.embargos === 'Sí' ? 'success' : 'secondary'"
              class="embargo-tag"
            />
          </template>

          <!-- Template para cartera -->
          <template #body="{ data }" v-if="col.field === 'cartera'">
            <div class="cartera-cell">
              <i class="pi pi-briefcase cartera-icon" :class="getCarteraIconClass(data.cartera)"></i>
              <span class="cartera-text">{{ data.cartera }}</span>
            </div>
          </template>

          <!-- Template para nombre titular -->
          <template #body="{ data }" v-if="col.field === 'nombreTitular'">
            <div class="titular-cell">
              <i class="pi pi-user titular-icon"></i>
              <span class="titular-name">{{ data.nombreTitular }}</span>
            </div>
          </template>
        </Column>

        <!-- Columna de acciones fija a la derecha -->
        <Column 
          header="Acciones" 
          frozen 
          alignFrozen="right"
          class="acciones-column"
          :style="{ 'min-width': '7rem' }"
        >
          <template #body="{ data }">
            <div class="acciones-cell">
              <Button
                icon="pi pi-eye"
                text
                rounded
                size="small"
                severity="info"
                v-tooltip="'Ver expediente'"
                @click="viewExpediente(data)"
                class="action-btn view-btn"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                size="small"
                severity="secondary"
                v-tooltip="'Editar expediente'"
                @click="editExpediente(data)"
                class="action-btn edit-btn"
              />
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                size="small"
                severity="secondary"
                v-tooltip="'Más opciones'"
                @click="toggleRowMenu($event, data)"
                class="action-btn menu-btn"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Menú contextual -->
    <Menu
      ref="rowMenu"
      :model="rowMenuItems"
      :popup="true"
      class="row-context-menu"
    />

    <!-- Dialog de configuración de columnas -->
    <Dialog
      v-model:visible="showColumnConfig"
      header="Configurar Columnas Visibles"
      :modal="true"
      :style="{ width: '50rem' }"
      class="column-config-dialog"
    >
      <div class="column-config-content">
        <div class="config-header">
          <p>Selecciona las columnas que deseas mostrar en la tabla:</p>
        </div>
        
        <div class="column-grid">
          <div 
            v-for="col in allColumns" 
            :key="col.field"
            class="column-item"
          >
            <Checkbox
              v-model="col.visible"
              :inputId="col.field"
              binary
            />
            <label :for="col.field" class="column-label">
              {{ col.header }}
            </label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="config-footer">
          <Button
            label="Mostrar Todas"
            icon="pi pi-check"
            outlined
            @click="showAllColumns"
          />
          <Button
            label="Columnas Básicas"
            icon="pi pi-filter"
            outlined
            @click="showBasicColumns"
          />
          <Button
            label="Aplicar"
            icon="pi pi-save"
            @click="applyColumnConfig"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  expedientes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, required: true }
})

const emit = defineEmits(['page', 'rowClick', 'refresh', 'export'])

// Composables
const { showSuccess, showWarn, showError } = useToast()

// Referencias
const rowMenu = ref()

// Estado local
const showColumnConfig = ref(false)
const selectedPageSize = ref(50)
const tableHeight = ref('600px')

// Opciones de tamaño de página
const pageSizeOptions = [
  { label: '25 filas', value: 25 },
  { label: '50 filas', value: 50 },
  { label: '100 filas', value: 100 },
  { label: '200 filas', value: 200 }
]

// Helpers de formato (mantenemos los originales)
function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

function formatCurrency(v) {
  if (v == null || v === '') return '-'
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(v)
}

// Definimos todas las columnas con configuración mejorada
const allColumns = ref([
  { 
    field: 'numero', 
    header: 'Expediente', 
    style: { 'min-width': '7rem' }, 
    frozen: true,
    visible: true,
    sortable: true
  },
  { 
    field: 'ap', 
    header: 'A.P.', 
    style: { 'min-width': '3.5rem' },
    visible: true
  },
  { 
    field: 'ee', 
    header: 'EE', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  { 
    field: 'ep', 
    header: 'EP', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  { 
    field: 'sub', 
    header: 'Sub.', 
    style: { 'min-width': '3.5rem' },
    visible: true
  },
  { 
    field: 'td', 
    header: 'TD', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  { 
    field: 'cartera', 
    header: 'Cartera', 
    style: { 'min-width': '7rem' },
    visible: true,
    sortable: true
  },
  { 
    field: 'nombreTitular', 
    header: 'Nombre Titular', 
    style: { 'min-width': '12rem' },
    visible: true,
    sortable: true
  },
  { 
    field: 'autos', 
    header: 'Autos', 
    style: { 'min-width': '5rem' },
    visible: false
  },
  { 
    field: 'autosVerbOrd', 
    header: 'AutosVerbOrd', 
    style: { 'min-width': '7rem' },
    visible: false
  },
  { 
    field: 'autoMonitorio', 
    header: 'AutoMonitorio', 
    style: { 'min-width': '7rem' },
    visible: false
  },
  {
    field: 'fechaEnvio',
    header: 'F. Envío',
    body: r => formatDate(r.fechaEnvio),
    style: { 'min-width': '6rem' },
    visible: true,
    sortable: true
  },
  {
    field: 'fechaPresentacion',
    header: 'F. Presentación',
    body: r => formatDate(r.fechaPresentacion),
    style: { 'min-width': '7rem' },
    visible: false
  },
  {
    field: 'fechaAdmision',
    header: 'F. Admisión',
    body: r => formatDate(r.fechaAdmision),
    style: { 'min-width': '7rem' },
    visible: false
  },
  {
    field: 'ultFechaAgJud',
    header: 'Últ. F. Ag. Jud.',
    body: r => formatDate(r.ultFechaAgJud),
    style: { 'min-width': '8rem' },
    visible: true,
    sortable: true
  },
  {
    field: 'ultFechaGesExp',
    header: 'Últ. F. Ges. Exp.',
    body: r => formatDate(r.ultFechaGesExp),
    style: { 'min-width': '8rem' },
    visible: true,
    sortable: true
  },
  { 
    field: 'embargos', 
    header: 'Embargos', 
    style: { 'min-width': '5rem' },
    visible: true
  },
  {
    field: 'ultFecCobro',
    header: 'Últ. F. Cobro',
    body: r => formatDate(r.ultFecCobro),
    style: { 'min-width': '7rem' },
    visible: false
  },
  { 
    field: 'lo', 
    header: 'LO', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  { 
    field: 'gt', 
    header: 'GT', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  { 
    field: 'oc', 
    header: 'OC', 
    style: { 'min-width': '3rem' },
    visible: false
  },
  {
    field: 'principal',
    header: 'Principal',
    body: r => formatCurrency(r.principal),
    style: { 'min-width': '6rem', 'text-align': 'right' },
    visible: true,
    sortable: true
  },
  {
    field: 'intereses',
    header: 'Intereses',
    body: r => formatCurrency(r.intereses),
    style: { 'min-width': '6rem', 'text-align': 'right' },
    visible: true,
    sortable: true
  },
  {
    field: 'costas',
    header: 'Costas',
    body: r => formatCurrency(r.costas),
    style: { 'min-width': '6rem', 'text-align': 'right' },
    visible: false
  },
  {
    field: 'ingJud',
    header: 'Ing. Judicial',
    body: r => formatCurrency(r.ingJud),
    style: { 'min-width': '6rem', 'text-align': 'right' },
    visible: false
  },
  {
    field: 'ingExj',
    header: 'Ing. Extrajudicial',
    body: r => formatCurrency(r.ingExj),
    style: { 'min-width': '7rem', 'text-align': 'right' },
    visible: false
  }
])

// Computed para columnas visibles
const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible)
})

// Métodos auxiliares de clasificación
const isMoneyColumn = (field) => {
  return ['principal', 'intereses', 'costas', 'ingJud', 'ingExj'].includes(field)
}

const isDateColumn = (field) => {
  return field.includes('fecha') || field.includes('Fec')
}

const isUrgent = (data) => {
  // Lógica para determinar si un expediente es urgente
  const principal = parseFloat(data.principal) || 0
  const daysSinceEnvio = data.fechaEnvio ? 
    Math.floor((new Date() - new Date(data.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
  
  return principal > 5000 || daysSinceEnvio > 90
}

const getColumnClass = (col) => {
  const classes = [`column-${col.field}`]
  
  if (isMoneyColumn(col.field)) classes.push('money-column')
  if (isDateColumn(col.field)) classes.push('date-column')
  if (col.frozen) classes.push('frozen-column')
  
  return classes.join(' ')
}

const getMoneyClass = (amount) => {
  const value = parseFloat(amount) || 0
  if (value > 10000) return 'money-high'
  if (value > 1000) return 'money-medium'
  return 'money-low'
}

const getDateClass = (date) => {
  if (!date) return 'date-empty'
  
  const daysDiff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
  if (daysDiff > 90) return 'date-old'
  if (daysDiff > 30) return 'date-medium'
  return 'date-recent'
}

const getCarteraIconClass = (cartera) => {
  const iconMap = {
    'Cartera A': 'cartera-a',
    'Cartera B': 'cartera-b', 
    'Cartera C': 'cartera-c'
  }
  return iconMap[cartera] || 'cartera-default'
}

// Métodos de eventos
const onPage = (e) => emit('page', e.page + 1)

const onRowClick = (e) => {
  emit('rowClick', e.data)
}

const onPageSizeChange = () => {
  // Emitir evento de cambio de tamaño de página
  emit('page-size-change', selectedPageSize.value)
}

const refreshTable = () => {
  emit('refresh')
}

const exportToExcel = () => {
  emit('export', 'excel')
}

const goToFirstPage = () => {
  emit('page', 1)
}

const goToLastPage = () => {
  const lastPage = Math.ceil(props.pagination.total / props.pagination.pageSize)
  emit('page', lastPage)
}

// Métodos de acciones de fila
const viewExpediente = (data) => {
  console.log('Ver expediente:', data)
  // Implementar navegación al detalle
}

const editExpediente = (data) => {
  console.log('Editar expediente:', data)
  // Implementar navegación a edición
}

const toggleRowMenu = (event, data) => {
  rowMenuItems.value = getRowMenuItems(data)
  rowMenu.value.toggle(event)
}

// Items del menú contextual
const rowMenuItems = ref([])

const getRowMenuItems = (data) => {
  return [
    {
      label: 'Ver Detalles',
      icon: 'pi pi-eye',
      command: () => viewExpediente(data)
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      command: () => editExpediente(data)
    },
    {
      separator: true
    },
    {
      label: 'Generar Documento',
      icon: 'pi pi-file-pdf',
      command: () => generateDocument(data)
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      command: () => viewHistory(data)
    },
    {
      separator: true
    },
    {
      label: 'Duplicar',
      icon: 'pi pi-copy',
      command: () => duplicateExpediente(data)
    },
    {
      label: 'Archivar',
      icon: 'pi pi-archive',
      command: () => archiveExpediente(data)
    }
  ]
}

const generateDocument = (data) => {
  showWarn('Función en desarrollo', 'La generación de documentos estará disponible próximamente')
}

const viewHistory = (data) => {
  showWarn('Función en desarrollo', 'El historial estará disponible próximamente')
}

const duplicateExpediente = (data) => {
  showWarn('Función en desarrollo', 'La duplicación estará disponible próximamente')
}

const archiveExpediente = (data) => {
  showWarn('Función en desarrollo', 'El archivado estará disponible próximamente')
}

// Métodos de configuración de columnas
const showAllColumns = () => {
  allColumns.value.forEach(col => col.visible = true)
}

const showBasicColumns = () => {
  const basicFields = ['numero', 'cartera', 'nombreTitular', 'fechaEnvio', 'principal', 'embargos']
  allColumns.value.forEach(col => {
    col.visible = basicFields.includes(col.field)
  })
}

const applyColumnConfig = () => {
  showColumnConfig.value = false
  showSuccess('Configuración aplicada', 'Las columnas se han actualizado correctamente')
}

// Lifecycle
onMounted(() => {
  selectedPageSize.value = props.pagination.pageSize
})

// Watchers
watch(() => props.pagination.pageSize, (newSize) => {
  selectedPageSize.value = newSize
})
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.expedientes-table-container {
  background: var(--iggsad-surface-white);
  border-radius: var(--iggsad-radius-lg);
  box-shadow: var(--iggsad-shadow-md);
  overflow: hidden;
  font-family: var(--iggsad-font-primary);
}

/* ===== HEADER MEJORADO ===== */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--iggsad-spacing-lg);
  background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
  border-bottom: 2px solid var(--iggsad-surface-200);
}

.table-title-section {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-md);
}

.table-title {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--iggsad-surface-800);
  margin: 0;
}

.table-title-icon {
  color: var(--iggsad-primary-600);
  font-size: 1.125rem;
}

.table-stats {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.total-badge {
  font-weight: 600;
}

.stats-text {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
}

.table-actions {
  display: flex;
  gap: var(--iggsad-spacing-sm);
}

.action-button {
  transition: all var(--iggsad-transition-fast);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-md);
}

/* ===== TOOLBAR ===== */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--iggsad-spacing-md) var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-25, #fefefe);
  border-bottom: 1px solid var(--iggsad-surface-200);
}

.showing-text {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  font-weight: 500;
}

.page-size-dropdown {
  min-width: 8rem;
}

/* ===== WRAPPER Y TABLA ===== */
.table-wrapper {
  position: relative;
  overflow: hidden;
}

:deep(.expedientes-datatable) {
  /* Tabla principal */
  .p-datatable-table {
    border-collapse: separate;
    border-spacing: 0;
  }

  /* Headers mejorados */
  .p-datatable-thead > tr > th {
    background: linear-gradient(135deg, var(--iggsad-surface-100) 0%, var(--iggsad-surface-150, #f1f4f7) 100%);
    border-bottom: 2px solid var(--iggsad-surface-300);
    color: var(--iggsad-surface-800);
    font-weight: 600;
    font-size: 0.75rem;
    padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .p-datatable-thead > tr > th:hover {
    background: linear-gradient(135deg, var(--iggsad-surface-150, #f1f4f7) 0%, var(--iggsad-surface-200) 100%);
  }

  /* Filas mejoradas */
  .p-datatable-tbody > tr {
    transition: all var(--iggsad-transition-fast);
    border-bottom: 1px solid var(--iggsad-surface-100);
  }

  .p-datatable-tbody > tr:hover {
    background: var(--iggsad-primary-25, #f0f7ff);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
  }

  .p-datatable-tbody > tr.p-row-odd {
    background: var(--iggsad-surface-25, #fefefe);
  }

  .p-datatable-tbody > tr.p-row-odd:hover {
    background: var(--iggsad-primary-25, #f0f7ff);
  }

  /* Celdas mejoradas */
  .p-datatable-tbody > tr > td {
    padding: var(--iggsad-spacing-xs) var(--iggsad-spacing-sm);
    font-size: 0.8125rem;
    color: var(--iggsad-surface-700);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
    border-bottom: 1px solid var(--iggsad-surface-100);
  }

  /* Columnas congeladas */
  .p-datatable-frozen-column {
    background: inherit !important;
    z-index: 1;
  }

  /* Paginador mejorado */
  .p-paginator {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-top: 2px solid var(--iggsad-surface-200);
    padding: var(--iggsad-spacing-md) var(--iggsad-spacing-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .p-paginator .p-paginator-element {
    color: var(--iggsad-surface-600);
    font-size: 0.875rem;
    min-width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--iggsad-radius-sm);
    transition: all var(--iggsad-transition-fast);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .p-paginator .p-paginator-element:hover:not(.p-disabled) {
    background: var(--iggsad-primary-50);
    color: var(--iggsad-primary-600);
    border-color: var(--iggsad-primary-200);
    transform: translateY(-1px);
  }

  .p-paginator .p-paginator-element.p-highlight {
    background: var(--iggsad-primary-600);
    color: white;
    border-color: var(--iggsad-primary-700);
    box-shadow: var(--iggsad-shadow-sm);
  }

  .p-paginator .p-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* ===== CELDAS ESPECÍFICAS ===== */

/* Celda de expediente */
.expediente-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.expediente-code {
  font-family: var(--iggsad-font-mono);
  background: linear-gradient(135deg, var(--iggsad-primary-50) 0%, var(--iggsad-primary-100) 100%);
  color: var(--iggsad-primary-700);
  padding: 0.25rem 0.5rem;
  border-radius: var(--iggsad-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--iggsad-primary-200);
}

.urgente-badge {
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Celdas de dinero */
.money-cell {
  text-align: right;
  font-family: var(--iggsad-font-mono);
}

.money-amount {
  font-weight: 600;
  font-size: 0.8125rem;
}

.money-high {
  color: #dc2626; /* red-600 */
  background: rgba(220, 38, 38, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: var(--iggsad-radius-sm);
}

.money-medium {
  color: #ea580c; /* orange-600 */
}

.money-low {
  color: #16a34a; /* green-600 */
}

/* Celdas de fecha */
.date-cell {
  font-family: var(--iggsad-font-mono);
}

.date-value {
  font-size: 0.8125rem;
}

.date-recent {
  color: var(--iggsad-surface-700);
  font-weight: 500;
}

.date-medium {
  color: #ea580c; /* orange-600 */
}

.date-old {
  color: #dc2626; /* red-600 */
  font-weight: 600;
}

.date-empty {
  color: var(--iggsad-surface-400);
  font-style: italic;
}

/* Tag de embargo */
.embargo-tag {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Celda de cartera */
.cartera-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.cartera-icon {
  font-size: 0.875rem;
}

.cartera-icon.cartera-a { color: #2563eb; } /* blue-600 */
.cartera-icon.cartera-b { color: #16a34a; } /* green-600 */
.cartera-icon.cartera-c { color: #ea580c; } /* orange-600 */
.cartera-icon.cartera-default { color: var(--iggsad-surface-500); }

.cartera-text {
  font-size: 0.8125rem;
  color: var(--iggsad-surface-700);
}

/* Celda de titular */
.titular-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.titular-icon {
  color: var(--iggsad-surface-500);
  font-size: 0.875rem;
}

.titular-name {
  font-size: 0.8125rem;
  color: var(--iggsad-surface-700);
  font-weight: 500;
}

/* Columna de acciones */
.acciones-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--iggsad-spacing-xs);
}

.action-btn {
  transition: all var(--iggsad-transition-fast);
  border: 1px solid transparent;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-sm);
}

.view-btn:hover {
  background: var(--iggsad-primary-50);
  border-color: var(--iggsad-primary-200);
}

.edit-btn:hover {
  background: var(--iggsad-surface-100);
  border-color: var(--iggsad-surface-300);
}

.menu-btn:hover {
  background: var(--iggsad-surface-100);
  border-color: var(--iggsad-surface-300);
}

/* ===== ESTADOS ESPECIALES ===== */

/* Loading overlay */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--iggsad-spacing-2xl);
  background: rgba(var(--iggsad-surface-50), 0.95);
  backdrop-filter: blur(4px);
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  margin-bottom: var(--iggsad-spacing-md);
}

.loading-text {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--iggsad-spacing-2xl);
  text-align: center;
  background: var(--iggsad-surface-25, #fefefe);
  border-radius: var(--iggsad-radius-lg);
  margin: var(--iggsad-spacing-lg);
}

.empty-icon {
  font-size: 4rem;
  color: var(--iggsad-surface-300);
  margin-bottom: var(--iggsad-spacing-lg);
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--iggsad-surface-600);
  margin: 0 0 var(--iggsad-spacing-sm) 0;
}

.empty-text {
  color: var(--iggsad-surface-500);
  font-size: 0.875rem;
  margin: 0;
  max-width: 24rem;
  line-height: 1.5;
}

/* ===== PAGINADOR PERSONALIZADO ===== */
.paginator-info {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  font-weight: 500;
}

.paginator-actions {
  display: flex;
  gap: var(--iggsad-spacing-xs);
}

/* ===== MENÚ CONTEXTUAL ===== */
:deep(.row-context-menu) {
  border-radius: var(--iggsad-radius-md);
  box-shadow: var(--iggsad-shadow-lg);
  border: 1px solid var(--iggsad-surface-200);
  padding: var(--iggsad-spacing-xs);
}

:deep(.row-context-menu .p-menuitem-link) {
  border-radius: var(--iggsad-radius-sm);
  transition: all var(--iggsad-transition-fast);
}

:deep(.row-context-menu .p-menuitem-link:hover) {
  background: var(--iggsad-primary-50);
  color: var(--iggsad-primary-700);
}

/* ===== DIALOG DE CONFIGURACIÓN ===== */
:deep(.column-config-dialog) {
  .p-dialog-header {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-bottom: 2px solid var(--iggsad-surface-200);
  }

  .p-dialog-content {
    padding: 0;
  }
}

.column-config-content {
  padding: var(--iggsad-spacing-lg);
}

.config-header {
  margin-bottom: var(--iggsad-spacing-lg);
}

.config-header p {
  color: var(--iggsad-surface-600);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.column-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--iggsad-spacing-md);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--iggsad-spacing-md);
  background: var(--iggsad-surface-25, #fefefe);
  border-radius: var(--iggsad-radius-md);
  border: 1px solid var(--iggsad-surface-200);
}

.column-item {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
  padding: var(--iggsad-spacing-sm);
  background: var(--iggsad-surface-white);
  border-radius: var(--iggsad-radius-sm);
  border: 1px solid var(--iggsad-surface-100);
  transition: all var(--iggsad-transition-fast);
}

.column-item:hover {
  border-color: var(--iggsad-primary-200);
  background: var(--iggsad-primary-25, #f0f7ff);
}

.column-label {
  font-size: 0.875rem;
  color: var(--iggsad-surface-700);
  cursor: pointer;
  flex: 1;
}

.config-footer {
  display: flex;
  gap: var(--iggsad-spacing-sm);
  justify-content: flex-end;
  padding: var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-50);
  border-top: 1px solid var(--iggsad-surface-200);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .table-header {
    flex-direction: column;
    gap: var(--iggsad-spacing-md);
    align-items: stretch;
  }

  .table-actions {
    justify-content: center;
  }

  .table-toolbar {
    flex-direction: column;
    gap: var(--iggsad-spacing-sm);
    text-align: center;
  }

  .column-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .expedientes-table-container {
    margin: 0 calc(-1 * var(--iggsad-spacing-sm));
    border-radius: 0;
  }

  .table-header {
    padding: var(--iggsad-spacing-md);
  }

  .table-title {
    font-size: 1.125rem;
  }

  .table-toolbar {
    padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
  }

  /* Simplificar acciones en móvil */
  .acciones-cell {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 0.25rem;
  }

  /* Ocultar columnas menos importantes en móvil */
  :deep(.p-datatable-responsive-stack .column-ap),
  :deep(.p-datatable-responsive-stack .column-ee),
  :deep(.p-datatable-responsive-stack .column-ep),
  :deep(.p-datatable-responsive-stack .column-td),
  :deep(.p-datatable-responsive-stack .column-lo),
  :deep(.p-datatable-responsive-stack .column-gt),
  :deep(.p-datatable-responsive-stack .column-oc) {
    display: none;
  }

  .column-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  :deep(.expedientes-datatable .p-datatable-tbody > tr > td) {
    padding: 0.25rem;
    font-size: 0.75rem;
  }

  .expediente-code {
    font-size: 0.675rem;
    padding: 0.125rem 0.25rem;
  }

  .money-amount,
  .date-value {
    font-size: 0.75rem;
  }

  .table-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--iggsad-spacing-sm);
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
:deep(.p-datatable-tbody > tr:focus-within) {
  outline: 2px solid var(--iggsad-primary-600);
  outline-offset: -2px;
  z-index: 1;
}

:deep(.action-btn:focus-visible) {
  outline: 2px solid var(--iggsad-primary-600);
  outline-offset: 2px;
}

/* ===== MODO OSCURO PREPARADO ===== */
@media (prefers-color-scheme: dark) {
  /* Los tokens CSS se ajustarán automáticamente cuando se implemente modo oscuro */
  .expedientes-table-container {
    /* Las variables --iggsad-* se actualizarán automáticamente */
  }
}

/* ===== MEJORAS DE PERFORMANCE ===== */
:deep(.p-datatable-scrollable-body) {
  /* Mejorar rendimiento del scroll */
  will-change: transform;
  transform: translateZ(0);
}

:deep(.p-datatable-frozen-column) {
  /* Optimizar columnas congeladas */
  will-change: transform;
  transform: translateZ(0);
}

/* ===== ANIMACIONES SUTILES ===== */
.expedientes-table-container {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover en filas con efecto sutil */
:deep(.p-datatable-tbody > tr) {
  position: relative;
}

:deep(.p-datatable-tbody > tr::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, var(--iggsad-primary-25, #f0f7ff) 50%, transparent 100%);
  opacity: 0;
  transition: opacity var(--iggsad-transition-fast);
  pointer-events: none;
}

:deep(.p-datatable-tbody > tr:hover::after) {
  opacity: 0.5;
}

</style>