<template>
  <div class="space-y-3">
    <!-- Filtros básicos de procedimiento -->
    <div class="section-container-blue">
      <div class="section-header-blue px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          FILTROS BÁSICOS
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
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
        
        <FilterText
          v-model="filters.nig"
          label="NIG:"
          placeholder="NIG"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>

    <!-- Estados y clasificaciones -->
    <div class="section-container-blue">
      <div class="section-header-blue px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          ESTADOS Y CLASIFICACIONES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
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
          v-model="filters.estadoProcedimiento"
          label="Estado Procedimiento:"
          :options="options.estadoProcedimientoOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>

    <!-- Responsables -->
    <div class="section-container-blue">
      <div class="section-header-blue px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          RESPONSABLES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
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
        
        <FilterMultiSelect
          v-model="filters.conIngresos"
          label="Con Ingresos:"
          :options="options.conIngresosOptions.value"
          placeholder="Todos"
          size="small"
          container-class="mb-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterMultiSelect from '../FilterMultiSelect.vue'
import FilterText from '../FilterText.vue'

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