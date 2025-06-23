<template>
  <FilterField
    :model-value="modelValue"
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
    <template #default="{ fieldId, value, updateValue, isDisabled, placeholder: fieldPlaceholder }">
      <InputText
        :id="fieldId"
        :model-value="value || ''"
        @update:model-value="updateValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="fieldPlaceholder || placeholder"
        :disabled="isDisabled"
        :maxlength="maxlength"
        :type="inputType"
        class="w-full"
        :class="inputClass"
      />
    </template>
  </FilterField>
</template>

<script setup>
import FilterField from './FilterField.vue'
import InputText from 'primevue/inputtext'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  inputType: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'tel', 'url', 'search', 'number'].includes(value)
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
  maxlength: {
    type: Number,
    default: null
  },
  debounce: {
    type: Number,
    default: 0
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

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'input', 'focus', 'blur'])

let debounceTimer = null

// Métodos de eventos
const handleInput = (event) => {
  const value = event.target.value
  
  if (props.debounce > 0) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('update:modelValue', value)
      emit('input', value)
    }, props.debounce)
  } else {
    emit('update:modelValue', value)
    emit('input', value)
  }
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
  emit('change', event.target.value)
}
</script>