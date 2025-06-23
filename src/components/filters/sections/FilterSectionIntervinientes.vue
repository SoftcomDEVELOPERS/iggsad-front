<template>
  <div class="space-y-3">
    <!-- Filtros Intervinientes -->
    <div class="section-container-green rounded-lg shadow-sm border border-green-200">
      <div class="sticky top-16 section-header-green text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          FILTROS INTERVINIENTES
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterText
          v-model="filters.nombreApellidos"
          label="Nombre y Apellidos:"
          placeholder="Nombre y Apellidos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.direccion"
          label="Dirección:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.localidad"
          label="Localidad:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.codPostal"
          label="Cod Postal:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.telefono"
          label="Teléfono:"
          input-type="tel"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.email"
          label="Email:"
          input-type="email"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.dniCifNie"
          label="DNI/CIF/NIE:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.localizados"
          label="Localizados:"
          :options="options.localizadosOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.observaciones"
          label="Observaciones:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterNumber
          v-model="filters.numRegistros"
          label="Nº Registros por Pantalla:"
          :min="1"
          :max="1000"
          placeholder="Número"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
    
    <!-- Filtros Agenda Procesal -->
    <div class="section-container-purple rounded-lg shadow-sm border border-purple-200">
      <div class="sticky top-16 section-header-purple text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          AGENDA PROCESAL
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterText
          v-model="filters.codigoAgenda"
          label="Código:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaAgenda"
          label="Fecha Agenda Jud.:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
    
    <!-- Filtros Costas -->
    <div class="section-container-orange rounded-lg shadow-sm border border-orange-200">
      <div class="sticky top-16 section-header-orange text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          FILTRO COSTAS
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterMultiSelect
          v-model="filters.tipoCostas"
          label="Tipo de Costas:"
          :options="options.tipoCostasOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaCostas"
          label="Fecha Costas:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterMultiSelect from '../FilterMultiSelect.vue'
import FilterDateRange from '../FilterDateRange.vue'
import FilterText from '../FilterText.vue'
import FilterNumber from '../FilterNumber.vue'

defineProps({
  filters: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  }
})

defineEmits(['update:filters'])
</script>