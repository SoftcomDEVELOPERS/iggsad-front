<!-- src/components/expedientes/ExpedientesTable.vue - VERSIÓN FINAL -->
<template>
  <div class="expedientes-table-container">
    
    <!-- Header de la tabla -->
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
          v-tooltip.top="'Actualizar resultados'"
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
          v-tooltip.top="'Exportar a Excel'"
          @click="exportToExcel"
          class="action-button"
        />
        <Button
          icon="pi pi-cog"
          outlined
          size="small"
          severity="secondary"
          v-tooltip.top="'Configurar columnas'"
          @click="showColumnConfig = true"
          class="action-button"
        />
      </div>
    </div>

    <!-- Tabla principal -->
    <div class="table-wrapper">
      <DataTable
        :value="expedientes"
        :loading="loading"
        :lazy="true"
        @page="onPage"
        @sort="onSort"
        @row-click="onRowClick"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        :totalRecords="pagination.total"
        :first="(pagination.page - 1) * pagination.pageSize"
        :rows="pagination.pageSize"
        v-model:expandedRows="expandedRows"
        v-model:selection="selectedExpedientes"
        class="expedientes-datatable"
        scrollable
        scrollHeight="600px"
        sortMode="multiple"
        :multiSortMeta="multiSortMeta"
        removableSort
        stripedRows
        size="small"
        selectionMode="multiple"
        dataKey="numero"
        resizableColumns
        :pt="{
          root: 'expedientes-table-root',
          header: 'expedientes-table-header',
          body: 'expedientes-table-body',
          row: 'expedientes-table-row'
        }"
      >
        <!-- Loading template -->
        <template #loading>
          <div class="loading-overlay">
            <ProgressSpinner class="loading-spinner" />
            <p class="loading-text">Cargando expedientes...</p>
          </div>
        </template>

        <!-- Empty state -->
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-folder-open empty-icon"></i>
            <h4 class="empty-title">No se encontraron expedientes</h4>
            <p class="empty-text">
              Ajuste los filtros de búsqueda o intente con otros criterios
            </p>
          </div>
        </template>

        <!-- Columna de expansión -->
        <Column 
          expander 
          style="width: 3rem"
          frozen
          class="expand-column"
        />

        <!-- Columna de selección -->
        <Column 
          selectionMode="multiple" 
          style="width: 3rem"
          frozen
          class="selection-column"
        />

        <!-- Columnas dinámicas -->
        <Column
          v-for="col in visibleColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable !== false"
          :frozen="col.frozen"
          :style="col.style"
          :class="getColumnClass(col)"
          resizable
        >
          <!-- Template para expediente -->
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

          <!-- Template para dinero -->
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

          <!-- Template para titular -->
          <template #body="{ data }" v-if="col.field === 'nombreTitular'">
            <div class="titular-cell">
              <i class="pi pi-user titular-icon"></i>
              <span class="titular-name">{{ data.nombreTitular }}</span>
            </div>
          </template>
        </Column>

        <!-- Columna de acciones -->
        <Column 
          header="Acciones" 
          frozen 
          alignFrozen="right"
          style="width: 7rem"
          class="acciones-column"
        >
          <template #body="{ data }">
            <div class="acciones-cell">
              <Button
                icon="pi pi-eye"
                text
                rounded
                size="small"
                severity="info"
                v-tooltip.top="'Ver expediente'"
                @click.stop="viewExpediente(data)"
                class="action-btn view-btn"
              />
              <Button
                icon="pi pi-pencil"
                text
                rounded
                size="small"
                severity="secondary"
                v-tooltip.top="'Editar expediente'"
                @click.stop="editExpediente(data)"
                class="action-btn edit-btn"
              />
              <Button
                icon="pi pi-ellipsis-v"
                text
                rounded
                size="small"
                severity="secondary"
                v-tooltip.top="'Más opciones'"
                @click.stop="toggleRowMenu($event, data)"
                class="action-btn menu-btn"
              />
            </div>
          </template>
        </Column>

        <!-- Template de expansión -->
        <template #expansion="{ data }">
          <div class="expanded-row-content">
            <div class="expansion-header">
              <h4 class="expansion-title">
                <i class="pi pi-info-circle"></i>
                Detalles del Expediente {{ data.numero }}
              </h4>
            </div>
            
            <div class="expansion-grid">
              <div class="detail-section">
                <h5 class="section-title">Información Procesal</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Autos:</span>
                    <span class="detail-value">{{ data.autos || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Auto Monitorio:</span>
                    <span class="detail-value">{{ data.autoMonitorio || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">F. Presentación:</span>
                    <span class="detail-value">{{ formatDate(data.fechaPresentacion) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">F. Admisión:</span>
                    <span class="detail-value">{{ formatDate(data.fechaAdmision) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h5 class="section-title">Información Financiera</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Costas:</span>
                    <span class="detail-value money">{{ formatCurrency(data.costas) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ing. Judicial:</span>
                    <span class="detail-value money">{{ formatCurrency(data.ingJud) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Ing. Extrajudicial:</span>
                    <span class="detail-value money">{{ formatCurrency(data.ingExj) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Últ. F. Cobro:</span>
                    <span class="detail-value">{{ formatDate(data.ultFecCobro) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h5 class="section-title">Códigos Adicionales</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">LO:</span>
                    <span class="detail-value">{{ data.lo || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">GT:</span>
                    <span class="detail-value">{{ data.gt || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">OC:</span>
                    <span class="detail-value">{{ data.oc || 'N/A' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">TD:</span>
                    <span class="detail-value">{{ data.td || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Paginador personalizado -->
    <div class="custom-paginator" v-if="expedientes.length > 0">
      <div class="paginator-left">
        <span class="showing-text">
          Mostrando {{ ((pagination.page - 1) * pagination.pageSize) + 1 }} - 
          {{ Math.min(pagination.page * pagination.pageSize, pagination.total) }} de {{ pagination.total }}
        </span>
        <div class="selection-info" v-if="selectedExpedientes.length > 0">
          <Badge :value="selectedExpedientes.length" severity="info" />
          <span>seleccionados</span>
        </div>
      </div>
      
      <div class="paginator-center">
        <Button
          icon="pi pi-angle-double-left"
          text
          :disabled="pagination.page === 1"
          @click="goToFirstPage"
          v-tooltip.top="'Primera página'"
          class="paginator-btn"
        />
        <Button
          icon="pi pi-angle-left"
          text
          :disabled="pagination.page === 1"
          @click="goToPreviousPage"
          v-tooltip.top="'Página anterior'"
          class="paginator-btn"
        />
        
        <span class="page-info">
          Página {{ pagination.page }} de {{ Math.ceil(pagination.total / pagination.pageSize) }}
        </span>
        
        <Button
          icon="pi pi-angle-right"
          text
          :disabled="pagination.page === Math.ceil(pagination.total / pagination.pageSize)"
          @click="goToNextPage"
          v-tooltip.top="'Página siguiente'"
          class="paginator-btn"
        />
        <Button
          icon="pi pi-angle-double-right"
          text
          :disabled="pagination.page === Math.ceil(pagination.total / pagination.pageSize)"
          @click="goToLastPage"
          v-tooltip.top="'Última página'"
          class="paginator-btn"
        />
      </div>
      
      <div class="paginator-right">
        <Dropdown
          v-model="selectedPageSize"
          :options="pageSizeOptions"
          option-label="label"
          option-value="value"
          placeholder="Filas"
          class="page-size-dropdown"
          @change="onPageSizeChange"
        />
      </div>
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

const emit = defineEmits(['page', 'sort', 'view-expediente', 'refresh', 'export', 'page-size-change', 'row-expand', 'row-collapse'])

// Composables
const { showSuccess, showWarn, showError } = useToast()

// Referencias
const rowMenu = ref()

// Estado local
const showColumnConfig = ref(false)
const selectedPageSize = ref(50)
const expandedRows = ref({})
const selectedExpedientes = ref([])
const multiSortMeta = ref([])

// Opciones de tamaño de página
const pageSizeOptions = [
  { label: '25 filas', value: 25 },
  { label: '50 filas', value: 50 },
  { label: '100 filas', value: 100 },
  { label: '200 filas', value: 200 }
]

// Helpers de formato
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

// Definición de columnas
const allColumns = ref([
  { 
    field: 'numero', 
    header: 'Expediente', 
    style: { 'min-width': '120px' }, 
    frozen: true,
    visible: true,
    sortable: true
  },
  { 
    field: 'ap', 
    header: 'A.P.', 
    style: { 'min-width': '60px' },
    visible: true,
    sortable: true
  },
  { 
    field: 'ee', 
    header: 'EE', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'ep', 
    header: 'EP', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'sub', 
    header: 'Sub.', 
    style: { 'min-width': '60px' },
    visible: true,
    sortable: true
  },
  { 
    field: 'td', 
    header: 'TD', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'cartera', 
    header: 'Cartera', 
    style: { 'min-width': '100px' },
    visible: true,
    sortable: true
  },
  { 
    field: 'nombreTitular', 
    header: 'Nombre Titular', 
    style: { 'min-width': '200px' },
    visible: true,
    sortable: true
  },
  { 
    field: 'autos', 
    header: 'Autos', 
    style: { 'min-width': '80px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'autosVerbOrd', 
    header: 'AutosVerbOrd', 
    style: { 'min-width': '120px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'autoMonitorio', 
    header: 'AutoMonitorio', 
    style: { 'min-width': '120px' },
    visible: false,
    sortable: true
  },
  {
    field: 'fechaEnvio',
    header: 'F. Envío',
    style: { 'min-width': '90px' },
    visible: true,
    sortable: true
  },
  {
    field: 'fechaPresentacion',
    header: 'F. Presentación',
    style: { 'min-width': '110px' },
    visible: false,
    sortable: true
  },
  {
    field: 'fechaAdmision',
    header: 'F. Admisión',
    style: { 'min-width': '100px' },
    visible: false,
    sortable: true
  },
  {
    field: 'ultFechaAgJud',
    header: 'Últ. F. Ag. Jud.',
    style: { 'min-width': '120px' },
    visible: true,
    sortable: true
  },
  {
    field: 'ultFechaGesExp',
    header: 'Últ. F. Ges. Exp.',
    style: { 'min-width': '130px' },
    visible: true,
    sortable: true
  },
  { 
    field: 'embargos', 
    header: 'Embargos', 
    style: { 'min-width': '80px' },
    visible: true,
    sortable: true
  },
  {
    field: 'ultFecCobro',
    header: 'Últ. F. Cobro',
    style: { 'min-width': '110px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'lo', 
    header: 'LO', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'gt', 
    header: 'GT', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  { 
    field: 'oc', 
    header: 'OC', 
    style: { 'min-width': '50px' },
    visible: false,
    sortable: true
  },
  {
    field: 'principal',
    header: 'Principal',
    style: { 'min-width': '100px', 'text-align': 'right' },
    visible: true,
    sortable: true
  },
  {
    field: 'intereses',
    header: 'Intereses',
    style: { 'min-width': '100px', 'text-align': 'right' },
    visible: true,
    sortable: true
  },
  {
    field: 'costas',
    header: 'Costas',
    style: { 'min-width': '90px', 'text-align': 'right' },
    visible: false,
    sortable: true
  },
  {
    field: 'ingJud',
    header: 'Ing. Judicial',
    style: { 'min-width': '110px', 'text-align': 'right' },
    visible: false,
    sortable: true
  },
  {
    field: 'ingExj',
    header: 'Ing. Extrajudicial',
    style: { 'min-width': '130px', 'text-align': 'right' },
    visible: false,
    sortable: true
  }
])

// Computed para columnas visibles
const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible)
})

// Métodos auxiliares
const isMoneyColumn = (field) => {
  return ['principal', 'intereses', 'costas', 'ingJud', 'ingExj'].includes(field)
}

const isDateColumn = (field) => {
  return field.includes('fecha') || field.includes('Fec')
}

const isUrgent = (data) => {
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
const onPage = (e) => {
  emit('page', e.page + 1)
}

const onSort = (e) => {
  multiSortMeta.value = e.multiSortMeta
  emit('sort', e)
}

// Click en fila: expande y selecciona
const onRowClick = (e) => {
  // Expandir/colapsar
  const isExpanded = expandedRows.value[e.data.numero]
  if (isExpanded) {
    delete expandedRows.value[e.data.numero]
    onRowCollapse(e)
  } else {
    expandedRows.value[e.data.numero] = true
    onRowExpand(e)
  }
  
  // Seleccionar/deseleccionar
  const isSelected = selectedExpedientes.value.find(item => item.numero === e.data.numero)
  if (isSelected) {
    selectedExpedientes.value = selectedExpedientes.value.filter(item => item.numero !== e.data.numero)
  } else {
    selectedExpedientes.value = [...selectedExpedientes.value, e.data]
  }
}

const onRowExpand = (e) => {
  emit('row-expand', e.data)
}

const onRowCollapse = (e) => {
  emit('row-collapse', e.data)
}

const onPageSizeChange = () => {
  emit('page-size-change', selectedPageSize.value)
}

const refreshTable = () => {
  emit('refresh')
}

const exportToExcel = () => {
  emit('export', 'excel')
}

// Métodos de paginación
const goToFirstPage = () => {
  emit('page', 1)
}

const goToPreviousPage = () => {
  if (props.pagination.page > 1) {
    emit('page', props.pagination.page - 1)
  }
}

const goToNextPage = () => {
  const maxPage = Math.ceil(props.pagination.total / props.pagination.pageSize)
  if (props.pagination.page < maxPage) {
    emit('page', props.pagination.page + 1)
  }
}

const goToLastPage = () => {
  const lastPage = Math.ceil(props.pagination.total / props.pagination.pageSize)
  emit('page', lastPage)
}

// Ver expediente: emite evento para abrir drawer
const viewExpediente = (data) => {
  emit('view-expediente', data)
}

const editExpediente = (data) => {
  console.log('Editar expediente:', data)
}

const toggleRowMenu = (event, data) => {
  rowMenuItems.value = getRowMenuItems(data)
  rowMenu.value.toggle(event)
}

// Menú contextual
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

<style src="@/styles/expediente-table.css">

</style>