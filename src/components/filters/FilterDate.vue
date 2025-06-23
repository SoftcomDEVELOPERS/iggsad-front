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
      <DatePicker
        :id="fieldId"
        :model-value="value"
        @update:model-value="updateValue"
        :placeholder="fieldPlaceholder || placeholder"
        :disabled="isDisabled"
        :date-format="dateFormat"
        :show-time="showTime"
        :time-only="timeOnly"
        :show-seconds="showSeconds"
        :hour-format="hourFormat"
        :min-date="minDate"
        :max-date="maxDate"
        :show-button-bar="showButtonBar"
        :manual-input="manualInput"
        :show-icon="showIcon"
        :icon="icon"
        class="w-full"
        :class="inputClass"
      />
    </template>
  </FilterField>
</template>

<script setup>
import FilterField from './FilterField.vue'
import DatePicker from 'primevue/datepicker'

defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'dd/mm/aaaa'
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
  dateFormat: {
    type: String,
    default: 'dd/mm/yy'
  },
  showTime: {
    type: Boolean,
    default: false
  },
  timeOnly: {
    type: Boolean,
    default: false
  },
  showSeconds: {
    type: Boolean,
    default: false
  },
  hourFormat: {
    type: String,
    default: '24',
    validator: (value) => ['12', '24'].includes(value)
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null
  },
  showButtonBar: {
    type: Boolean,
    default: true
  },
  manualInput: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: 'pi pi-calendar'
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

defineEmits(['update:modelValue', 'change', 'clear'])
</script>