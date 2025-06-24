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
    <template #default="{ fieldId, value, updateValue, isDisabled, placeholder: fieldPlaceholder, showClear, onClear }">
      <Select
        :id="fieldId"
        :model-value="value"
        @update:model-value="updateValue"
        @clear="onClear"
        :options="options"
        :option-label="optionLabel"
        :option-value="optionValue"
        :option-disabled="optionDisabled"
        :placeholder="fieldPlaceholder || placeholder"
        :disabled="isDisabled"
        :show-clear="showClear"
        :filter="filter"
        :filter-placeholder="filterPlaceholder"
        :empty-message="emptyMessage"
        class="w-full"
        :class="inputClass"
      >
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps" />
        </template>
        
        <template v-if="$slots.value" #value="slotProps">
          <slot name="value" v-bind="slotProps" />
        </template>
      </Select>
    </template>
  </FilterField>
</template>

<script setup>
import FilterField from './FilterField.vue'
import Select from 'primevue/select'

defineProps({
  modelValue: {
    type: [String, Number, Object],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Seleccionar...'
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
  filter: {
    type: Boolean,
    default: false
  },
  filterPlaceholder: {
    type: String,
    default: 'Buscar...'
  },
  emptyMessage: {
    type: String,
    default: 'No hay opciones disponibles'
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

<style src="./FilterPanel.styles.css" scoped>

</style>