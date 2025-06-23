// composables/useFilterPanel.js
import { ref, computed } from 'vue'

export function useFilterPanel() {
  // Estado de todos los filtros - CORREGIR tipos de datos
  const filters = ref({
    // Filtros por Procedimiento - Arrays para MultiSelect
    cliente: [],
    cartera: [],
    estadoExpediente: [], // ❌ CAMBIAR: era [] pero se inicializaba como string
    fechaExpediente: [null, null],
    desdeNumGestiones: null,
    referencia: '',
    contrato: '',
    codigoPago: '',
    desdeDefDate: null,
    nig: '',
    hito: [], // Array para MultiSelect
    estadoDemanda: [], // Array para MultiSelect
    estadoSubrogacion: [], // Array para MultiSelect
    diasSinGestJudicial: '',
    segmentoTDX: '',
    fechaPrimeraAsignacion: [null, null],
    fechaUltimaAgenda: [null, null],
    fechaUltimaGestion: [null, null],
    fechaEnvio: [null, null],
    fechaPresentacion: [null, null],
    fechaAdmision: [null, null],
    desdePrincipal: '',
    tGestExt: null, // Select simple
    tipoDemanda: [], // Array para MultiSelect
    estadoContactacion: [], // Array para MultiSelect
    conIngresos: [], // Array para MultiSelect
    estadoProcedimiento: [], // Array para MultiSelect
    autos: '',
    autosMonitorio: '',
    letrado: [], // Array para MultiSelect
    gestor: [], // Array para MultiSelect
    
    // Filtros Intervinientes
    nombreApellidos: '',
    direccion: '',
    localidad: '',
    codPostal: '',
    telefono: '',
    email: '',
    dniCifNie: '',
    localizados: [], // Array para MultiSelect
    observaciones: '',
    numRegistros: null,
    
    // Filtros Agenda Procesal
    codigoAgenda: '',
    fechaAgenda: [null, null],
    
    // Filtros Costas
    tipoCostas: [], // Array para MultiSelect
    fechaCostas: [null, null],
    
    // Filtros Adicionales
    hastaExpediente: '',
    hastaNumGestiones: '',
    assignmentID: '',
    accountID: '',
    campanasVocalcom: '',
    gestExt: null, // Select simple
    conAcuerdoPago: null // Select simple
  })

  // Computed para filtros activos
  const activeFilters = computed(() => {
    const active = {}
    
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        if (Array.isArray(value)) {
          // Para arrays, verificar que tengan elementos válidos
          const validItems = value.filter(v => v !== null && v !== '' && v !== undefined)
          if (validItems.length > 0) {
            active[key] = validItems
          }
        } else {
          // Para valores simples
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
      const filtered = value.filter(v => v !== null && v !== '' && v !== undefined)
      if (filtered.length === 0) return ''
      if (filtered.length === 1) {
        // Si es un objeto con label, mostrar el label
        return typeof filtered[0] === 'object' && filtered[0]?.label 
          ? filtered[0].label 
          : String(filtered[0])
      }
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
      // Para valores simples (string, number, null)
      if (typeof filters.value[key] === 'string') {
        filters.value[key] = ''
      } else {
        filters.value[key] = null
      }
    }
    emit('filter-change', filters.value)
  }

  const clearAllFilters = (emit) => {
    Object.keys(filters.value).forEach(key => {
      if (Array.isArray(filters.value[key])) {
        // Arrays de fecha
        if (key.includes('fecha')) {
          filters.value[key] = [null, null]
        } else {
          // MultiSelect arrays
          filters.value[key] = []
        }
      } else {
        // Valores simples
        if (typeof filters.value[key] === 'string') {
          filters.value[key] = ''
        } else {
          filters.value[key] = null
        }
      }
    })
    emit('clear-filters')
  }

  // Función para normalizar un valor para MultiSelect
  const normalizeMultiSelectValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return []
    }
    if (Array.isArray(value)) {
      return value
    }
    // Si es un string, convertir a array
    return [value]
  }

  // Función para normalizar todos los valores de filtros
  const normalizeFilters = () => {
    // Lista de campos que deben ser arrays (MultiSelect)
    const multiSelectFields = [
      'cliente', 'cartera', 'estadoExpediente', 'hito', 'estadoDemanda', 
      'estadoSubrogacion', 'tipoDemanda', 'estadoContactacion', 'conIngresos', 
      'estadoProcedimiento', 'letrado', 'gestor', 'localizados', 'tipoCostas'
    ]

    multiSelectFields.forEach(field => {
      if (filters.value[field] !== undefined) {
        filters.value[field] = normalizeMultiSelectValue(filters.value[field])
      }
    })
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
    applyFilters,
    normalizeFilters,
    normalizeMultiSelectValue
  }
}