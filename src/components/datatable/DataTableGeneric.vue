<!-- components/datatable/DataTableGeneric.vue - SOLO AGREGANDO COMPOSABLES -->
<template>
  <div :class="containerClass">
    
    <!-- Header de la tabla -->
    <div class="table-header">
      <div class="table-title-section">
        <h3 class="table-title">
          <i :class="config.meta.icon" class="table-title-icon"></i>
          {{ config.meta.title }}
        </h3>
        <div class="table-stats">
          <Badge 
            :value="pagination.total || 0" 
            severity="info"
            class="total-badge"
          />
          <span class="stats-text">{{ config.meta.name }} encontrados</span>
        </div>
      </div>
      
      <TableActions 
        :config="config"
        :loading="loading"
        :selected-items="composableSelectedItems"
        @refresh="refreshTable"
        @export="exportToExcel"
        @configure="showColumnConfig = true"
        @clear-selection="composableClearSelection"
        @export-selection="$emit('export-selection', $event)"
        @bulk-email="$emit('bulk-email', $event)"
      />
    </div>

    <!-- Tabla principal -->
    <div class="table-wrapper">
      <DataTable
        :value="data"
        :loading="loading"
        :lazy="true"
        v-model:selection="composableSelectedItems"
        :selection-mode="selectionMode"
        :meta-key-selection="false"
        :data-key="config.meta.dataKey"
        :expandable-rows="config.meta.expandable"
        v-model:expanded-rows="composableExpandedRows"
        @page="onPage"
        @sort="handleSort"
        @row-expand="onRowExpand"
        @row-collapse="onRowCollapse"
        @update:selection="composableOnSelectionChange"
        :pt="tablePassthrough"
        :class="datatableClass"
        :paginator="true"
        :rows="selectedPageSize"
        :total-records="pagination.total || 0"
        :first="((pagination.page || 1) - 1) * selectedPageSize"
        :paginator-template="paginationConfig.template"
        :current-page-report-template="paginationConfig.currentPageReportTemplate"
        :rows-per-page-options="pageSizeValues"
        @update:rows="onPageSizeChange"
        :resizable-columns="config.meta.resizableColumns !== false"
        column-resize-mode="fit"
        :striped-rows="config.meta.stripedRows !== false"
        :show-gridlines="config.meta.showGridlines !== false"
        :scrollable="config.meta.scrollable === true"
        :scroll-height="config.meta.scrollHeight || '600px'"
        :sort-mode="config.meta.sortMode || 'multiple'"
        :multi-sort-meta="multiSortMeta"
        :removable-sort="config.meta.removableSort !== false"
        :size="config.meta.size || 'small'"
      >
        
        <!-- Loading template -->
        <template #loading>
          <div class="loading-overlay">
            <ProgressSpinner class="loading-spinner" />
            <p class="loading-text">Cargando {{ config.meta.name }}...</p>
          </div>
        </template>

        <!-- Empty state -->
        <template #empty>
          <div class="empty-state">
            <i class="pi pi-folder-open empty-icon"></i>
            <h4 class="empty-title">No se encontraron {{ config.meta.name }}</h4>
            <p class="empty-text">
              Ajuste los filtros de búsqueda o intente con otros criterios
            </p>
          </div>
        </template>

        <!-- Expansion Toggle -->
        <Column 
          v-if="config.meta.expandable"
          expander 
          style="width: 3rem"
          frozen
          class="expand-column"
        />

        <!-- Selection Column -->
        <Column
          v-if="config.meta.selectable"
          selection-mode="multiple"
          style="width: 3rem"
          frozen
          class="selection-column"
        />

        <!-- Dynamic Columns - MANTENER EXACTAMENTE COMO ESTABA -->
        <Column
          v-for="col in visibleColumns"
          :key="col.field"
          :field="col.field"
          :header="col.label || col.header"
          :sortable="col.sortable !== false"
          :frozen="col.frozen"
          :style="col.style"
          :class="getColumnClass(col)"
          resizable
        >
          <template #body="{ data }">
            <ColumnRenderer 
              :config="col"
              :value="data[col.field]"
              :data="data"
            />
          </template>
        </Column>

        <!-- Actions Column - AÑADIR MENU CONTEXTUAL -->
        <Column
          v-if="hasActions"
          header="Acciones"
          style="width: 8rem"
          frozen
          align-frozen="right"
          class="acciones-column"
        >
          <template #body="{ data }">
            <div class="flex gap-1 justify-center">
              <!-- Botones de acciones directas -->
              <div class="acciones-cell">
                <Button
                  v-for="(action, key) in enabledActions"
                  :key="key"
                  :icon="action.icon"
                  text
                  rounded
                  size="small"
                  :severity="action.severity || 'secondary'"
                  v-tooltip.top="action.tooltip"
                  @click.stop="handleAction(key, data)"
                  :class="action.class"
                />
              </div>
              
              <!-- Botón de menú contextual -->
              <Button
                v-if="config.contextMenu && config.contextMenu.length > 0"
                icon="pi pi-ellipsis-v"
                text
                rounded
                severity="secondary"
                size="small"
                class="action-btn"
                @click="toggleRowMenu($event, data)"
                v-tooltip.top="'Más opciones'"
              />
            </div>
          </template>
        </Column>
        <!-- AÑADIR TEMPLATE DE EXPANSIÓN QUE YA EXISTE -->
        <template #expansion="slotProps" v-if="config.meta.expandable">
          <div class="expanded-row-content">
            <div class="expansion-header">
              <h3 class="expansion-title">
                <i class="pi pi-folder-open"></i>
                Detalles del Expediente {{ slotProps.data.numero }}
              </h3>
            </div>
            
            <div class="expansion-grid">
              <div v-for="section in config.expansion?.sections || []" :key="section.title" class="detail-section">
                <h4 class="section-title">{{ section.title }}</h4>
                <div class="detail-grid">
                  <div v-for="field in section.fields" :key="field.field" class="detail-item">
                    <span class="detail-label">{{ field.label }}:</span>
                    <span class="detail-value" :class="{ money: field.type === 'money' }">
                      <template v-if="field.type === 'money'">
                        {{ formatCurrency(slotProps.data[field.field]) }}
                      </template>
                      <template v-else-if="field.type === 'date'">
                        {{ formatDate(slotProps.data[field.field]) }}
                      </template>
                      <template v-else>
                        {{ slotProps.data[field.field] || 'N/A' }}
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        
      </DataTable>
    </div>

    <!-- Menú contextual -->
    <Menu 
      ref="rowMenu" 
      :model="rowMenuItems" 
      popup 
    />
    
    <!-- Dialog de configuración de columnas -->
    <Dialog
      v-model:visible="showColumnConfig"
      header="Configurar Columnas"
      modal
      style="width: 600px"
    >
      <div class="column-config-content">
        <div class="mb-4">
          <Button
            label="Mostrar Todas"
            icon="pi pi-eye"
            size="small"
            @click="showAllColumns"
            class="mr-2"
          />
          <Button
            label="Solo Básicas"
            icon="pi pi-eye-slash"
            size="small"
            @click="showBasicColumns"
          />
        </div>
        
        <div class="columns-list">
          <div
            v-for="col in allColumns"
            :key="col.field"
            class="column-item"
          >
            <Checkbox
              v-model="col.visible"
              :input-id="col.field"
              binary
            />
            <label :for="col.field" class="ml-2">
              {{ col.label || col.header }}
            </label>
          </div>
        </div>
      </div>
      
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="showColumnConfig = false"
        />
        <Button
          label="Aplicar"
          icon="pi pi-check"
          @click="applyColumnConfig"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Menu from 'primevue/menu'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import ProgressSpinner from 'primevue/progressspinner'
import ColumnRenderer from './ColumnRenderer.vue'
import TableActions from './TableActions.vue'
import { COMMON_TABLE_PT, COMMON_TABLE_CLASSES, COMMON_TABLE_HELPERS } from '@/constants/datatableConfig/commonTableConfig'
import { useToast } from '@/composables/useToast'

// 🔥 USAR TODOS LOS COMPOSABLES - SIN CAMBIAR NADA MÁS
import { useTableSorting } from '@/composables/datatable/useTableSorting'
import { useTablePagination } from '@/composables/datatable/useTablePagination'
import { useTableSelection } from '@/composables/datatable/useTableSelection'
import { useTableData } from '@/composables/datatable/useTableData'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({ page: 1, pageSize: 25, total: 0, totalPages: 0 })
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  expandedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'page', 'sort', 'refresh', 'export', 'export-selection', 'bulk-email',
  'row-expand', 'row-collapse', 'action', 'cell-action', 'selection-change',
  'page-size-change'
])

// Composables
const { showSuccess, showWarn } = useToast()

// 🔥 USAR TODOS LOS COMPOSABLES
const { multiSortMeta, onSort } = useTableSorting(props.config, props, emit)

const { 
  selectedPageSize,
  paginationConfig,
  paginationInfo,
  onPage,
  onPageSizeChange,
  pageSizeValues
} = useTablePagination(props.config, props, emit)

const {
  selectedItems: composableSelectedItems,
  selectionMode,
  selectionInfo,
  onSelectionChange: composableOnSelectionChange,
  clearSelection: composableClearSelection,
  selectAll,
  selectUrgent
} = useTableSelection(props.config, props, emit)

const {
  expandedRows: composableExpandedRows,
  allColumns,
  visibleColumns,
  onRowExpand,
  onRowCollapse,
  refreshTable,
  exportToExcel
} = useTableData(props.config, props, emit)

// Referencias
const rowMenu = ref()

// Estados locales simplificados - MANTENER PARA COMPATIBILIDAD
const showColumnConfig = ref(false)
const rowMenuItems = ref([])

// 🔥 USAR ESTADO DE LOS COMPOSABLES 
// Sincronizar con props pero usar los composables como fuente de verdad

// Computed properties - MANTENER EXACTAMENTE IGUAL
const containerClass = computed(() => 
  props.config.classes?.container || COMMON_TABLE_CLASSES.container
)

const datatableClass = computed(() => [
  props.config.classes?.datatable || COMMON_TABLE_CLASSES.datatable,
  `${props.config.meta.name}-datatable`
])

const hasActions = computed(() => 
  Object.values(props.config.actions || {}).some(action => action.enabled)
)

const enabledActions = computed(() => 
  Object.fromEntries(
    Object.entries(props.config.actions || {})
      .filter(([_, action]) => action.enabled)
  )
)

const tablePassthrough = computed(() => ({
  ...COMMON_TABLE_PT,
  ...props.config.pt
}))

// Métodos - MANTENER EXACTAMENTE IGUAL
const getColumnClass = (col) => {
  return COMMON_TABLE_HELPERS.getColumnClass(col)
}

const handleSort = (e) => {
  onSort(e) 
}

const handleSelectionChange = (selection) => {
  // Los composables ya manejan esto
  console.log('🎯 Selección manejada por composables:', selection.length)
}

const handleAction = (actionKey, data) => {
  if (actionKey === 'menu') {
    toggleRowMenu(event, data)
  } else {
    emit('action', { action: actionKey, data })
  }
}

const toggleRowMenu = (event, data) => {
  rowMenuItems.value = getRowMenuItems(data)
  rowMenu.value.toggle(event)
}

const getRowMenuItems = (data) => {
  return props.config.contextMenu?.map(item => ({
    ...item,
    command: item.separator ? undefined : () => {
      if (item.action === 'view') {
        emit('action', { action: 'view', data })
      } else if (item.action === 'edit') {
        emit('action', { action: 'edit', data })
      } else {
        showWarn('Función en desarrollo', `${item.label} estará disponible próximamente`)
      }
    }
  })) || []
}

// Métodos de configuración de columnas - MANTENER IGUAL
const showAllColumns = () => {
  allColumns.value.forEach(col => col.visible = true)
}

const showBasicColumns = () => {
  const basicFields = props.config.columnConfig?.basicFields || []
  allColumns.value.forEach(col => {
    col.visible = basicFields.includes(col.field)
  })
}

const applyColumnConfig = () => {
  showColumnConfig.value = false
  showSuccess('Configuración aplicada', 'Las columnas se han actualizado correctamente')
}

// Método para limpiar selección - MANTENER PARA COMPATIBILIDAD
const clearSelection = () => {
  composableClearSelection()
}

// Métodos de formateo para expansión (usar los que ya existen)
const formatCurrency = (value) => {
  if (value == null || value === '') return '-'
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

// Sincronizar composables con props cuando cambien
watch(() => props.selectedItems, (newSelection) => {
  if (JSON.stringify(composableSelectedItems.value) !== JSON.stringify(newSelection)) {
    composableSelectedItems.value = [...newSelection]
  }
}, { deep: true })

watch(() => props.expandedRows, (newExpanded) => {
  if (JSON.stringify(composableExpandedRows.value) !== JSON.stringify(newExpanded)) {
    composableExpandedRows.value = [...newExpanded]
  }
}, { deep: true })
</script>

<style>
/* 
 * IMPORTANTE: Los estilos principales están en datatable.css
 * Este archivo solo contiene estilos específicos del componente
 */

/* Asegurar que el componente funcione correctamente */
.datatable-generic-container {
  /* Los estilos se cargan desde datatable.css */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-text {
  margin-top: var(--iggsad-spacing-md);
  color: var(--iggsad-surface-600);
  font-weight: var(--iggsad-font-medium);
}

.empty-state {
  text-align: center;
  padding: var(--iggsad-spacing-xl);
  color: var(--iggsad-surface-500);
}

.empty-icon {
  font-size: 3rem;
  color: var(--iggsad-surface-300);
  margin-bottom: var(--iggsad-spacing-md);
}

.column-config-content {
  max-height: 400px;
  overflow-y: auto;
}

.columns-list {
  display: flex;
  flex-direction: column;
  gap: var(--iggsad-spacing-sm);
}

.column-item {
  display: flex;
  align-items: center;
  padding: var(--iggsad-spacing-sm);
  border-radius: var(--iggsad-radius-md);
  transition: background-color var(--iggsad-transition-fast);
}

.column-item:hover {
  background: var(--iggsad-surface-50);
}
</style>