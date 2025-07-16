<!-- components/datatable/ColumnRenderer.vue -->
<template>
  <!-- Columna tipo expediente -->
  <div v-if="config.type === 'expediente'" class="expediente-cell">
    <code class="expediente-code">{{ value }}</code>
    <Badge
      v-if="isUrgent"
      value="URGENTE"
      severity="danger"
      class="urgente-badge"
    />
  </div>

  <!-- Columna tipo dinero -->
  <div v-else-if="config.type === 'money'" class="money-cell">
    <span class="money-amount" :class="getMoneyClass(value)">
      {{ formatCurrency(value) }}
    </span>
  </div>

  <!-- Columna tipo fecha -->
  <div v-else-if="config.type === 'date'" class="date-cell">
    <span class="date-value" :class="getDateClass(value)">
      {{ formatDate(value) }}
    </span>
  </div>

  <!-- Columna tipo embargo -->
  <Tag
    v-else-if="config.type === 'embargo'"
    :value="value"
    :severity="value === 'Sí' ? 'success' : 'secondary'"
    class="embargo-tag"
  />

  <!-- Columna tipo cartera -->
  <div v-else-if="config.type === 'cartera'" class="cartera-cell">
    <i class="pi pi-briefcase cartera-icon" :class="getCarteraIconClass(value)"></i>
    <span class="cartera-text">{{ value }}</span>
  </div>

  <!-- Columna tipo titular/persona -->
  <div v-else-if="config.type === 'titular' || config.type === 'person'" class="titular-cell">
    <i class="pi pi-user titular-icon"></i>
    <span class="titular-name">{{ value }}</span>
  </div>

  <!-- Columna tipo tag -->
  <Tag
    v-else-if="config.type === 'tag'"
    :value="value"
    :severity="getTagSeverity(value)"
    class="custom-tag"
  />

  <!-- Columna tipo porcentaje -->
  <div v-else-if="config.type === 'percentage'" class="percentage-cell">
    <span class="percentage-value">{{ formatPercentage(value) }}</span>
  </div>

  <!-- Columna tipo código -->
  <code v-else-if="config.type === 'code'" class="code-cell">
    {{ value || 'N/A' }}
  </code>

  <!-- Columna tipo estado -->
  <div v-else-if="config.type === 'status'" class="status-cell">
    <i :class="getStatusIcon(value)" :style="{ color: getStatusColor(value) }"></i>
    <span>{{ value }}</span>
  </div>

  <!-- Columna de texto por defecto -->
  <span v-else class="text-cell">
    {{ value || 'N/A' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import { COMMON_TABLE_FORMATTERS, COMMON_TABLE_HELPERS } from '@/constants/datatableConfig/commonTableConfig'
import { EXPEDIENTES_TABLE_HELPERS } from '@/constants/datatableConfig/expedientesTableConfig'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  value: {
    type: [String, Number, Date, Boolean],
    default: null
  }
})

const emit = defineEmits(['action'])

// Formatters
const formatCurrency = COMMON_TABLE_FORMATTERS.formatCurrency
const formatDate = COMMON_TABLE_FORMATTERS.formatDate
const formatPercentage = COMMON_TABLE_FORMATTERS.formatPercentage

// Helpers comunes
const getMoneyClass = COMMON_TABLE_HELPERS.getMoneyClass
const getDateClass = COMMON_TABLE_HELPERS.getDateClass

// Helpers específicos de expedientes
const getCarteraIconClass = EXPEDIENTES_TABLE_HELPERS.getCarteraIconClass

// Computed para detectar urgencia (solo para expedientes)
const isUrgent = computed(() => {
  if (props.config.type === 'expediente') {
    return EXPEDIENTES_TABLE_HELPERS.isUrgent(props.data)
  }
  return false
})

// Función para obtener severity de tags
const getTagSeverity = (value) => {
  if (props.config.tagConfig && props.config.tagConfig[value]) {
    return props.config.tagConfig[value].severity
  }
  
  // Valores por defecto
  const severityMap = {
    'Activo': 'success',
    'Inactivo': 'secondary',
    'Pendiente': 'warning',
    'Cancelado': 'danger',
    'Completado': 'success',
    'En Proceso': 'info',
    'Pagada': 'success',
    'Vencida': 'danger',
    'Sí': 'success',
    'No': 'secondary'
  }
  
  return severityMap[value] || 'secondary'
}

// Función para obtener icono de estado
const getStatusIcon = (value) => {
  const iconMap = {
    'Activo': 'pi pi-check-circle',
    'Inactivo': 'pi pi-times-circle',
    'Pendiente': 'pi pi-clock',
    'Procesando': 'pi pi-spin pi-spinner',
    'Completado': 'pi pi-check',
    'Error': 'pi pi-exclamation-triangle'
  }
  
  return iconMap[value] || 'pi pi-info-circle'
}

// Función para obtener color de estado
const getStatusColor = (value) => {
  const colorMap = {
    'Activo': '#16a34a',
    'Inactivo': '#6b7280',
    'Pendiente': '#ea580c',
    'Procesando': '#3b82f6',
    'Completado': '#16a34a',
    'Error': '#dc2626'
  }
  
  return colorMap[value] || '#6b7280'
}
</script>

<style scoped>
/* Celdas de expediente */
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
  font-size: var(--iggsad-text-xs);
  font-weight: var(--iggsad-font-semibold);
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
  font-weight: var(--iggsad-font-semibold);
  font-size: var(--iggsad-text-sm);
}

.money-high {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: var(--iggsad-radius-sm);
}

.money-medium {
  color: #ea580c;
}

.money-low {
  color: #16a34a;
}

/* Celdas de fecha */
.date-cell {
  font-family: var(--iggsad-font-mono);
}

.date-value {
  font-size: var(--iggsad-text-sm);
}

.date-recent {
  color: var(--iggsad-surface-700);
  font-weight: var(--iggsad-font-medium);
}

.date-medium {
  color: #ea580c;
}

.date-old {
  color: #dc2626;
  font-weight: var(--iggsad-font-semibold);
}

.date-empty {
  color: var(--iggsad-surface-400);
  font-style: italic;
}

/* Celdas de cartera */
.cartera-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.cartera-icon {
  font-size: var(--iggsad-text-sm);
}

.cartera-icon.cartera-a { color: #2563eb; }
.cartera-icon.cartera-b { color: #16a34a; }
.cartera-icon.cartera-c { color: #ea580c; }
.cartera-icon.cartera-default { color: var(--iggsad-surface-500); }

.cartera-text {
  font-size: var(--iggsad-text-sm);
  color: var(--iggsad-surface-700);
}

/* Celdas de titular */
.titular-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

.titular-icon {
  color: var(--iggsad-surface-500);
  font-size: var(--iggsad-text-sm);
}

.titular-name {
  font-size: var(--iggsad-text-sm);
  color: var(--iggsad-surface-700);
  font-weight: var(--iggsad-font-medium);
}

/* Celdas de porcentaje */
.percentage-cell {
  text-align: right;
  font-family: var(--iggsad-font-mono);
}

.percentage-value {
  font-weight: var(--iggsad-font-medium);
  color: var(--iggsad-surface-700);
}

/* Celdas de código */
.code-cell {
  font-family: var(--iggsad-font-mono);
  background: var(--iggsad-surface-100);
  color: var(--iggsad-surface-700);
  padding: 0.125rem 0.25rem;
  border-radius: var(--iggsad-radius-sm);
  font-size: var(--iggsad-text-xs);
}

/* Celdas de estado */
.status-cell {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-xs);
}

/* Tags personalizados */
.embargo-tag,
.custom-tag {
  font-size: var(--iggsad-text-xs);
  font-weight: var(--iggsad-font-medium);
}

/* Celdas de texto por defecto */
.text-cell {
  font-size: var(--iggsad-text-sm);
  color: var(--iggsad-surface-700);
}
</style>