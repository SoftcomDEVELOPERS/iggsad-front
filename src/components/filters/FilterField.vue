<template>
  <div class="filter-field" :class="[containerClass, `size-${size}`]">
    <label 
      v-if="label" 
      :for="fieldId" 
      class="block text-sm font-medium text-slate-700 mb-2"
      :class="[labelClass, getSizeLabelClass()]"
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
        :size="size"
        :showClear="showClearButton && hasValue && !disabled"
        :onClear="clearValue"
      />
    </div>
    
    <!-- Mensaje de error -->
    <div v-if="error" :class="getSizeErrorClass()">
      {{ error }}
    </div>
    
    <!-- Texto de ayuda -->
    <div v-if="help" :class="getSizeHelpClass()">
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
    case 'small': return 'text-xs mb-1'
    case 'large': return 'text-base mb-3'
    default: return 'text-sm mb-2'
  }
}

const getSizeErrorClass = () => {
  const baseClass = 'mt-1 text-red-600'
  switch (props.size) {
    case 'small': return `${baseClass} text-xs`
    case 'large': return `${baseClass} text-base`
    default: return `${baseClass} text-sm`
  }
}

const getSizeHelpClass = () => {
  const baseClass = 'mt-1 text-slate-500'
  switch (props.size) {
    case 'small': return `${baseClass} text-xs`
    case 'large': return `${baseClass} text-base`
    default: return `${baseClass} text-sm`
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