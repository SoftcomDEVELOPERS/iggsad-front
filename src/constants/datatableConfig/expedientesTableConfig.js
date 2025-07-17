// constants/datatableConfig/expedientesTableConfig.js
// ✅ CONFIGURACIÓN ACTUALIZADA - Compatible con el nuevo sistema unificado

import { 
  COMMON_PAGINATION_CONFIG, 
  COMMON_TABLE_PT, 
  COMMON_TABLE_CLASSES, 
  COMMON_TABLE_FORMATTERS, 
  COMMON_TABLE_HELPERS,
  COMMON_TABLE_ACTIONS 
} from './commonTableConfig'

export const EXPEDIENTES_TABLE_CONFIG = {
  // ===== METADATOS DE LA TABLA =====
  meta: {
    name: 'expedientes',
    title: 'Expedientes',
    icon: 'pi pi-folder',
    selectable: true,
    expandable: true,
    sortable: true,
    exportable: true,
    scrollable: true,
    scrollHeight: '600px',
    size: 'small',
    stripedRows: true,
    showGridlines: true,
    resizableColumns: true,
    sortMode: 'multiple',
    removableSort: true,
    dataKey: 'numero',
    selectionMode: 'multiple'
  },
  
  // ===== CONFIGURACIÓN DE COLUMNAS =====
  columns: [
    { 
      field: 'numero', 
      header: 'Expediente', 
      style: { 'min-width': '120px' }, 
      frozen: true,
      visible: true,
      sortable: true,
      type: 'expediente'
    },
    { 
      field: 'ap', 
      header: 'A.P.', 
      style: { 'min-width': '60px' },
      visible: true,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'ee', 
      header: 'EE', 
      style: { 'min-width': '50px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'ep', 
      header: 'EP', 
      style: { 'min-width': '50px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'sub', 
      header: 'Sub.', 
      style: { 'min-width': '60px' },
      visible: true,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'td', 
      header: 'TD', 
      style: { 'min-width': '50px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'cartera', 
      header: 'Cartera', 
      style: { 'min-width': '100px' },
      visible: true,
      sortable: true,
      type: 'cartera'
    },
    { 
      field: 'nombreTitular', 
      header: 'Nombre Titular', 
      style: { 'min-width': '200px' },
      visible: true,
      sortable: true,
      type: 'titular'
    },
    { 
      field: 'autos', 
      header: 'Autos', 
      style: { 'min-width': '80px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'autosVerbOrd', 
      header: 'AutosVerbOrd', 
      style: { 'min-width': '120px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'autoMonitorio', 
      header: 'AutoMonitorio', 
      style: { 'min-width': '120px' },
      visible: false,
      sortable: true,
      type: 'text'
    },
    {
      field: 'fechaEnvio',
      header: 'F. Envío',
      style: { 'min-width': '90px' },
      visible: true,
      sortable: true,
      type: 'date'
    },
    {
      field: 'fechaPresentacion',
      header: 'F. Presentación',
      style: { 'min-width': '110px' },
      visible: false,
      sortable: true,
      type: 'date'
    },
    {
      field: 'fechaAdmision',
      header: 'F. Admisión',
      style: { 'min-width': '100px' },
      visible: false,
      sortable: true,
      type: 'date'
    },
    {
      field: 'principal',
      header: 'Principal',
      style: { 'min-width': '100px', 'text-align': 'right' },
      visible: true,
      sortable: true,
      type: 'money'
    },
    {
      field: 'intereses',
      header: 'Intereses',
      style: { 'min-width': '90px', 'text-align': 'right' },
      visible: false,
      sortable: true,
      type: 'money'
    },
    {
      field: 'costas',
      header: 'Costas',
      style: { 'min-width': '80px', 'text-align': 'right' },
      visible: false,
      sortable: true,
      type: 'money'
    },
    {
      field: 'ultFecCobro',
      header: 'Últ. F. Cobro',
      style: { 'min-width': '110px' },
      visible: false,
      sortable: true,
      type: 'date'
    },
    {
      field: 'embargos',
      header: 'Embargos',
      style: { 'min-width': '90px' },
      visible: true,
      sortable: true,
      type: 'embargo'
    },
    {
      field: 'ingJud',
      header: 'Ing. Judicial',
      style: { 'min-width': '110px', 'text-align': 'right' },
      visible: false,
      sortable: true,
      type: 'money'
    },
    {
      field: 'ingExj',
      header: 'Ing. Extrajudicial',
      style: { 'min-width': '130px', 'text-align': 'right' },
      visible: false,
      sortable: true,
      type: 'money'
    }
  ],
  
  // ===== CONFIGURACIÓN DE ACCIONES =====
  actions: {
    view: {
      ...COMMON_TABLE_ACTIONS.view,
      tooltip: 'Ver detalles del expediente'
    },
    edit: {
      ...COMMON_TABLE_ACTIONS.edit,
      tooltip: 'Editar expediente'
    }
  },
  
  // ===== CONFIGURACIÓN DE EXPANSIÓN =====
  expansion: {
    enabled: true,
    sections: [
      {
        title: 'Información Procesal',
        fields: [
          { field: 'autos', label: 'Autos' },
          { field: 'autoMonitorio', label: 'Auto Monitorio' },
          { field: 'fechaPresentacion', label: 'F. Presentación', type: 'date' },
          { field: 'fechaAdmision', label: 'F. Admisión', type: 'date' }
        ]
      },
      {
        title: 'Información Financiera',
        fields: [
          { field: 'costas', label: 'Costas', type: 'money' },
          { field: 'ingJud', label: 'Ing. Judicial', type: 'money' },
          { field: 'ingExj', label: 'Ing. Extrajudicial', type: 'money' },
          { field: 'ultFecCobro', label: 'Últ. F. Cobro', type: 'date' }
        ]
      },
      {
        title: 'Códigos Adicionales',
        fields: [
          { field: 'lo', label: 'LO' },
          { field: 'gt', label: 'GT' },
          { field: 'oc', label: 'OC' },
          { field: 'td', label: 'TD' }
        ]
      }
    ]
  },
  
  // ===== CONFIGURACIÓN DEL MENÚ CONTEXTUAL =====
  contextMenu: [
    {
      label: 'Ver Detalles',
      icon: 'pi pi-eye',
      action: 'view'
    },
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      action: 'edit'
    },
    {
      separator: true
    },
    {
      label: 'Generar Documento',
      icon: 'pi pi-file-pdf',
      action: 'generateDocument'
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      action: 'viewHistory'
    },
    {
      separator: true
    },
    {
      label: 'Duplicar',
      icon: 'pi pi-copy',
      action: 'duplicateExpediente'
    },
    {
      label: 'Archivar',
      icon: 'pi pi-archive',
      action: 'archiveExpediente'
    }
  ],
  
  // ===== CONFIGURACIÓN DE COLUMNAS =====
  columnConfig: {
    showAllEnabled: true,
    basicFields: ['numero', 'cartera', 'nombreTitular', 'fechaEnvio', 'principal', 'embargos'],
    configurable: true
  },

  // ===== USAR CONFIGURACIONES COMUNES =====
  pagination: COMMON_PAGINATION_CONFIG,
  pt: COMMON_TABLE_PT,
  classes: COMMON_TABLE_CLASSES
}

// ===== FUNCIONES AUXILIARES ESPECÍFICAS DE EXPEDIENTES =====
export const EXPEDIENTES_TABLE_HELPERS = {
  // Función para detectar expedientes urgentes
  isUrgent: (data) => {
    const principal = parseFloat(data.principal) || 0
    const daysSinceEnvio = data.fechaEnvio ? 
      Math.floor((new Date() - new Date(data.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
    
    return principal > 5000 || daysSinceEnvio > 90
  },
  
  // Función para obtener clase de cartera
  getCarteraIconClass: (cartera) => {
    const iconMap = {
      'Cartera A': 'cartera-a',
      'Cartera B': 'cartera-b', 
      'Cartera C': 'cartera-c'
    }
    return iconMap[cartera] || 'cartera-default'
  },
  
  // Calcular estadísticas de expedientes
  getExpedientesStats: (expedientes) => {
    const total = expedientes.length
    const urgentes = expedientes.filter(exp => EXPEDIENTES_TABLE_HELPERS.isUrgent(exp)).length
    const conEmbargos = expedientes.filter(exp => exp.embargos === 'Sí').length
    const totalPrincipal = expedientes.reduce((sum, exp) => sum + (parseFloat(exp.principal) || 0), 0)
    
    return {
      total,
      urgentes,
      conEmbargos,
      totalPrincipal,
      porcentajeUrgentes: total > 0 ? Math.round((urgentes / total) * 100) : 0,
      porcentajeEmbargos: total > 0 ? Math.round((conEmbargos / total) * 100) : 0
    }
  }
}

// Re-exportar las funciones comunes para facilitar el uso
export const EXPEDIENTES_TABLE_FORMATTERS = COMMON_TABLE_FORMATTERS