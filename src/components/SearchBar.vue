<template>
  <div class="search-bar-container">
    <label v-if="label" class="block text-xs font-medium text-slate-700 mb-1">
      {{ label }}
    </label>
    <div class="relative">
        <IconField>
    <InputIcon class="pi pi-search" />
        <InputText 
        v-model="searchValue"
        :placeholder="placeholder"
        :class="inputClasses"
        @keyup.enter="handleSearch"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        />
    </IconField>

      <!-- Botones de acción -->
      <div class="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
        <Button 
          v-if="searchValue && showClearButton"
          icon="pi pi-times"
          text
          size="small"
          class="text-xs p-1"
          @click="clearSearch"
        />
      </div>
    </div>
    
    <!-- Mensaje de validación -->
    <div v-if="showValidation && !canSearch && searchValue" class="mt-1 text-xs text-red-600">
      {{ validationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  },
  showSearchIcon: {
    type: Boolean,
    default: true
  },
  showSearchButton: {
    type: Boolean,
    default: true
  },
  showClearButton: {
    type: Boolean,
    default: true
  },
  showValidation: {
    type: Boolean,
    default: false
  },
  validationMessage: {
    type: String,
    default: 'Campo requerido'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear', 'input', 'focus', 'blur'])

// Estado local
const searchValue = ref(props.modelValue)

// Computed
const canSearch = computed(() => {
  return searchValue.value && searchValue.value.trim().length > 0
})

const inputClasses = computed(() => {
  const baseClasses = ['w-full transition-colors']
  
    baseClasses.push('pl-3')
  
  if (props.showSearchButton || props.showClearButton) {
    baseClasses.push('pr-20')
  } else {
    baseClasses.push('pr-3')
  }
  
  // Tamaños
  switch (props.size) {
    case 'small':
      baseClasses.push('text-sm h-8')
      break
    case 'large':
      baseClasses.push('text-lg h-12')
      break
    default:
      baseClasses.push('text-base h-10')
  }
  
  // Variantes
  if (props.variant === 'compact') {
    baseClasses.push('text-xs h-7')
  }
  
  // Estados de validación
  if (props.showValidation && !canSearch.value && searchValue.value) {
    baseClasses.push('border-red-300 bg-red-50')
  } else if (canSearch.value) {
    baseClasses.push('border-green-300 bg-green-50')
  }
  
  return baseClasses.join(' ')
})

// Métodos
const handleSearch = () => {
  if (canSearch.value) {
    emit('search', searchValue.value.trim())
  }
}

const clearSearch = () => {
  searchValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const handleInput = (event) => {
  const value = event.target.value
  searchValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchValue.value) {
    searchValue.value = newValue
  }
})

// Exponer métodos
defineExpose({
  focus: () => {
    // Implementar focus si es necesario
  },
  clear: clearSearch
})
</script>

<style scoped>
.search-bar-container {
  width: 100%;
}

/* Mejorar el estilo del input cuando está enfocado */
:deep(.p-inputtext:focus) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
  border-color: #3b82f6 !important;
}

/* Estilo para variante compacta */
.search-bar-container :deep(.p-inputtext.text-xs) {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>