<template>
  <div class="space-y-3">
    <!-- Filtros adicionales -->
    <div class="section-container-indigo rounded-lg shadow-sm border border-indigo-200">
      <div class="sticky top-16 section-header-indigo text-white px-3 py-2 rounded-t-lg z-20">
        <h3 class="text-xs font-semibold uppercase tracking-wide">
          FILTROS ADICIONALES
        </h3>
      </div>
      
      <div class="p-3 space-y-2">
        <FilterText
          v-model="filters.hastaExpediente"
          label="Hasta:"
          placeholder="hasta nº exp"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.hastaNumGestiones"
          label="Hasta:"
          placeholder="hasta nº gest"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.assignmentID"
          label="AssignmentID:"
          placeholder="AssignmentID"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.accountID"
          label="AccountID:"
          size="small"
          container-class="mb-2"
        />
        
        <FilterText
          v-model="filters.campanasVocalcom"
          label="Campañas (Vocalcom):"
          placeholder="Campaña"
          size="small"
          container-class="mb-2"
        />
        
        <FilterSelect
          v-model="filters.gestExt"
          label="Gest Ext.:"
          :options="options.gestExtOptions.value"
          placeholder="---"
          size="small"
          container-class="mb-2"
        />
        
        <FilterSelect
          v-model="filters.conAcuerdoPago"
          label="Con Acuerdo Pago:"
          :options="options.conAcuerdoPagoOptions.value"
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