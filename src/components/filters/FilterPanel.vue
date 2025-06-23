<template>
  <div class="filter-panel bg-slate-50 h-full overflow-y-auto">
    <!-- Header fijo -->
    <div class="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-10">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-800">{{ title }}</h2>
        <div class="flex gap-2">
          <Button 
            label="Limpiar" 
            icon="pi pi-refresh"
            outlined 
            size="small"
            class="text-xs"
            @click="clearAllFilters"
          />
          <Button 
            label="Aplicar" 
            icon="pi pi-search"
            size="small"
            class="text-xs"
            @click="applyFilters"
          />
        </div>
      </div>
    </div>

    <!-- Contenido scrolleable -->
    <div class="p-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        
        <!-- Columna 1: Filtros por Procedimiento -->
        <FilterSectionProcedimiento 
          v-model:filters="filters"
          :options="filterOptions"
          @update:filters="onFiltersUpdate"
        />

        <!-- Columna 2: Filtros Intervinientes -->
        <FilterSectionIntervinientes 
          v-model:filters="filters"
          :options="filterOptions"
          @update:filters="onFiltersUpdate"
        />

        <!-- Columna 3: Solo filtros adicionales (sin resumen) -->
        <FilterSectionAdicionales 
          v-model:filters="filters"
          :options="filterOptions"
          :active-filters="activeFilters"
          :get-filter-label="getFilterLabel"
          :get-filter-value="getFilterValue"
          @clear-filter="clearFilter"
          @update:filters="onFiltersUpdate"
        />
        
      </div>
    </div>

    <!-- Panel flotante de filtros activos -->
    <FloatingActiveFilters
      :active-filters="activeFilters"
      :get-filter-label="getFilterLabel"
      :get-filter-value="getFilterValue"
      @clear-filter="clearFilter"
      @clear-all="clearAllFilters"
      @apply-filters="applyFilters"
    />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import FilterSectionProcedimiento from './sections/FilterSectionProcedimiento.vue'
import FilterSectionIntervinientes from './sections/FilterSectionIntervinientes.vue'
import FilterSectionAdicionales from './sections/FilterSectionAdicionales.vue'
import FloatingActiveFilters from './FloatingActiveFilters.vue'
import { useFilterPanel } from '@/composables/useFilterPanel'
import { useFilterOptions } from '@/constants/filterOptions'
import { watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Expedientes de Carteras Activas'
  }
})

const emit = defineEmits(['filter-change', 'apply-filters', 'clear-filters'])

// Usar el composable para la lógica de filtros
const {
  filters,
  activeFilters,
  getFilterLabel,
  getFilterValue,
  clearFilter: clearSingleFilter,
  clearAllFilters: clearAll,
  applyFilters: apply
} = useFilterPanel()

// Usar las opciones de filtros
const filterOptions = useFilterOptions()

// Métodos que conectan con el composable
const clearFilter = (key) => {
  clearSingleFilter(key, emit)
}

const clearAllFilters = () => {
  clearAll(emit)
}

const applyFilters = () => {
  apply(emit)
}

// Método para detectar cambios en filtros y emitir evento
const onFiltersUpdate = () => {
  emit('filter-change', filters.value)
}

// Watch para detectar cambios profundos en filtros
watch(filters, () => {
  emit('filter-change', filters.value)
}, { deep: true })

// Exponer el estado de filtros
defineExpose({
  filters,
  activeFilters,
  clearAllFilters,
  applyFilters
})
</script>

<style src="./FilterPanel.styles.css" scoped></style>