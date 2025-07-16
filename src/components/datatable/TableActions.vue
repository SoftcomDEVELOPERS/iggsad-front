<!-- components/datatable/TableActions.vue -->
<template>
  <div class="table-actions">
    <Button
      icon="pi pi-refresh"
      outlined
      size="small"
      severity="secondary"
      v-tooltip.top="'Actualizar resultados'"
      :loading="loading"
      @click="$emit('refresh')"
      class="action-button"
    />
    
    <Button
      v-if="config.meta.exportable"
      icon="pi pi-download"
      outlined
      size="small"
      severity="secondary"
      label="Exportar"
      v-tooltip.top="'Exportar a Excel'"
      @click="$emit('export', selectedItems)"
      class="action-button"
    />
    
    <Button
      v-if="config.columnConfig?.configurable"
      icon="pi pi-cog"
      outlined
      size="small"
      severity="secondary"
      v-tooltip.top="'Configurar columnas'"
      @click="$emit('configure')"
      class="action-button"
    />
    
    <!-- Acciones de selección múltiple -->
    <div v-if="hasSelection" class="selection-actions">
      <div class="selection-divider"></div>
      
      <span class="selection-count">
        {{ selectedItems.length }} seleccionado{{ selectedItems.length !== 1 ? 's' : '' }}
      </span>
      
      <Button
        icon="pi pi-times"
        text
        size="small"
        severity="secondary"
        v-tooltip.top="'Limpiar selección'"
        @click="$emit('clear-selection')"
        class="clear-selection-btn"
      />
      
      <Button
        v-if="config.meta.name === 'expedientes'"
        icon="pi pi-file-excel"
        outlined
        size="small"
        severity="success"
        label="Exportar Selección"
        v-tooltip.top="'Exportar expedientes seleccionados'"
        @click="$emit('export-selection', selectedItems)"
        class="action-button"
      />
      
      <Button
        v-if="config.meta.name === 'expedientes'"
        icon="pi pi-envelope"
        outlined
        size="small"
        severity="info"
        label="Envío Masivo"
        v-tooltip.top="'Envío masivo de comunicaciones'"
        @click="$emit('bulk-email', selectedItems)"
        class="action-button"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'refresh', 
  'export', 
  'configure', 
  'clear-selection', 
  'export-selection', 
  'bulk-email'
])

// Computed para detectar si hay selección
const hasSelection = computed(() => 
  props.selectedItems && props.selectedItems.length > 0
)
</script>

<style scoped>
.table-actions {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
}

.action-button {
  transition: all var(--iggsad-transition-fast);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-md);
}

.selection-actions {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
}

.selection-divider {
  width: 1px;
  height: 24px;
  background: var(--iggsad-surface-300);
  margin: 0 var(--iggsad-spacing-sm);
}

.selection-count {
  font-size: var(--iggsad-text-sm);
  font-weight: var(--iggsad-font-medium);
  color: var(--iggsad-surface-600);
}

.clear-selection-btn {
  opacity: 0.7;
}

.clear-selection-btn:hover {
  opacity: 1;
}
</style>