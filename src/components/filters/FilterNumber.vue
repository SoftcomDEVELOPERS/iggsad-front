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
      <InputNumber
        :id="fieldId"
        :model-value="value"
        @update:model-value="updateValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="fieldPlaceholder || placeholder"
        :disabled="isDisabled"
        :min="min"
        :max="max"
        :step="step"
        :mode="mode"
        :currency="currency"
        :currency-display="currencyDisplay"
        :locale="locale"
        :min-fraction-digits="minFractionDigits"
        :max-fraction-digits="maxFractionDigits"
        :prefix="prefix"
        :suffix="suffix"
        :show-buttons="showButtons"
        :button-layout="buttonLayout"
        :increment-button-class="incrementButtonClass"
        :decrement-button-class="decrementButtonClass"
        :increment-button-icon="incrementButtonIcon"
        :decrement-button-icon="decrementButtonIcon"
        :allow-empty="allowEmpty"
        class="w-full"
        :class="inputClass"
      />
    </template>
  </FilterField>
</template>

<script setup>
import FilterField from './FilterField.vue'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  modelValue: {
    type: Number,
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
  min: {
    type: Number,
    default: null
  },
  max: {
    type: Number,
    default: null
  },
  step: {
    type: Number,
    default: 1
  },
  mode: {
    type: String,
    default: 'decimal',
    validator: (value) => ['decimal', 'currency'].includes(value)
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  currencyDisplay: {
    type: String,
    default: 'symbol'
  },
  locale: {
    type: String,
    default: 'es-ES'
  },
  minFractionDigits: {
    type: Number,
    default: null
  },
  maxFractionDigits: {
    type: Number,
    default: null
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  showButtons: {
    type: Boolean,
    default: false
  },
  buttonLayout: {
    type: String,
    default: 'stacked',
    validator: (value) => ['stacked', 'horizontal'].includes(value)
  },
  incrementButtonClass: {
    type: String,
    default: ''
  },
  decrementButtonClass: {
    type: String,
    default: ''
  },
  incrementButtonIcon: {
    type: String,
    default: 'pi pi-angle-up'
  },
  decrementButtonIcon: {
    type: String,
    default: 'pi pi-angle-down'
  },
  allowEmpty: {
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

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'input', 'focus', 'blur'])

// Métodos de eventos
const handleInput = (event) => {
  emit('input', event.value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
  emit('change', event.value)
}
</script>