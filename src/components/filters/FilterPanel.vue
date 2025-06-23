<template>
  <div class="filter-panel bg-slate-50 h-full overflow-y-auto">
    <!-- Header con búsqueda de expediente -->
    <div class="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-10">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-semibold text-slate-800">{{ title }}</h2>
        <div class="flex gap-2">
          <Button 
            :icon="isFullscreen ? 'pi pi-window-minimize' : 'pi pi-window-maximize'"
            :label="isFullscreen ? 'Ventana' : 'Pantalla Completa'"
            outlined 
            size="small"
            class="text-xs"
            @click="toggleFullscreen"
          />
        </div>
      </div>
      
      <!-- Búsqueda rápida de expediente -->
      <div class="w-full">
        <label class="block text-xs font-medium text-slate-700 mb-1">
          Búsqueda Rápida por Expediente
        </label>
        <div class="relative">

            <InputText 
              v-model="expedienteSearch"
              placeholder="Ej: EXP-2024-001, 12345, referencia..."
              class="w-full pl-10 pr-20 text-sm"
              @keyup.enter="searchExpediente"
            />

          <div class="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
            <Button 
              v-if="expedienteSearch"
              icon="pi pi-times"
              text
              size="small"
              class="text-xs p-1"
              @click="clearExpedienteSearch"
            />
            <Button 
              icon="pi pi-search"
              size="small"
              class="text-xs"
              @click="searchExpediente"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido scrolleable con grid reorganizado -->
    <div class="p-4">
      <div 
        class="grid gap-4 transition-all duration-300"
        :class="isFullscreen ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3 xl:grid-cols-3'"
      >
        
        <!-- Columna 1: Filtros básicos por Procedimiento -->
        <FilterSectionProcedimientoBasico 
          v-model:filters="filters"
          :options="filterOptions"
          @update:filters="onFiltersUpdate"
        />

        <!-- Columna 2: Fechas reorganizadas -->
        <FilterSectionFechas
          v-model:filters="filters"
          :options="filterOptions"
          @update:filters="onFiltersUpdate"
        />

        <!-- Columna 3: Intervinientes y Agenda -->
        <FilterSectionIntervinientes 
          v-model:filters="filters"
          :options="filterOptions"
          @update:filters="onFiltersUpdate"
        />

        <!-- Columna 4: Adicionales (solo visible en pantalla completa) -->
        <FilterSectionAdicionales 
          v-if="isFullscreen"
          v-model:filters="filters"
          :options="filterOptions"
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
import { ref, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import FilterSectionProcedimientoBasico from './sections/FilterSectionProcedimientoBasico.vue'
import FilterSectionFechas from './sections/FilterSectionFechas.vue'
import FilterSectionIntervinientes from './sections/FilterSectionIntervinientes.vue'
import FilterSectionAdicionales from './sections/FilterSectionAdicionales.vue'
import FloatingActiveFilters from './FloatingActiveFilters.vue'
import { useFilterPanel } from '@/composables/useFilterPanel'
import { useFilterOptions } from '@/constants/filterOptions'

const props = defineProps({
  title: {
    type: String,
    default: 'Filtros de Búsqueda Procesal'
  }
})

const emit = defineEmits(['filter-change', 'apply-filters', 'clear-filters', 'search-expediente', 'toggle-fullscreen'])

// Estados locales
const isFullscreen = ref(false)
const expedienteSearch = ref('')

// Usar el composable para la lógica de filtros
const {
  filters,
  activeFilters,
  getFilterLabel,
  getFilterValue,
  clearFilter: clearSingleFilter,
  clearAllFilters: clearAll,
  applyFilters: apply,
  normalizeFilters
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
  normalizeFilters()
  apply(emit)
}

// Método para detectar cambios en filtros y emitir evento
const onFiltersUpdate = () => {
  normalizeFilters()
  emit('filter-change', filters.value)
}

// Métodos para búsqueda de expediente
const searchExpediente = () => {
  if (expedienteSearch.value.trim()) {
    emit('search-expediente', expedienteSearch.value.trim())
  }
}

const clearExpedienteSearch = () => {
  expedienteSearch.value = ''
  emit('search-expediente', '')
}

// Método para alternar pantalla completa
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('toggle-fullscreen', isFullscreen.value)
}

// Watch para detectar cambios profundos en filtros
watch(filters, () => {
  normalizeFilters()
  emit('filter-change', filters.value)
}, { deep: true })

// Normalizar filtros al montar el componente
onMounted(() => {
  normalizeFilters()
})

// Exponer el estado de filtros
defineExpose({
  filters,
  activeFilters,
  clearAllFilters,
  applyFilters,
  normalizeFilters,
  isFullscreen,
  toggleFullscreen
})
</script>

<style src="./FilterPanel.styles.css"></style>