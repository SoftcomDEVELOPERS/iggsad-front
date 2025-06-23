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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2" v-if="splitInputs">
        <!-- Fecha Desde -->
        <div>
          <label class="block text-xs text-slate-600 mb-1">{{ fromLabel }}</label>
          <DatePicker
            :id="`${fieldId}-from`"
            :model-value="value?.[0]"
            @update:model-value="updateFromDate"
            :placeholder="fromPlaceholder"
            :disabled="isDisabled"
            :date-format="dateFormat"
            :show-time="showTime"
            :time-only="timeOnly"
            :show-seconds="showSeconds"
            :hour-format="hourFormat"
            :min-date="minDate"
            :max-date="value?.[1] || maxDate"
            :show-button-bar="showButtonBar"
            :manual-input="manualInput"
            class="w-full"
            :class="inputClass"
          />
        </div>
        
        <!-- Fecha Hasta -->
        <div>
          <label class="block text-xs text-slate-600 mb-1">{{ toLabel }}</label>
          <DatePicker
            :id="`${fieldId}-to`"
            :model-value="value?.[1]"
            @update:model-value="updateToDate"
            :placeholder="toPlaceholder"
            :disabled="isDisabled"
            :date-format="dateFormat"
            :show-time="showTime"
            :time-only="timeOnly"
            :show-seconds="showSeconds"
            :hour-format="hourFormat"
            :min-date="value?.[0] || minDate"
            :max-date="maxDate"
            :show-button-bar="showButtonBar"
            :manual-input="manualInput"
            class="w-full"
            :class="inputClass"
          />
        </div>
      </div>
      
      <!-- Selector de rango único -->
      <DatePicker
        v-else
        :id="fieldId"
        :model-value="value"
        @update:model-value="updateValue"
        selection-mode="range"
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
        class="w-full"
        :class="inputClass"
      />
    </template>
  </FilterField>
</template>

<script setup>
import FilterField from './FilterField.vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null]
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar rango de fechas...'
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
  splitInputs: {
    type: Boolean,
    default: false
  },
  fromLabel: {
    type: String,
    default: 'Desde'
  },
  toLabel: {
    type: String,
    default: 'Hasta'
  },
  fromPlaceholder: {
    type: String,
    default: 'dd/mm/aaaa'
  },
  toPlaceholder: {
    type: String,
    default: 'dd/mm/aaaa'
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

// Métodos para inputs separados
const updateFromDate = (date) => {
  const newValue = [date, props.modelValue?.[1] || null]
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const updateToDate = (date) => {
  const newValue = [props.modelValue?.[0] || null, date]
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>