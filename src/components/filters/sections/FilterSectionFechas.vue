<template>
  <div class="space-y-3">
    <!-- Fechas principales -->
    <div class="section-container-green">
      <div class="section-header-green px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          FECHAS PRINCIPALES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <FilterDateRange
          v-model="filters.fechaExpediente"
          label="Rango Expediente:"
          split-inputs
          from-placeholder="desde"
          to-placeholder="hasta"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDate
          v-model="filters.desdeDefDate"
          label="Desde Def.Date:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaPrimeraAsignacion"
          label="Primera Asignación:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaUltimaGestion"
          label="Última Gestión:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>

    <!-- Fechas judiciales -->
    <div class="section-container-green">
      <div class="section-header-green px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          FECHAS JUDICIALES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <FilterDateRange
          v-model="filters.fechaUltimaAgenda"
          label="Última Agenda Jud.:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaEnvio"
          label="Fecha Envío:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaPresentacion"
          label="Fecha Presentación:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaAdmision"
          label="Fecha Admisión:"
          split-inputs
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

    <!-- Números y rangos -->
    <div class="section-container-orange">
      <div class="section-header-orange px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          NÚMEROS Y RANGOS
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <FilterNumber
          v-model="filters.desdeNumGestiones"
          label="Desde Nº Gestiones:"
          placeholder="desde"
          :min="0"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.desdePrincipal"
          label="Desde Principal:"
          input-type="number"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.diasSinGestJudicial"
          label="Días sin Gest Judicial:"
          input-type="number"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.segmentoTDX"
          label="Segmento (Solo TDX):"
          placeholder="Segmento"
          size="small"
          container-class="mb-2"
        />
        
        <FilterSelect
          v-model="filters.tGestExt"
          label="T.Gest Ext.:"
          :options="options.tGestExtOptions.value"
          placeholder="Sin Clasificar"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>

    <!-- Documentos judiciales -->
    <div class="section-container-green">
      <div class="section-header-green px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          DOCUMENTOS JUDICIALES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
        <FilterText
          v-model="filters.autos"
          label="Autos:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.autosMonitorio"
          label="Autos Monitorio:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.codigoAgenda"
          label="Código Agenda:"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterSelect from '../FilterSelect.vue'
import FilterDateRange from '../FilterDateRange.vue'
import FilterText from '../FilterText.vue'
import FilterDate from '../FilterDate.vue'
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

<style src="../FilterPanel.styles.css"></style>