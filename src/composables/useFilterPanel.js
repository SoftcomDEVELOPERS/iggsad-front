// composables/useFilterPanel.js
import { ref, computed } from 'vue'

export function useFilterPanel() {
  // Estado de todos los filtros
  const filters = ref({
    // Filtros por Procedimiento
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
    conAcuerdoPago: null
  })

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
    fechaExpediente: 'Rango Expediente',
    desdeNumGestiones: 'Desde Nº Gestiones',
    referencia: 'Referencia',
    contrato: 'Contrato',
    codigoPago: 'Código Pago',
    desdeDefDate: 'Desde Def.Date',
    nig: 'NIG',
    hito: 'Hito',
    estadoDemanda: 'Estado Demanda',
    estadoSubrogacion: 'Estado Subrogación',
    diasSinGestJudicial: 'Días sin Gest Judicial',
    segmentoTDX: 'Segmento TDX',
    fechaPrimeraAsignacion: 'Primera Asignación',
    fechaUltimaAgenda: 'Última Agenda',
    fechaUltimaGestion: 'Última Gestión',
    fechaEnvio: 'Fecha Envío',
    fechaPresentacion: 'Fecha Presentación',
    fechaAdmision: 'Fecha Admisión',
    desdePrincipal: 'Desde Principal',
    tGestExt: 'T.Gest Ext',
    tipoDemanda: 'Tipo Demanda',
    estadoContactacion: 'Estado Contactación',
    conIngresos: 'Con Ingresos',
    estadoProcedimiento: 'Estado Procedimiento',
    autos: 'Autos',
    autosMonitorio: 'Autos Monitorio',
    letrado: 'Letrado',
    gestor: 'Gestor',
    nombreApellidos: 'Nombre y Apellidos',
    direccion: 'Dirección',
    localidad: 'Localidad',
    codPostal: 'Código Postal',
    telefono: 'Teléfono',
    email: 'Email',
    dniCifNie: 'DNI/CIF/NIE',
    localizados: 'Localizados',
    observaciones: 'Observaciones',
    numRegistros: 'Nº Registros',
    codigoAgenda: 'Código Agenda',
    fechaAgenda: 'Fecha Agenda',
    tipoCostas: 'Tipo Costas',
    fechaCostas: 'Fecha Costas',
    hastaExpediente: 'Hasta Expediente',
    hastaNumGestiones: 'Hasta Nº Gestiones',
    assignmentID: 'AssignmentID',
    accountID: 'AccountID',
    campanasVocalcom: 'Campañas Vocalcom',
    gestExt: 'Gest Ext',
    conAcuerdoPago: 'Con Acuerdo Pago'
  }

  // Métodos
  const getFilterLabel = (key) => {
    return filterLabels[key] || key
  }

  const getFilterValue = (value) => {
    if (Array.isArray(value)) {
      const filtered = value.filter(v => v !== null && v !== '')
      if (filtered.length === 0) return ''
      if (filtered.length === 1) return filtered[0]
      return `${filtered.length} seleccionados`
    }
    if (typeof value === 'object' && value?.label) {
      return value.label
    }
    return String(value)
  }

  const clearFilter = (key, emit) => {
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

  const clearAllFilters = (emit) => {
    Object.keys(filters.value).forEach(key => {
      if (Array.isArray(filters.value[key])) {
        if (key.includes('fecha')) {
          filters.value[key] = [null, null]
        } else {
          filters.value[key] = []
        }
      } else {
        filters.value[key] = null
      }
    })
    emit('clear-filters')
  }

  const applyFilters = (emit) => {
    emit('apply-filters', filters.value)
  }

  return {
    filters,
    activeFilters,
    getFilterLabel,
    getFilterValue,
    clearFilter,
    clearAllFilters,
    applyFilters
  }
}