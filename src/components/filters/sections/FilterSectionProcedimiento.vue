<template>
  <div class="space-y-3">
    <!-- Filtros básicos de procedimiento -->
    <div class="section-container-blue rounded-lg shadow-sm border border-blue-200">
      <div class="sticky top-16 section-header-blue text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          FILTROS POR PROCEDIMIENTO
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterMultiSelect
          v-model="filters.cliente"
          label="Cliente:"
          :options="options.clienteOptions.value"
          placeholder="Clientes Activos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.cartera"
          label="Cartera:"
          :options="options.carteraOptions.value"
          placeholder="Carteras Activas"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.estadoExpediente"
          label="Estado Expediente:"
          :options="options.estadoExpedienteOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaExpediente"
          label="Rango Expediente:"
          split-inputs
          from-placeholder="desde"
          to-placeholder="hasta"
          size="small"
          container-class="mb-2"
        />
        
        <FilterNumber
          v-model="filters.desdeNumGestiones"
          label="Desde Nº Gestiones:"
          placeholder="desde"
          :min="0"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.referencia"
          label="Referencia:"
          placeholder="Referencia"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.contrato"
          label="Contrato:"
          placeholder="Contrato"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.codigoPago"
          label="Código Pago / Nº Caso:"
          placeholder="nº caso"
          size="small"
          container-class="mb-2"
        />
        
        <FilterDate
          v-model="filters.desdeDefDate"
          label="Desde Def.Date:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.nig"
          label="NIG:"
          placeholder="NIG"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.hito"
          label="Hito:"
          :options="options.hitoOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.estadoDemanda"
          label="Estado demanda:"
          :options="options.estadoDemandaOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.estadoSubrogacion"
          label="Estado Subrogación:"
          :options="options.estadoSubrogacionOptions.value"
          placeholder="Todos"
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
      </div>
    </div>

    <!-- Fechas y gestiones -->
    <div class="section-container-blue rounded-lg shadow-sm border border-blue-200">
      <div class="sticky top-16 section-header-blue text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          FECHAS Y GESTIONES
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterDateRange
          v-model="filters.fechaPrimeraAsignacion"
          label="Primera Asignación:"
          split-inputs
          size="small"
          container-class="mb-2"
        />
        
        <FilterDateRange
          v-model="filters.fechaUltimaAgenda"
          label="Última Agenda Jud.:"
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
        
        <FilterText
          v-model="filters.desdePrincipal"
          label="Desde Principal:"
          input-type="number"
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
        
        <FilterMultiSelect
          v-model="filters.tipoDemanda"
          label="Tipo Demanda:"
          :options="options.tipoDemandaOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.estadoContactacion"
          label="Estado Contactación:"
          :options="options.estadoContactacionOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.conIngresos"
          label="Con Ingresos:"
          :options="options.conIngresosOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.estadoProcedimiento"
          label="Estado Procedimiento:"
          :options="options.estadoProcedimientoOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
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
        
        <FilterMultiSelect
          v-model="filters.letrado"
          label="Letrado:"
          :options="options.letradoOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
        
        <FilterMultiSelect
          v-model="filters.gestor"
          label="Gestor:"
          :options="options.gestorOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterSelect from '../FilterSelect.vue'
import FilterMultiSelect from '../FilterMultiSelect.vue'
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