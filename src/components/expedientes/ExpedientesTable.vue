<!-- src/components/ExpedientesTable.vue -->
<template>
  <div class="expedientes-table">
    <DataTable
      :value="expedientes"
      :loading="loading"
      paginator
      :rows="pagination.pageSize"
      :totalRecords="pagination.total"
      :first="(pagination.page - 1) * pagination.pageSize"
      @page="onPage"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      @row-click="onRowClick"
    >
      <Column
        v-for="col in cols"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :body="col.body"
        :style="col.style"
      />
    </DataTable>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const props = defineProps({
  expedientes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, required: true }
})
const emit = defineEmits(['page', 'rowClick'])

const onPage = e => emit('page', e.page + 1)
const onRowClick = e => emit('rowClick', e.data)

// Helpers de formato
function formatDate(d) {
  return d
    ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''
}
function formatCurrency(v) {
  return v != null
    ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)
    : ''
}

// Definimos las 26 columnas y estilos mínimos para cada una
const cols = [
  { field: 'numero', header: 'Exp.', style: { 'min-width': '6rem' } },
  { field: 'ap', header: 'A.P.', style: { 'min-width': '3rem' } },
  { field: 'ee', header: 'EE', style: { 'min-width': '2.5rem' } },
  { field: 'ep', header: 'EP', style: { 'min-width': '2.5rem' } },
  { field: 'sub', header: 'Sub.', style: { 'min-width': '3rem' } },
  { field: 'td', header: 'TD', style: { 'min-width': '2.5rem' } },
  { field: 'cartera', header: 'Cartera', style: { 'min-width': '6rem' } },
  { field: 'nombreTitular', header: 'Nombre Titular', style: { 'min-width': '10rem' } },
  { field: 'autos', header: 'Autos', style: { 'min-width': '4rem' } },
  { field: 'autosVerbOrd', header: 'AutosVerbOrd', style: { 'min-width': '6rem' } },
  { field: 'autoMonitorio', header: 'AutoMonitorio', style: { 'min-width': '6rem' } },
  {
    field: 'fechaEnvio',
    header: 'F. Envío',
    body: r => formatDate(r.fechaEnvio),
    style: { 'min-width': '5rem' }
  },
  {
    field: 'fechaPresentacion',
    header: 'F. Present.',
    body: r => formatDate(r.fechaPresentacion),
    style: { 'min-width': '6rem' }
  },
  {
    field: 'fechaAdmision',
    header: 'F. Admisión',
    body: r => formatDate(r.fechaAdmision),
    style: { 'min-width': '6rem' }
  },
  {
    field: 'ultFechaAgJud',
    header: 'UltFecAgJud',
    body: r => formatDate(r.ultFechaAgJud),
    style: { 'min-width': '6rem' }
  },
  {
    field: 'ultFechaGesExp',
    header: 'UltFecGEx',
    body: r => formatDate(r.ultFechaGesExp),
    style: { 'min-width': '6rem' }
  },
  { field: 'embargos', header: 'Embargos', style: { 'min-width': '4rem' } },
  {
    field: 'ultFecCobro',
    header: 'U.Fec.Cobro',
    body: r => formatDate(r.ultFecCobro),
    style: { 'min-width': '6rem' }
  },
  { field: 'lo', header: 'LO', style: { 'min-width': '3rem' } },
  { field: 'gt', header: 'GT', style: { 'min-width': '3rem' } },
  { field: 'oc', header: 'OC', style: { 'min-width': '3rem' } },
  {
    field: 'principal',
    header: 'Principal',
    body: r => formatCurrency(r.principal),
    style: { 'min-width': '5rem', 'text-align': 'right' }
  },
  {
    field: 'intereses',
    header: 'Intereses',
    body: r => formatCurrency(r.intereses),
    style: { 'min-width': '5rem', 'text-align': 'right' }
  },
  {
    field: 'costas',
    header: 'Costas',
    body: r => formatCurrency(r.costas),
    style: { 'min-width': '5rem', 'text-align': 'right' }
  },
  {
    field: 'ingJud',
    header: 'Ing.Jud.',
    body: r => formatCurrency(r.ingJud),
    style: { 'min-width': '5rem', 'text-align': 'right' }
  },
  {
    field: 'ingExj',
    header: 'Ing.Exj.',
    body: r => formatCurrency(r.ingExj),
    style: { 'min-width': '5rem', 'text-align': 'right' }
  }
]
</script>

<style scoped>
/* HEADERS */
.p-datatable-sm .p-datatable-thead > tr > th {
  background: var(--iggsad-surface-50);
  border-bottom: 1px solid var(--iggsad-surface-200);
  color: var(--iggsad-surface-800);
  font-weight: var(--iggsad-font-semibold);
  font-size: var(--iggsad-text-sm);
  padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* CELDAS */
.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: var(--iggsad-spacing-xs) var(--iggsad-spacing-sm);
  font-size: var(--iggsad-text-xs);
  color: var(--iggsad-surface-700);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* HOVER */
.p-datatable-sm .p-datatable-tbody > tr:hover {
  background-color: var(--iggsad-primary-50);
}

/* SELECCIÓN */
.p-datatable-sm .p-datatable-tbody > tr.p-highlight {
  background-color: var(--iggsad-primary-100);
}

/* SCROLLABLE */
.p-datatable-sm .p-datatable-scrollable-header-box,
.p-datatable-sm .p-datatable-scrollable-body-box {
  overflow: auto;
}

/* HEADER GENERAL (buscador, paginador) */
.p-datatable-sm .p-datatable-header {
  background: transparent;
  border: none;
  padding-bottom: var(--iggsad-spacing-sm);
  font-size: var(--iggsad-text-base);
}
</style>
