<template>
  <div :class="containerClass">
    
    <!-- ===== HEADER DE LA TABLA ===== -->
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
        :selected-items="selectedItems"
        @refresh="handleRefresh"
        @export="handleExport"
        @configure="openColumnConfig"
        @clear-selection="clearSelection"
        @export-selection="$emit('export-selection', $event)"
        @bulk-email="$emit('bulk-email', $event)"
      />
    </div>

    <!-- ===== TABLA PRINCIPAL ===== -->
    <div class="table-wrapper">
      <DataTable
        :value="data"
        :loading="loading"
        :lazy="true"
        v-model:selection="selectedItems"
        :selection-mode="selectionMode"
        :meta-key-selection="false"
        :data-key="config.meta.dataKey"
        :expandable-rows="config.meta.expandable"
        v-model:expanded-rows="expandedRowsLocal"
        v-model:multiSortMeta="multiSortMeta"
        :sort-mode="config.meta.sortMode || 'multiple'"
        :removable-sort="config.meta.removableSort"
        @page="onPage"
        @sort="onSort"
        @row-expand="$emit('row-expand', $event)"
        @row-collapse="$emit('row-collapse', $event)"
        @update:selection="$emit('selection-change', $event)"
        :pt="tablePassthrough"
        :class="datatableClass"
        :paginator="true"
        :rows="selectedPageSize"
        :total-records="pagination.total || 0"
        :first="((pagination.page || 1) - 1) * selectedPageSize"
        :paginator-template="paginationConfig.template"
        :current-page-report-template="paginationConfig.currentPageReportTemplate"
        :rows-per-page-options="pageSizeValues"
        @update:rows="handlePageSizeUpdate"
        :resizable-columns="config.meta.resizableColumns"
        :scrollable="config.meta.scrollable"
        :scroll-height="config.meta.scrollHeight"
        :size="config.meta.size"
        :striped-rows="config.meta.stripedRows"
        :show-gridlines="config.meta.showGridlines"
      >
        
        <!-- ===== COLUMNA DE EXPANSIÓN ===== -->
        <Column 
          v-if="config.meta.expandable"
          :expander="true" 
          header-style="width: 3rem"
          :pt="{ root: 'expand-column' }"
        />
        
        <!-- ===== COLUMNA DE SELECCIÓN ===== -->
        <Column 
          v-if="config.meta.selectable"
          selection-mode="multiple" 
          header-style="width: 3rem"
          :pt="{ root: 'selection-column' }"
        />
        
        <!-- ===== COLUMNAS DINÁMICAS ===== -->
        <Column
          v-for="column in visibleColumns"
          :key="column.field"
          :field="column.field"
          :header="column.header"
          :sortable="column.sortable"
          :style="column.style"
          :frozen="column.frozen"
          :class="column.class"
        >
          <template #body="slotProps">
            <ColumnRenderer 
              :config="column"
              :data="slotProps.data"
              :value="slotProps.data[column.field]"
              @cell-action="handleCellAction"
            />
          </template>
        </Column>
        
        <!-- ===== COLUMNA DE ACCIONES ===== -->
        <Column 
          v-if="config.actions && Object.keys(config.actions).length > 0"
          header="Acciones" 
          :style="{ 'min-width': '120px' }"
          :pt="{ root: 'acciones-column' }"
        >
          <template #body="slotProps">
            <div class="action-buttons">
              <Button
                v-for="(action, key) in enabledActions"
                :key="key"
                :icon="action.icon"
                :severity="action.severity"
                :class="action.class"
                :tooltip="action.tooltip"
                size="small"
                text
                @click="handleAction(key, slotProps.data)"
              />
              <!-- ✅ BOTÓN MENÚ CONTEXTUAL COMO ESTABA ANTES -->
              <Button
                v-if="config.contextMenu && config.contextMenu.length > 0"
                icon="pi pi-ellipsis-v"
                text
                rounded
                severity="secondary"
                size="small"
                class="action-btn"
                @click="toggleRowMenu($event, slotProps.data)"
                v-tooltip.top="'Más opciones'"
              />
            </div>
          </template>
        </Column>
        
        <!-- ===== TEMPLATE DE EXPANSIÓN ===== -->
        <template #expansion="slotProps" v-if="config.expansion?.enabled">
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
                <h4 class="section-title">{{ section.title }}</h4>
                <div class="detail-grid">
                  <div 
                    v-for="field in section.fields" 
                    :key="field.field"
                    class="detail-item"
                  >
                    <span class="detail-label">{{ field.label }}:</span>
                    <span class="detail-value">
                      <ColumnRenderer 
                        :config="field"
                        :data="slotProps.data"
                        :value="slotProps.data[field.field]"
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

    <!-- ===== MENÚ CONTEXTUAL ===== -->
    <Menu 
      ref="rowMenu" 
      :model="rowMenuItems"
      popup />

    <!-- ===== CONFIGURADOR DE COLUMNAS ===== -->
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
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import Menu from 'primevue/menu'
import ColumnRenderer from './ColumnRenderer.vue'
import TableActions from './TableActions.vue'
import { COMMON_TABLE_PT, COMMON_TABLE_CLASSES } from '@/constants/datatableConfig/commonTableConfig'
import { useToast } from '@/composables/useToast'

// ✅ SOLO LOS COMPOSABLES ESPECIALIZADOS - SIN DUPLICACIONES
import { useTableSorting } from '@/composables/datatable/useTableSorting'
import { useTablePagination } from '@/composables/datatable/useTablePagination'


// ===== PROPS Y EMITS =====
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

const rowMenuItems = ref([])

// ===== COMPOSABLES =====
const { showSuccess, showWarn } = useToast()

// ✅ Composable de ordenación
const { multiSortMeta, onSort } = useTableSorting(props.config, props, emit)

// ✅ Composable de paginación - ÚNICA FUENTE DE VERDAD
const { 
  selectedPageSize,
  paginationConfig,
  paginationInfo,
  pageSizeValues,
  onPage,
  onPageSizeChange,
  handlePageSizeUpdate
} = useTablePagination(props.config, props, emit)


// ===== ESTADO LOCAL =====
const selectedItems = ref([...props.selectedItems])
const expandedRowsLocal = ref([...props.expandedRows])
const showColumnConfig = ref(false)
const rowMenu = ref(null)

// ✅ MODO DE SELECCIÓN
const selectionMode = computed(() => 
  props.config.meta.selectable ? 'checkbox' : null
)

// ✅ FUNCIÓN LIMPIAR SELECCIÓN
const clearSelection = () => {
  selectedItems.value = []
  emit('selection-change', [])
}

// ===== CONFIGURADOR DE COLUMNAS =====
const allColumns = ref([...props.config.columns])
const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible)
})

// Funciones del configurador de columnas
const showAllColumns = () => {
  allColumns.value.forEach(col => {
    col.visible = true
  })
}

const showBasicColumns = () => {
  const basicFields = props.config.columnConfig?.basicFields || []
  allColumns.value.forEach(col => {
    col.visible = basicFields.includes(col.field)
  })
}

// ===== ACCIONES =====
const enabledActions = computed(() => {
  const actions = props.config.actions || {}
  return Object.fromEntries(
    Object.entries(actions).filter(([key, action]) => action.enabled !== false)
  )
})

// ===== ESTILOS Y CLASES =====
const containerClass = computed(() => {
  return [
    props.config.classes?.container || COMMON_TABLE_CLASSES.container,
    'datatable-generic-container'
  ].join(' ')
})

const datatableClass = computed(() => {
  return [
    props.config.classes?.datatable || COMMON_TABLE_CLASSES.datatable,
    'datatable-generic'
  ].join(' ')
})

const tablePassthrough = computed(() => ({
  ...COMMON_TABLE_PT,
  ...props.config.pt
}))

// ===== MANEJADORES DE EVENTOS =====

// Refrescar tabla
const handleRefresh = () => {
  emit('refresh')
}

// Exportar
const handleExport = (format) => {
  emit('export', format)
}


// Acciones de botones
const handleAction = (action, data) => {
  emit('action', { action, data })
}

// Acciones de celdas
const handleCellAction = (event) => {
  emit('cell-action', event)
}


// ===== MENÚ CONTEXTUAL =====
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

// ===== CONFIGURADOR DE COLUMNAS =====
const originalColumnConfig = ref([])

const openColumnConfig = () => {
  originalColumnConfig.value = allColumns.value.map(col => ({ ...col }))
  showColumnConfig.value = true
}

const applyColumnConfig = () => {
  showColumnConfig.value = false
  showSuccess('Configuración aplicada', 'Las columnas se han actualizado correctamente')
}


// ✅ WATCHERS PARA SINCRONIZAR CON PROPS
watch(() => props.selectedItems, (newSelection) => {
  selectedItems.value = [...newSelection]
}, { deep: true })

watch(() => props.expandedRows, (newExpanded) => {
  expandedRows.value = [...newExpanded]
}, { deep: true })

</script>