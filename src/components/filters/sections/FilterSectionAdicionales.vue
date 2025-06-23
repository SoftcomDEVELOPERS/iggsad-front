<template>
  <div class="space-y-3">
    <!-- Filtros adicionales -->
    <div class="section-container-indigo">
      <div class="section-header-indigo px-4 py-3">
        <h3 class="text-sm font-semibold uppercase tracking-wide">
          FILTROS ADICIONALES
        </h3>
      </div>
      
      <div class="p-4 space-y-3">
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

<style scoped>
/* Estilos para sección índigo */
.section-container-indigo {
  background: linear-gradient(135deg, #e0e7ff, #eef2ff) !important;
}

.section-header-indigo {
  background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>