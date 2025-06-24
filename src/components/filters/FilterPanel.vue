<template>
  <div class="filter-panel bg-slate-50 h-full overflow-y-auto">
    <!-- Header con búsqueda de expediente -->
    <div class="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-10">

      
      <!-- Búsqueda rápida de expediente -->
      <div class="w-full">
        <SearchBar
          v-model="expedienteSearch"
          label="Búsqueda Rápida por Expediente"
          placeholder="Ej: EXP-2024-001, 12345, referencia..."
          variant="compact"
          :show-validation="true"
          validation-message="Ingrese un número de expediente"
          @search="searchExpediente"
          @clear="clearExpedienteSearch"
        />
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
import FilterSectionProcedimientoBasico from './sections/FilterSectionProcedimientoBasico.vue'
import FilterSectionFechas from './sections/FilterSectionFechas.vue'
import FilterSectionIntervinientes from './sections/FilterSectionIntervinientes.vue'
import FilterSectionAdicionales from './sections/FilterSectionAdicionales.vue'
import FloatingActiveFilters from './FloatingActiveFilters.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFilterPanel } from '@/composables/useFilterPanel'
import { useFilterOptions } from '@/constants/filterOptions'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  title: {
    type: String,
    default: 'Filtros de Búsqueda Procesal'
  },
  persistentFilters: {
    type: Object,
    default: () => ({})
  },
  persistentExpedienteSearch: {
    type: String,
    default: ''
  }
})

const { showWarn, showError, showSuccess } = useToast()
const emit = defineEmits(['filter-change', 'apply-filters', 'clear-filters', 'search-expediente', 'toggle-fullscreen'])

// Estados locales
const isFullscreen = ref(false)
const expedienteSearch = ref(props.persistentExpedienteSearch)

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

// Usar el store de expedientes
const expedientesStore = useExpedientesStore()

// Métodos que conectan con el composable
const clearFilter = (key) => {
  clearSingleFilter(key, emit)
}

const clearAllFilters = () => {
  clearAll(emit)
}

const applyFilters = async () => {
  normalizeFilters()
  
  // ✅ Verificar si hay expediente para buscar
  if (!expedienteSearch.value || !expedienteSearch.value.trim()) {
    console.warn('⚠️ No se puede aplicar filtros sin número de expediente')
    showWarn(
      'Expediente requerido',
      'Debe ingresar un número de expediente para aplicar los filtros'
    )
    emit('apply-filters', filters.value)
    return
  }
  
  try {
    console.log('📋 Aplicando filtros desde FilterPanel con expediente:', expedienteSearch.value.trim())
    
    // ✅ Usar el store para buscar con filtros
    await expedientesStore.searchExpedientes(filters.value, expedienteSearch.value.trim())
    
    showSuccess(
      'Filtros aplicados',
      'La búsqueda se ha realizado correctamente'
    )
    // ✅ Emitir evento para que LandingPage se sincronice
    emit('apply-filters', filters.value)
    
    console.log('✅ Filtros aplicados desde FilterPanel correctamente')
  } catch (error) {
    console.error('❌ Error al aplicar filtros desde FilterPanel:', error)
    showError(
      'Error en la búsqueda',
      'No se pudieron aplicar los filtros. Inténtelo de nuevo.'
    )
  }
}

// Método para detectar cambios en filtros y emitir evento
const onFiltersUpdate = () => {
  if (!isInitialLoad) { // Solo emitir después de la carga inicial
    normalizeFilters()
    emit('filter-change', filters.value)
  }
}

// Métodos para búsqueda de expediente
const searchExpediente = async () => {
  if (expedienteSearch.value.trim()) {
    try {
      console.log('🔍 Búsqueda desde FilterPanel:', expedienteSearch.value.trim())
      
      // ✅ Usar el store para buscar por expediente específico
      await expedientesStore.searchExpedientes(filters.value, expedienteSearch.value.trim())
      
      // ✅ Emitir evento para sincronizar con LandingPage
      emit('search-expediente', expedienteSearch.value.trim())
      
      console.log('✅ Búsqueda desde FilterPanel realizada:', expedienteSearch.value.trim())
    } catch (error) {
      console.error('❌ Error en búsqueda desde FilterPanel:', error)
    }
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
  // ✅ Cargar filtros persistentes al montar
  if (props.persistentFilters && Object.keys(props.persistentFilters).length > 0) {
    Object.assign(filters.value, props.persistentFilters)
    console.log('✅ Filtros persistentes cargados:', props.persistentFilters)
  }
  
  // ✅ Cargar búsqueda persistente
  if (props.persistentExpedienteSearch) {
    expedienteSearch.value = props.persistentExpedienteSearch
    console.log('✅ Búsqueda persistente cargada:', props.persistentExpedienteSearch)
  }
  
  normalizeFilters()
})

// ✅ Watch seguro para filtros persistentes - solo carga inicial
let isInitialLoad = true

watch(() => props.persistentFilters, (newFilters) => {
  if (newFilters && isInitialLoad) {
    Object.assign(filters.value, newFilters)
    normalizeFilters()
    console.log('🔄 Filtros iniciales cargados:', newFilters)
    isInitialLoad = false
  }
}, { deep: true, immediate: true })

// ✅ Watch para sincronizar búsqueda persistente
watch(() => props.persistentExpedienteSearch, (newSearch) => {
  expedienteSearch.value = newSearch || ''
}, { immediate: true })

// ✅ Watch bidireccional para expedienteSearch
watch(expedienteSearch, (newValue) => {
  if (newValue !== props.persistentExpedienteSearch) {
    emit('search-expediente', newValue)
  }
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

<style>
@import './FilterPanel.styles.css';

/* Forzar especificidad para el panel */
.filter-panel {
  font-size: 0.75rem;
}
</style>