<template>
  <div 
    class="filter-field" 
    :class="[
      containerClass, 
      `size-${size}`,
      { 
        'has-error': !!error,
        'is-required': required,
        'is-compact': size === 'small'
      }
    ]"
    :data-critical="critical"
    :data-type="dataType"
  >
    <label 
      v-if="label" 
      :for="fieldId" 
      class="filter-label"
      :class="[labelClass, getSizeLabelClass()]"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1 text-xs">*</span>
    </label>
    
    <div class="filter-input-container">
      <slot 
        :fieldId="fieldId"
        :value="modelValue"
        :updateValue="updateValue"
        :isDisabled="disabled"
        :placeholder="placeholder"
        :options="options"
        :size="size"
        :showClear="showClearButton && hasValue && !disabled"
        :onClear="clearValue"
      />
      
      <!-- Indicador de campo crítico -->
      <div 
        v-if="critical && hasValue" 
        class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
        title="Campo crítico"
      />
    </div>
    
    <!-- Mensaje de error compacto -->
    <div v-if="error" :class="getSizeErrorClass()">
      <i class="pi pi-exclamation-triangle text-red-500 mr-1 text-xs"></i>
      {{ error }}
    </div>
    
    <!-- Texto de ayuda compacto -->
    <div v-if="help && !error" :class="getSizeHelpClass()">
      <i class="pi pi-info-circle text-slate-400 mr-1 text-xs"></i>
      {{ help }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object, Boolean],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  showClearButton: {
    type: Boolean,
    default: true
  },
  containerClass: {
    type: String,
    default: ''
  },
  labelClass: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'small', // Cambio por defecto a small
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  critical: {
    type: Boolean,
    default: false
  },
  dataType: {
    type: String,
    default: null,
    validator: (value) => !value || ['date', 'number', 'text', 'select'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// ID único para el campo
const fieldId = ref(`field-${Math.random().toString(36).substr(2, 9)}`)

// Computed para determinar si el campo tiene valor
const hasValue = computed(() => {
  const value = props.modelValue
  
  if (value === null || value === undefined || value === '') {
    return false
  }
  
  if (Array.isArray(value)) {
    return value.length > 0 && value.some(v => v !== null && v !== undefined && v !== '')
  }
  
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0
  }
  
  return true
})

// Métodos
const updateValue = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const clearValue = () => {
  const clearedValue = Array.isArray(props.modelValue) ? [] : null
  emit('update:modelValue', clearedValue)
  emit('clear')
}

// Métodos para obtener clases según el tamaño
const getSizeLabelClass = () => {
  switch (props.size) {
    case 'small': return 'text-xs mb-1 leading-3'
    case 'large': return 'text-base mb-3 leading-5'
    default: return 'text-sm mb-2 leading-4'
  }
}

const getSizeErrorClass = () => {
  const baseClass = 'mt-1 text-red-600 flex items-center'
  switch (props.size) {
    case 'small': return `${baseClass} text-xs leading-3`
    case 'large': return `${baseClass} text-base leading-5`
    default: return `${baseClass} text-sm leading-4`
  }
}

const getSizeHelpClass = () => {
  const baseClass = 'mt-1 text-slate-500 flex items-center'
  switch (props.size) {
    case 'small': return `${baseClass} text-xs leading-3`
    case 'large': return `${baseClass} text-base leading-5`
    default: return `${baseClass} text-sm leading-4`
  }
}

// Exponer métodos para componentes padre
defineExpose({
  clearValue,
  hasValue,
  fieldId
})
</script>

<style scoped>
/* ===== CONTENEDOR BASE MÁS COMPACTO ===== */
.filter-field {
  position: relative;
  margin-bottom: 0.4rem;
  min-height: auto;
}

.filter-field.is-compact {
  margin-bottom: 0.3rem;
}

.filter-input-container {
  position: relative;
}

/* ===== LABELS OPTIMIZADOS ===== */
.filter-label {
  display: block;
  font-weight: 500;
  color: #374151;
  transition: color 0.15s ease;
  user-select: none;
  line-height: 1.2;
}

.filter-field.has-error .filter-label {
  color: #dc2626;
}

.filter-field.is-required .filter-label {
  position: relative;
}

/* ===== TAMAÑOS ESPECÍFICOS ===== */
.filter-field.size-small {
  font-size: 0.75rem;
}

.filter-field.size-small .filter-label {
  font-size: 0.65rem;
  font-weight: 500;
  margin-bottom: 0.15rem;
  line-height: 1.2;
}

.filter-field.size-normal .filter-label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.filter-field.size-large .filter-label {
  font-size: 1rem;
  margin-bottom: 0.375rem;
}

/* ===== ESTADOS DE VALIDACIÓN ===== */
.filter-field.has-error :deep(.p-inputtext),
.filter-field.has-error :deep(.p-select),
.filter-field.has-error :deep(.p-datepicker-input) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2) !important;
  background-color: #fef2f2 !important;
}

.filter-field.has-error :deep(.p-inputtext:focus),
.filter-field.has-error :deep(.p-select:focus) {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3) !important;
}

/* ===== CAMPOS CRÍTICOS ===== */
.filter-field[data-critical="true"] {
  position: relative;
}

.filter-field[data-critical="true"] .filter-label {
  color: #dc2626;
  font-weight: 600;
}

.filter-field[data-critical="true"] :deep(.p-inputtext),
.filter-field[data-critical="true"] :deep(.p-select) {
  border-left: 3px solid #dc2626 !important;
  padding-left: 0.3rem !important;
}

/* ===== TIPOS DE DATOS CON INDICADORES VISUALES ===== */
.filter-field[data-type="date"] :deep(.p-inputtext),
.filter-field[data-type="date"] :deep(.p-datepicker-input) {
  background: linear-gradient(90deg, #fefce8 0%, #ffffff 6%) !important;
  border-left: 2px solid #eab308 !important;
}

.filter-field[data-type="number"] :deep(.p-inputtext),
.filter-field[data-type="number"] :deep(.p-inputnumber-input) {
  background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 6%) !important;
  border-left: 2px solid #3b82f6 !important;
  text-align: right;
}

.filter-field[data-type="select"] :deep(.p-select) {
  background: linear-gradient(90deg, #f5f3ff 0%, #ffffff 6%) !important;
  border-left: 2px solid #8b5cf6 !important;
}

/* ===== HOVER EFFECTS SUTILES ===== */
.filter-field:hover .filter-label {
  color: #1f2937;
}

.filter-field:hover :deep(.p-inputtext),
.filter-field:hover :deep(.p-select) {
  border-color: #6b7280 !important;
  transition: border-color 0.15s ease;
}

/* ===== FOCUS STATES MEJORADOS ===== */
.filter-field :deep(.p-inputtext:focus),
.filter-field :deep(.p-select:focus) {
  transform: none !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  border-color: #3b82f6 !important;
  outline: none !important;
  position: relative;
  z-index: 1;
}

/* ===== MENSAJES DE ERROR Y AYUDA COMPACTOS ===== */
.filter-field .text-red-600,
.filter-field .text-slate-500 {
  animation: slideDown 0.2s ease-out;
  padding: 0.1rem 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-2px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 2rem;
  }
}

/* ===== MEJORAS RESPONSIVE ===== */
@media (max-width: 640px) {
  .filter-field.size-small .filter-label {
    font-size: 0.6rem;
    margin-bottom: 0.1rem;
  }
  
  .filter-field {
    margin-bottom: 0.25rem;
  }
  
  .filter-field .text-xs {
    font-size: 0.65rem;
  }
}

/* ===== OPTIMIZACIONES DE PERFORMANCE ===== */
.filter-field :deep(.p-inputtext),
.filter-field :deep(.p-select) {
  will-change: border-color, box-shadow;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* ===== TRANSICIONES FLUIDAS ===== */
.filter-field :deep(.p-inputtext),
.filter-field :deep(.p-select),
.filter-field .filter-label {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== ESTADOS DISABLED MÁS CLAROS ===== */
.filter-field :deep(.p-inputtext:disabled),
.filter-field :deep(.p-select:disabled) {
  background-color: #f9fafb !important;
  color: #9ca3af !important;
  cursor: not-allowed;
  opacity: 0.7;
}

.filter-field :deep(.p-inputtext:disabled) + .filter-label,
.filter-field :deep(.p-select:disabled) + .filter-label {
  color: #9ca3af;
  cursor: not-allowed;
}

/* ===== LOADING STATES ===== */
.filter-field.is-loading :deep(.p-inputtext),
.filter-field.is-loading :deep(.p-select) {
  background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ===== MEJORAS DE ACCESIBILIDAD ===== */
.filter-field :deep(.p-inputtext:focus),
.filter-field :deep(.p-select:focus) {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .filter-field :deep(.p-inputtext),
  .filter-field :deep(.p-select) {
    border-width: 2px !important;
  }
  
  .filter-field.has-error :deep(.p-inputtext),
  .filter-field.has-error :deep(.p-select) {
    border-width: 3px !important;
  }
}

/* ===== REDUCED MOTION SUPPORT ===== */
@media (prefers-reduced-motion: reduce) {
  .filter-field :deep(.p-inputtext),
  .filter-field :deep(.p-select),
  .filter-field .filter-label,
  .filter-field .text-red-600,
  .filter-field .text-slate-500 {
    transition: none !important;
    animation: none !important;
  }
}

/* ===== PRINT STYLES ===== */
@media print {
  .filter-field {
    break-inside: avoid;
    margin-bottom: 0.2rem;
  }
  
  .filter-field :deep(.p-inputtext),
  .filter-field :deep(.p-select) {
    border: 1px solid #000 !important;
    background: #fff !important;
    box-shadow: none !important;
  }
  
  .filter-label {
    color: #000 !important;
    font-weight: 600 !important;
  }
}
</style>