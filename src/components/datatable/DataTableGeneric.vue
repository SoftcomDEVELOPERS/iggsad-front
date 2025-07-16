<!-- components/datatable/DataTableGeneric.vue -->
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
            :value="pagination.total" 
            severity="info"
            class="total-badge"
          />
          <span class="stats-text">{{ config.meta.name }} encontrados</span>
        </div>
      </div>
      
      <TableActions 
        :config="config"
        :loading="loading"
        :selected-items="internalSelectedItems"
        @refresh="$emit('refresh')"
        @export="$emit('export', $event)"
        @configure="showColumnConfig = true"
        @clear-selection="clearSelection"
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
        v-model:selection="internalSelectedItems"
        :selection-mode="selectionMode"
        :meta-key-selection="false"
        :data-key="config.meta.dataKey"
        :expandable-rows="config.meta.expandable"
        v-model:expanded-rows="internalExpandedRows"
        @page="$emit('page', $event)"
        @sort="handleSort"
        @row-expand="$emit('row-expand', $event)"
        @row-collapse="$emit('row-collapse', $event)"
        @update:selection="handleSelectionChange"
        :pt="tablePassthrough"
        :class="datatableClass"
        :paginator="true"
        :rows="pagination.pageSize || 25"
        :total-records="pagination.total || 0"
        :first="((pagination.page || 1) - 1) * (pagination.pageSize || 25)"
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        current-page-report-template="Mostrando {first} a {last} de {totalRecords} registros"
        :rows-per-page-options="[25, 50, 100, 200]"
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

        <!-- Dynamic Columns -->
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
          <template #body="{ data }">
            <ColumnRenderer 
              :config="col"
              :data="data"
              :value="data[col.field]"
              @action="$emit('cell-action', $event)"
            />
          </template>
        </Column>

        <!-- Actions Column -->
        <Column 
          v-if="hasActions"
          header="Acciones" 
          frozen 
          alignFrozen="right"
          style="width: 7rem"
          class="acciones-column"
        >
          <template #body="{ data }">
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
          </template>
        </Column>

        <!-- Expansion Template -->
        <template #expansion="{ data }" v-if="config.meta.expandable && config.expansion">
          <div class="expanded-row-content">
            <div class="expansion-header">
              <h4 class="expansion-title">
                <i class="pi pi-info-circle"></i>
                Detalles {{ config.meta.title }} {{ data[config.meta.dataKey] }}
              </h4>
            </div>
            
            <div class="expansion-grid">
              <div 
                v-for="section in config.expansion.sections" 
                :key="section.title"
                class="detail-section"
              >
                <h5 class="section-title">{{ section.title }}</h5>
                <div class="detail-grid">
                  <div 
                    v-for="field in section.fields" 
                    :key="field.field"
                    class="detail-item"
                  >
                    <span class="detail-label">{{ field.label }}:</span>
                    <span 
                      class="detail-value" 
                      :class="{ 'money': field.type === 'money' }"
                    >
                      <ColumnRenderer 
                        :config="{ type: field.type || 'text' }"
                        :data="data"
                        :value="data[field.field]"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </DataTable>
    </div>

    <!-- Menu contextual -->
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
            v-if="config.columnConfig?.showAllEnabled"
            label="Mostrar Todas"
            icon="pi pi-check"
            outlined
            @click="showAllColumns"
          />
          <Button
            v-if="config.columnConfig?.basicFields"
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
import { useTableSorting } from '@/composables/datatable/useTableSorting'

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
  'row-expand', 'row-collapse', 'action', 'cell-action', 'selection-change'
])

// Composables
const { showSuccess, showWarn } = useToast()
const { multiSortMeta, onSort } = useTableSorting(props.config, props, emit)

// Referencias
const rowMenu = ref()

// Estados locales simplificados
const showColumnConfig = ref(false)
const rowMenuItems = ref([])
const internalSelectedItems = ref([...props.selectedItems])
const internalExpandedRows = ref([...props.expandedRows])

// Columnas
const allColumns = ref([...props.config.columns])
const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible)
})

// Computed properties
const containerClass = computed(() => 
  props.config.classes?.container || COMMON_TABLE_CLASSES.container
)

const datatableClass = computed(() => [
  props.config.classes?.datatable || COMMON_TABLE_CLASSES.datatable,
  `${props.config.meta.name}-datatable`
])

const selectionMode = computed(() => 
  props.config.meta.selectable ? 'checkbox' : null
)

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

// Métodos
const getColumnClass = (col) => {
  return COMMON_TABLE_HELPERS.getColumnClass(col)
}

const handleSort = (e) => {
  onSort(e) 
}

const handleSelectionChange = (selection) => {
  internalSelectedItems.value = selection
  emit('selection-change', selection)
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

// Métodos de configuración de columnas
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

// Método para limpiar selección
const clearSelection = () => {
  internalSelectedItems.value = []
  emit('selection-change', [])
}

// Watchers
watch(() => props.selectedItems, (newSelection) => {
  internalSelectedItems.value = [...newSelection]
}, { deep: true })

watch(() => props.expandedRows, (newExpanded) => {
  internalExpandedRows.value = [...newExpanded]
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
</style>