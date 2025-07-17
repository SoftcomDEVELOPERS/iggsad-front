<!-- components/expedientes/ExpedientesTable.vue - ARREGLADO CON COMPOSABLES -->
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="expedientes"
    :loading="loading"
    :pagination="pagination"
    :selected-items="selectedItems"
    :expanded-rows="expandedRows"
    @page="$emit('page', $event)"
    @sort="$emit('sort', $event)"
    @refresh="$emit('refresh')"
    @export="$emit('export', $event)"
    @export-selection="$emit('export-selection', $event)"
    @bulk-email="$emit('bulk-email', $event)"
    @action="handleAction"
    @row-expand="$emit('row-expand', $event)"
    @row-collapse="$emit('row-collapse', $event)"
    @selection-change="$emit('selection-change', $event)"
    @page-size-change="$emit('page-size-change', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'
import DataTableGeneric from '@/components/datatable/DataTableGeneric.vue'
import { EXPEDIENTES_TABLE_CONFIG } from '@/constants/datatableConfig/expedientesTableConfig'

// Props exactas del componente original
const props = defineProps({
  expedientes: { 
    type: Array, 
    default: () => [] 
  },
  loading: { 
    type: Boolean, 
    default: false 
  },
  pagination: { 
    type: Object, 
    required: true 
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

// Emits exactos del componente original
const emit = defineEmits([
  'page', 
  'sort', 
  'view-expediente', 
  'refresh', 
  'export', 
  'page-size-change', 
  'row-expand', 
  'row-collapse', 
  'selection-change',
  'export-selection',
  'bulk-email'
])

// Configuración de la tabla
const tableConfig = computed(() => EXPEDIENTES_TABLE_CONFIG)

// Manejar acciones - SOLO las configuradas en EXPEDIENTES_TABLE_CONFIG
const handleAction = ({ action, data }) => {
  switch (action) {
    case 'view':
      emit('view-expediente', data)
      break
    case 'edit':
      console.log('✏️ Editar expediente:', data.numero)
      // emit('edit-expediente', data) // cuando implementes la edición
      break
    default:
      console.warn('Acción no implementada:', action)
  }
}
</script>