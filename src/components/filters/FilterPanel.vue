<template>
  <div class="filter-panel bg-slate-50 p-4 h-full overflow-y-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-slate-800">{{ title }}</h2>
      <div class="flex gap-2">
        <Button 
          label="Limpiar Filtros" 
          icon="pi pi-refresh"
          outlined 
          size="small"
          @click="clearAllFilters"
        />
        <Button 
          label="Buscar" 
          icon="pi pi-search"
          size="small"
          @click="applyFilters"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Columna 1: Filtros por Procedimiento -->
      <div class="space-y-4">
        <div class="bg-white p-3 rounded-lg shadow-sm">
          <h3 class="text-sm font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            FILTROS POR PROCEDIMIENTO
          </h3>
          
          <div class="space-y-3">
            <FilterMultiSelect
              v-model="filters.cliente"
              label="Cliente:"
              :options="clienteOptions"
              placeholder="Clientes Activos"
            />
            
            <FilterMultiSelect
              v-model="filters.cartera"
              label="Cartera:"
              :options="carteraOptions"
              placeholder="Carteras Activas"
            />
            
            <FilterMultiSelect
              v-model="filters.estadoExpediente"
              label="Estado Expediente:"
              :options="estadoExpedienteOptions"
              placeholder="Todos (Extrajudiciales y Judiciales)"
            />
            
            <FilterDateRange
              v-model="filters.fechaExpediente"
              label="Desde Expediente:"
              split-inputs
              from-placeholder="desde nº exp"
              to-placeholder="hasta nº exp"
            />
            
            <FilterNumber
              v-model="filters.desdeNumGestiones"
              label="Desde Nº Gestiones:"
              placeholder="desde nº gest"
              :min="0"
            />
            
            <FilterText
              v-model="filters.referencia"
              label="Referencia:"
              placeholder="Referencia"
            />
            
            <FilterText
              v-model="filters.contrato"
              label="Contrato:"
              placeholder="Contrato"
            />
            
            <FilterText
              v-model="filters.codigoPago"
              label="Código de Pago / Nº Caso:"
              placeholder="nº caso"
            />
            
            <FilterDate
              v-model="filters.desdeDefDate"
              label="Desde Def.Date:"
            />
            
            <FilterText
              v-model="filters.nig"
              label="NIG:"
              placeholder="NIG"
            />
            
            <FilterMultiSelect
              v-model="filters.hito"
              label="Hito:"
              :options="hitoOptions"
              placeholder="Todos"
            />
            
            <FilterMultiSelect
              v-model="filters.estadoDemanda"
              label="Estado demanda:"
              :options="estadoDemandaOptions"
              placeholder="Todos"
            />
            
            <FilterMultiSelect
              v-model="filters.estadoSubrogacion"
              label="Estado Subrogación:"
              :options="estadoSubrogacionOptions"
              placeholder="Todos"
            />
            
            <FilterText
              v-model="filters.diasSinGestJudicial"
              label="Días sin Gest Judicial:"
              input-type="number"
            />
            
            <FilterText
              v-model="filters.segmentoTDX"
              label="Segmento (Solo TDX):"
              placeholder="Segmento"
            />
          </div>
        </div>

        <!-- Más filtros de procedimiento -->
        <div class="bg-white p-3 rounded-lg shadow-sm">
          <div class="space-y-3">
            <FilterDateRange
              v-model="filters.fechaPrimeraAsignacion"
              label="Desde Fecha Primera Asignación:"
              split-inputs
            />
            
            <FilterDateRange
              v-model="filters.fechaUltimaAgenda"
              label="Desde Última Fecha Agenda Jud.:"
              split-inputs
            />
            
            <FilterDateRange
              v-model="filters.fechaUltimaGestion"
              label="Desde Última Fecha Gestión:"
              split-inputs
            />
            
            <FilterDateRange
              v-model="filters.fechaEnvio"
              label="Desde Fecha Envío:"
              split-inputs
            />
            
            <FilterDateRange
              v-model="filters.fechaPresentacion"
              label="Desde Fecha Presentación:"
              split-inputs
            />
            
            <FilterDateRange
              v-model="filters.fechaAdmision"
              label="Desde Fecha Admisión:"
              split-inputs
            />
            
            <FilterText
              v-model="filters.desdePrincipal"
              label="Desde Principal:"
              input-type="number"
            />
            
            <FilterSelect
              v-model="filters.tGestExt"
              label="T.Gest Ext.:"
              :options="tGestExtOptions"
              placeholder="Sin Clasificar"
            />
            
            <FilterMultiSelect
              v-model="filters.tipoDemanda"
              label="Tipo Demanda:"
              :options="tipoDemandaOptions"
              placeholder="Todos"
            />
            
            <FilterMultiSelect
              v-model="filters.estadoContactacion"
              label="Estado Contactación de Intervinientes:"
              :options="estadoContactacionOptions"
              placeholder="Todos (Contactables y No Contactables)"
            />
            
            <FilterMultiSelect
              v-model="filters.conIngresos"
              label="Con Ingresos:"
              :options="conIngresosOptions"
              placeholder="Todos (Con y Sin Ingresos)"
            />
            
            <FilterMultiSelect
              v-model="filters.estadoProcedimiento"
              label="Estado Procedimiento:"
              :options="estadoProcedimientoOptions"
              placeholder="Todos"
            />
            
            <FilterText
              v-model="filters.autos"
              label="Autos:"
            />
            
            <FilterText
              v-model="filters.autosMonitorio"
              label="Autos Monitorio:"
            />
            
            <FilterMultiSelect
              v-model="filters.letrado"
              label="Letrado:"
              :options="letradoOptions"
              placeholder="Todos"
            />
            
            <FilterMultiSelect
              v-model="filters.gestor"
              label="Gestor:"
              :options="gestorOptions"
              placeholder="Todos"
            />
          </div>
        </div>
      </div>

      <!-- Columna 2: Filtros Intervinientes -->
      <div class="space-y-4">
        <div class="bg-white p-3 rounded-lg shadow-sm">
          <h3 class="text-sm font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            FILTROS INTERVINIENTES
          </h3>
          
          <div class="space-y-3">
            <FilterText
              v-model="filters.nombreApellidos"
              label="Nombre y Apellidos:"
              placeholder="Nombre y Apellidos"
            />
            
            <FilterText
              v-model="filters.direccion"
              label="Dirección:"
            />
            
            <FilterText
              v-model="filters.localidad"
              label="Localidad:"
            />
            
            <FilterText
              v-model="filters.codPostal"
              label="Cod Postal:"
            />
            
            <FilterText
              v-model="filters.telefono"
              label="Teléfono:"
              input-type="tel"
            />
            
            <FilterText
              v-model="filters.email"
              label="Email:"
              input-type="email"
            />
            
            <FilterText
              v-model="filters.dniCifNie"
              label="DNI/CIF/NIE:"
            />
            
            <FilterMultiSelect
              v-model="filters.localizados"
              label="Localizados / localizados:"
              :options="localizadosOptions"
              placeholder="Todos"
            />
            
            <FilterText
              v-model="filters.observaciones"
              label="Observaciones:"
            />
            
            <FilterNumber
              v-model="filters.numRegistros"
              label="Nº Registros a Mostrar por Pantalla:"
              :min="1"
              :max="1000"
              placeholder="Número de registros"
            />
          </div>
        </div>
        
        <!-- Filtros Agenda Procesal -->
        <div class="bg-white p-3 rounded-lg shadow-sm">
          <h3 class="text-sm font-semibold text-blue-700 mb-3 border-b border-blue-200 pb-2">
            FILTROS AGENDA PROCESAL
          </h3>
          
          <div class="space-y-3">
            <FilterText
              v-model="filters.codigoAgenda"
              label="Código:"
            />
            
            <FilterDateRange
              v-model="filters.fechaAgenda"
              label="Desde Fecha Agenda Jud.:"
              split-inputs
            />
          </div>
        </div>
        
        <!-- Filtros Costas -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
            FILTRO COSTAS
          </h3>
          
          <div class="space-y-4">
            <FilterMultiSelect
              v-model="filters.tipoCostas"
              label="Tipo de Costas:"
              :options="tipoCostasOptions"
              placeholder="Todos"
            />
            
            <FilterDateRange
              v-model="filters.fechaCostas"
              label="Desde Fecha Costas:"
              split-inputs
            />
          </div>
        </div>
      </div>

      <!-- Columna 3: Información adicional y controles -->
      <div class="space-y-6">
        <!-- Campos específicos de la segunda columna de la imagen -->
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
            FILTROS ADICIONALES
          </h3>
          
          <div class="space-y-4">
            <FilterText
              v-model="filters.hastaExpediente"
              label="Hasta:"
              placeholder="hasta nº exp"
            />
            
            <FilterText
              v-model="filters.hastaNumGestiones"
              label="Hasta:"
              placeholder="hasta nº gest"
            />
            
            <FilterText
              v-model="filters.assignmentID"
              label="AssignmentID:"
              placeholder="AssignmentID"
            />
            
            <FilterText
              v-model="filters.accountID"
              label="AccountID:"
            />
            
            <FilterText
              v-model="filters.campanasVocalcom"
              label="Campañas (Vocalcom):"
              placeholder="Campaña"
            />
            
            <FilterSelect
              v-model="filters.gestExt"
              label="Gest Ext.:"
              :options="gestExtOptions"
              placeholder="---"
            />
            
            <FilterSelect
              v-model="filters.conAcuerdoPago"
              label="Con Acuerdo Pago:"
              :options="conAcuerdoPagoOptions"
              placeholder="Todos (Con y Sin Acuerdo)"
            />

            <!-- Campos que faltaban de la imagen -->
            <FilterText
              v-model="filters.hastaAsignmentID"
              label="Hasta:"
              placeholder="hasta AssignmentID"
            />
            
            <FilterText
              v-model="filters.hastaAccountID"
              label="Hasta:"
              placeholder="hasta AccountID"
            />
            
            <FilterText
              v-model="filters.hastaCampanas"
              label="Hasta:"
              placeholder="hasta campaña"
            />
            
            <FilterText
              v-model="filters.hastaVarias1"
              label="Hasta:"
            />
            
            <FilterText
              v-model="filters.hastaVarias2"
              label="Hasta:"
            />
            
            <FilterText
              v-model="filters.hastaVarias3"
              label="Hasta:"
            />
            
            <FilterText
              v-model="filters.hastaVarias4"
              label="Hasta:"
            />
            
            <FilterText
              v-model="filters.hastaVarias5"
              label="Hasta:"
            />
          </div>
        </div>

        <!-- Resumen de filtros activos -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-3">Filtros Activos</h4>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="(filter, key) in activeFilters" 
              :key="key"
              class="flex items-center justify-between bg-white px-3 py-2 rounded text-sm"
            >
              <span class="font-medium text-slate-700">{{ getFilterLabel(key) }}:</span>
              <div class="flex items-center gap-2">
                <span class="text-slate-600">{{ getFilterValue(filter) }}</span>
                <button 
                  @click="clearFilter(key)"
                  class="text-red-500 hover:text-red-700"
                  title="Eliminar filtro"
                >
                  <i class="pi pi-times text-xs"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-if="Object.keys(activeFilters).length === 0" class="text-blue-600 text-sm italic">
            No hay filtros aplicados
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import FilterSelect from './FilterSelect.vue'
import FilterMultiSelect from './FilterMultiSelect.vue'
import FilterDateRange from './FilterDateRange.vue'
import FilterText from './FilterText.vue'
import FilterDate from './FilterDate.vue'
import FilterNumber from './FilterNumber.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Expedientes de Carteras Activas'
  }
})

const emit = defineEmits(['filter-change', 'apply-filters', 'clear-filters'])

// Estado de todos los filtros
const filters = ref({
  // Filtros por Procedimiento - ahora arrays para MultiSelect
  cliente: [],
  cartera: [],
  estadoExpediente: [],
  fechaExpediente: [null, null],
  desdeNumGestiones: null,
  referencia: '',
  contrato: '',
  codigoPago: '',
  desdeDefDate: null,
  nig: '',
  hito: [],
  estadoDemanda: [],
  estadoSubrogacion: [],
  diasSinGestJudicial: '',
  segmentoTDX: '',
  fechaPrimeraAsignacion: [null, null],
  fechaUltimaAgenda: [null, null],
  fechaUltimaGestion: [null, null],
  fechaEnvio: [null, null],
  fechaPresentacion: [null, null],
  fechaAdmision: [null, null],
  desdePrincipal: '',
  tGestExt: null,
  tipoDemanda: [],
  estadoContactacion: [],
  conIngresos: [],
  estadoProcedimiento: [],
  autos: '',
  autosMonitorio: '',
  letrado: [],
  gestor: [],
  
  // Filtros Intervinientes
  nombreApellidos: '',
  direccion: '',
  localidad: '',
  codPostal: '',
  telefono: '',
  email: '',
  dniCifNie: '',
  localizados: [],
  observaciones: '',
  numRegistros: null,
  
  // Filtros Agenda Procesal
  codigoAgenda: '',
  fechaAgenda: [null, null],
  
  // Filtros Costas
  tipoCostas: [],
  fechaCostas: [null, null],
  
  // Filtros Adicionales
  hastaExpediente: '',
  hastaNumGestiones: '',
  assignmentID: '',
  accountID: '',
  campanasVocalcom: '',
  gestExt: null,
  conAcuerdoPago: null,
  hastaAsignmentID: '',
  hastaAccountID: '',
  hastaCampanas: '',
  hastaVarias1: '',
  hastaVarias2: '',
  hastaVarias3: '',
  hastaVarias4: '',
  hastaVarias5: ''
})

// Opciones para los selects (simuladas - en tu app vendrían de la API)
const clienteOptions = ref([
  { label: 'Clientes Activos', value: 'activos' },
  { label: 'Todos los Clientes', value: 'todos' }
])

const carteraOptions = ref([
  { label: 'Carteras Activas', value: 'activas' },
  { label: 'Todas las Carteras', value: 'todas' }
])

const estadoExpedienteOptions = ref([
  { label: 'Todos (Extrajudiciales y Judiciales)', value: 'todos' },
  { label: 'Solo Extrajudiciales', value: 'extrajudiciales' },
  { label: 'Solo Judiciales', value: 'judiciales' }
])

// ... más opciones para otros selects
const hitoOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Hito 1', value: 'hito1' },
  { label: 'Hito 2', value: 'hito2' }
])

const estadoDemandaOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Presentada', value: 'presentada' },
  { label: 'Pendiente', value: 'pendiente' }
])

const estadoSubrogacionOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Subrogado', value: 'subrogado' },
  { label: 'No Subrogado', value: 'no_subrogado' }
])

const tGestExtOptions = ref([
  { label: 'Sin Clasificar', value: 'sin_clasificar' },
  { label: 'Clasificado', value: 'clasificado' }
])

const tipoDemandaOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Monitorio', value: 'monitorio' },
  { label: 'Ordinario', value: 'ordinario' }
])

const estadoContactacionOptions = ref([
  { label: 'Todos (Contactables y No Contactables)', value: 'todos' },
  { label: 'Solo Contactables', value: 'contactables' },
  { label: 'Solo No Contactables', value: 'no_contactables' }
])

const conIngresosOptions = ref([
  { label: 'Todos (Con y Sin Ingresos)', value: 'todos' },
  { label: 'Con Ingresos', value: 'con_ingresos' },
  { label: 'Sin Ingresos', value: 'sin_ingresos' }
])

const estadoProcedimientoOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Activo', value: 'activo' },
  { label: 'Cerrado', value: 'cerrado' }
])

const letradoOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Letrado A', value: 'letrado_a' },
  { label: 'Letrado B', value: 'letrado_b' }
])

const gestorOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Gestor A', value: 'gestor_a' },
  { label: 'Gestor B', value: 'gestor_b' }
])

const localizadosOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Localizados', value: 'localizados' },
  { label: 'No Localizados', value: 'no_localizados' }
])

const tipoCostasOptions = ref([
  { label: 'Todos', value: 'todos' },
  { label: 'Costas Judiciales', value: 'judiciales' },
  { label: 'Costas Procesales', value: 'procesales' }
])

const gestExtOptions = ref([
  { label: '---', value: null },
  { label: 'Opción 1', value: 'opcion1' },
  { label: 'Opción 2', value: 'opcion2' }
])

const conAcuerdoPagoOptions = ref([
  { label: 'Todos (Con y Sin Acuerdo)', value: 'todos' },
  { label: 'Con Acuerdo', value: 'con_acuerdo' },
  { label: 'Sin Acuerdo', value: 'sin_acuerdo' }
])

// Computed para filtros activos
const activeFilters = computed(() => {
  const active = {}
  
  Object.entries(filters.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        if (value.some(v => v !== null && v !== '')) {
          active[key] = value
        }
      } else {
        active[key] = value
      }
    }
  })
  
  return active
})

// Labels para mostrar en filtros activos
const filterLabels = {
  cliente: 'Cliente',
  cartera: 'Cartera',
  estadoExpediente: 'Estado Expediente',
  nombreApellidos: 'Nombre y Apellidos',
  direccion: 'Dirección',
  localidad: 'Localidad',
  // ... agregar más según necesites
}

// Métodos
const getFilterLabel = (key) => {
  return filterLabels[key] || key
}

const getFilterValue = (value) => {
  if (Array.isArray(value)) {
    return value.filter(v => v !== null).join(' - ')
  }
  if (typeof value === 'object' && value.label) {
    return value.label
  }
  return value
}

const clearFilter = (key) => {
  if (Array.isArray(filters.value[key])) {
    // Si es un array de fechas, resetear a [null, null]
    if (key.includes('fecha') || key === 'fechaExpediente') {
      filters.value[key] = [null, null]
    } else {
      // Si es un MultiSelect, resetear a array vacío
      filters.value[key] = []
    }
  } else {
    filters.value[key] = null
  }
  emit('filter-change', filters.value)
}

const clearAllFilters = () => {
  Object.keys(filters.value).forEach(key => {
    if (Array.isArray(filters.value[key])) {
      filters.value[key] = []
    } else {
      filters.value[key] = null
    }
  })
  emit('clear-filters')
}

const applyFilters = () => {
  emit('apply-filters', filters.value)
}

// Exponer el estado de filtros
defineExpose({
  filters,
  activeFilters,
  clearAllFilters,
  applyFilters
})
</script>

<style scoped>
/* Estilos para el panel de filtros optimizado para drawer inferior */
.filter-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Header sticky mejorado */
.filter-panel .sticky {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Grid responsive mejorado */
@media (min-width: 768px) {
  .filter-panel .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .filter-panel .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .filter-panel .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Scrollbar personalizado */
.filter-panel .overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.filter-panel .overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.filter-panel .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.filter-panel .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Cards de filtros mejoradas */
.filter-panel .bg-white {
  transition: all 0.2s ease;
}

.filter-panel .bg-white:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Títulos de sección */
.filter-panel h3 {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

/* Filtros activos mejorados */
.filter-panel .bg-blue-50 {
  position: sticky;
  bottom: 0;
  margin: 0 -1rem -1rem -1rem;
  border-radius: 0;
  border-top: 1px solid #e2e8f0;
}
</style>