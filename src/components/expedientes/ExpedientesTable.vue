<!-- src/components/expedientes/ExpedientesTable.vue - REFACTORIZADO -->
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="expedientes"
    :loading="loading"
    :pagination="pagination"
    :selected-items="selectedItems"
    :expanded-rows="expandedRows"
    @page="onPage"
    @sort="onSort"
    @refresh="onRefresh"
    @export="onExport"
    @export-selection="onExportSelection"
    @bulk-email="onBulkEmail"
    @action="onAction"
    @row-expand="onRowExpand"
    @row-collapse="onRowCollapse"
    @selection-change="onSelectionChange"
  />
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import DataTableGeneric from '@/components/datatable/DataTableGeneric.vue'
import { EXPEDIENTES_TABLE_CONFIG } from '@/constants/datatableConfig/expedientesTableConfig'
import { useExpedientesTable } from '@/composables/useExpedientesTable'

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
  'selection-change'
])

// Usar el composable específico de expedientes
const {
  selectedItems,
  expandedRows,
  onPage,
  onSort,
  onRefresh,
  onExport,
  onRowExpand,
  onRowCollapse,
  onSelectionChange,
  onAction,
  onExportSelection,
  onBulkEmail,
  getExpedientesStats
} = useExpedientesTable(props, emit)

// Configuración de la tabla
const tableConfig = computed(() => EXPEDIENTES_TABLE_CONFIG)

// Lifecycle (mantiene la inicialización original si es necesaria)
onMounted(() => {
  console.log('🏗️ ExpedientesTable montado con', props.expedientes.length, 'expedientes')
  
  // Mostrar estadísticas inicial
  const stats = getExpedientesStats()
  console.log('📊 Estadísticas iniciales:', stats)
})

// Watchers para sincronizar estado si es necesario
watch(() => props.pagination.pageSize, (newSize) => {
  console.log('📄 Tamaño de página cambiado a:', newSize)
  emit('page-size-change', newSize)
})

watch(() => props.expedientes, (newExpedientes) => {
  if (newExpedientes.length > 0) {
    const stats = getExpedientesStats()
    console.log('📊 Estadísticas actualizadas:', stats)
  }
}, { deep: true })
</script>

<style>
/* 
 * IMPORTANTE: Ya no importamos expedientes-table.css aquí
 * porque esos estilos ahora están en datatable.css
 * 
 * Solo añadimos estilos específicos de expedientes si los necesitamos
 */

/* Estilos específicos para el contexto de expedientes */
.expedientes-table-container .urgente-badge {
  /* Animación específica para expedientes urgentes */
  animation: pulseExpediente 2s infinite;
}

@keyframes pulseExpediente {
  0%, 100% { 
    opacity: 1; 
    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
  }
  50% { 
    opacity: 0.8; 
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }
}
</style>