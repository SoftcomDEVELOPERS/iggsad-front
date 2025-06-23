<template>
  <FilterField
    :model-value="normalizedValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @clear="$emit('clear')"
    :label="label"
    :required="required"
    :disabled="disabled"
    :error="error"
    :help="help"
    :show-clear-button="showClearButton"
    :container-class="containerClass"
  >
    <template #default="{ fieldId, value, updateValue, isDisabled, placeholder: fieldPlaceholder, showClear, onClear }">
      <Select
        :id="fieldId"
        :model-value="normalizedValue"
        @update:model-value="handleUpdate"
        @clear="onClear"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        :placeholder="fieldPlaceholder || placeholder"
        :disabled="isDisabled"
        :max-selected-labels="maxSelectedLabels"
        :selected-items-label="selectedItemsLabel"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :empty-message="emptyMessage"
        :select-all="selectAll"
        :show-clear="showClear"
        multiple
        class="w-full"
        :class="inputClass"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps" />
        </template>
        
        <template v-if="$slots.chip" #chip="slotProps">
          <slot name="chip" v-bind="slotProps" />
        </template>
      </Select>
    </template>
  </FilterField>
</template>

<script setup>
import { computed } from 'vue'
import FilterField from './FilterField.vue'
import Select from 'primevue/select'

const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Object], // ✅ Acepta múltiples tipos
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar opciones...'
  },
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  optionDisabled: {
    type: String,
    default: 'disabled'
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
  maxSelectedLabels: {
    type: Number,
    default: 3
  },
  selectedItemsLabel: {
    type: String,
    default: '{0} elementos seleccionados'
  },
  filter: {
    type: Boolean,
    default: true
  },
  filterPlaceholder: {
    type: String,
    default: 'Buscar...'
  },
  emptyMessage: {
    type: String,
    default: 'No hay opciones disponibles'
  },
  selectAll: {
    type: Boolean,
    default: true
  },
  containerClass: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// ✅ Computed para normalizar el valor y asegurar que siempre sea un array
const normalizedValue = computed(() => {
  const value = props.modelValue
  
  // Si es null, undefined o string vacío, devolver array vacío
  if (value === null || value === undefined || value === '') {
    return []
  }
  
  // Si ya es un array, devolverlo tal como está
  if (Array.isArray(value)) {
    return value
  }
  
  // Si es un string u otro tipo, convertir a array
  return [value]
})

// ✅ Manejar actualizaciones asegurando que siempre se emita un array
const handleUpdate = (newValue) => {
  // Asegurar que newValue sea un array
  const arrayValue = Array.isArray(newValue) ? newValue : (newValue ? [newValue] : [])
  
  emit('update:modelValue', arrayValue)
  emit('change', arrayValue)
}
</script>

<style scoped>
/* Copiar los mismos estilos de FilterSelect para consistencia */
/* Headers de sección */
:deep(.section-header-blue) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: sticky !important;
  top: 80px !important;
  z-index: 30 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

:deep(.section-header-green) {
  background: linear-gradient(135deg, #059669, #047857) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: sticky !important;
  top: 80px !important;
  z-index: 30 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

:deep(.section-header-purple) {
  background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: sticky !important;
  top: 80px !important;
  z-index: 30 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

:deep(.section-header-orange) {
  background: linear-gradient(135deg, #ea580c, #c2410c) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: sticky !important;
  top: 80px !important;
  z-index: 30 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

:deep(.section-header-indigo) {
  background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: sticky !important;
  top: 80px !important;
  z-index: 30 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

/* Contenedores de sección */
:deep(.section-container-blue) {
  background: white !important;
  border: 2px solid #dbeafe !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.1) !important;
}

:deep(.section-container-green) {
  background: white !important;
  border: 2px solid #d1fae5 !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.1) !important;
}

:deep(.section-container-purple) {
  background: white !important;
  border: 2px solid #e9d5ff !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(139, 92, 246, 0.1) !important;
}

:deep(.section-container-orange) {
  background: white !important;
  border: 2px solid #fed7aa !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(249, 115, 22, 0.1) !important;
}

:deep(.section-container-indigo) {
  background: white !important;
  border: 2px solid #e0e7ff !important;
  border-radius: 0.75rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.1) !important;
}

/* Inputs más pequeños */
:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-datepicker-input),
:deep(.p-inputnumber-input) {
  padding: 0.375rem 0.5rem !important;
  font-size: 0.75rem !important;
  min-height: 28px !important;
}

/* Labels más pequeños */
:deep(.filter-field label) {
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  margin-bottom: 0.25rem !important;
  color: #475569 !important;
}
</style>