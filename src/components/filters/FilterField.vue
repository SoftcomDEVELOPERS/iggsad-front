<template>
  <div class="filter-field" :class="containerClass">
    <label 
      v-if="label" 
      :for="fieldId" 
      class="block text-sm font-medium text-slate-700 mb-2"
      :class="labelClass"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <slot 
        :fieldId="fieldId"
        :value="modelValue"
        :updateValue="updateValue"
        :isDisabled="disabled"
        :placeholder="placeholder"
        :options="options"
      />
      
      <!-- Botón de limpiar campo -->
      <button
        v-if="showClearButton && modelValue && !disabled"
        @click="clearValue"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        type="button"
        :title="`Limpiar ${label}`"
      >
        <i class="pi pi-times text-sm"></i>
      </button>
    </div>
    
    <!-- Mensaje de error -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
    
    <!-- Texto de ayuda -->
    <div v-if="help" class="mt-1 text-sm text-slate-500">
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
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'clear'])

// ID único para el campo
const fieldId = ref(`field-${Math.random().toString(36).substr(2, 9)}`)

// Computed para determinar si el campo tiene valor
const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
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

// Exponer métodos para componentes padre
defineExpose({
  clearValue,
  hasValue,
  fieldId
})
</script>

<style scoped>
.filter-field {
  position: relative;
}

/* Estilos para diferentes tamaños */
.filter-field.size-small {
  font-size: 0.875rem;
}

.filter-field.size-large {
  font-size: 1.125rem;
}

/* Animación para el botón de limpiar */
.filter-field button {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.filter-field:hover button,
.filter-field:focus-within button {
  opacity: 1;
  visibility: visible;
}

/* Estados de validación */
.filter-field.has-error input,
.filter-field.has-error select,
.filter-field.has-error textarea {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.filter-field.is-required label::after {
  content: " *";
  color: #ef4444;
}
</style>