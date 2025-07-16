// constants/datatableConfig/commonTableConfig.js
// Configuración común para todas las tablas del sistema

// Configuración de paginación común
export const COMMON_PAGINATION_CONFIG = {
  enabled: true,
  template: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
  currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} registros",
  rowsPerPageOptions: [
    { label: '25 filas', value: 25 },
    { label: '50 filas', value: 50 },
    { label: '100 filas', value: 100 },
    { label: '200 filas', value: 200 }
  ],
  defaultPageSize: 50
}

// PassThrough común para todas las tablas
export const COMMON_TABLE_PT = {
  root: 'datatable-generic-root',
  header: 'datatable-generic-header',
  body: 'datatable-generic-body',
  row: 'datatable-generic-row'
}

// Clases CSS comunes
export const COMMON_TABLE_CLASSES = {
  container: 'datatable-generic-container',
  datatable: 'datatable-generic',
  expandColumn: 'expand-column',
  selectionColumn: 'selection-column',
  actionsColumn: 'acciones-column'
}

// Funciones de formateo comunes
export const COMMON_TABLE_FORMATTERS = {
  // Formatear fecha
  formatDate: (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  },
  
  // Formatear moneda
  formatCurrency: (v) => {
    if (v == null || v === '') return '-'
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(v)
  },
  
  // Formatear número
  formatNumber: (v, decimals = 0) => {
    if (v == null || v === '') return '-'
    return new Intl.NumberFormat('es-ES', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(v)
  },
  
  // Formatear porcentaje
  formatPercentage: (v) => {
    if (v == null || v === '') return '-'
    return new Intl.NumberFormat('es-ES', { 
      style: 'percent',
      minimumFractionDigits: 1
    }).format(v / 100)
  }
}

// Funciones auxiliares comunes
export const COMMON_TABLE_HELPERS = {
  // Función para detectar columnas de dinero BASADA EN EL TIPO
  isMoneyColumn: (col) => {
    return col.type === 'money'
  },
  
  // Función para detectar columnas de fecha BASADA EN EL TIPO
  isDateColumn: (col) => {
    return col.type === 'date'
  },
  
  // Función para detectar columnas de porcentaje BASADA EN EL TIPO
  isPercentageColumn: (col) => {
    return col.type === 'percentage'
  },
  
  // Función para obtener clase de dinero
  getMoneyClass: (amount) => {
    const value = parseFloat(amount) || 0
    if (value > 10000) return 'money-high'
    if (value > 1000) return 'money-medium'
    return 'money-low'
  },
  
  // Función para obtener clase de fecha
  getDateClass: (date) => {
    if (!date) return 'date-empty'
    
    const daysDiff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
    if (daysDiff > 90) return 'date-old'
    if (daysDiff > 30) return 'date-medium'
    return 'date-recent'
  },
  
  // Función para obtener clase de columna
  getColumnClass: (col) => {
    const classes = [`column-${col.field}`]
    
    if (col.type === 'money') classes.push('money-column')
    if (col.type === 'date') classes.push('date-column')
    if (col.type === 'percentage') classes.push('percentage-column')
    if (col.frozen) classes.push('frozen-column')
    if (col.type) classes.push(`column-type-${col.type}`)
    
    return classes.join(' ')
  },
  
  // Función para ordenar datos (genérica)
  sortData: (data, multiSortMeta, config) => {
    return [...data].sort((a, b) => {
      // Iterar por todos los criterios de ordenación
      for (const sort of multiSortMeta) {
        const field = sort.field
        const order = sort.order // 1 para ASC, -1 para DESC
        
        let aValue = a[field]
        let bValue = b[field]
        
        // Manejo de valores null/undefined
        if (aValue == null && bValue == null) continue
        if (aValue == null) return order
        if (bValue == null) return -order
        
        // Encontrar configuración de la columna
        const columnConfig = config.columns.find(col => col.field === field)
        
        // Conversión específica según el tipo de campo
        if (columnConfig?.type === 'date') {
          // Campos de fecha
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        } else if (columnConfig?.type === 'money') {
          // Campos monetarios
          aValue = parseFloat(aValue) || 0
          bValue = parseFloat(bValue) || 0
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Campos de texto - comparación insensible a mayúsculas
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }
        
        // Realizar la comparación
        let result = 0
        if (aValue < bValue) {
          result = -1
        } else if (aValue > bValue) {
          result = 1
        }
        
        // Si hay diferencia, aplicar el orden y retornar
        if (result !== 0) {
          return result * order
        }
      }
      
      // Si todos los criterios son iguales, mantener orden original
      return 0
    })
  }
}

// Configuración de templates comunes
export const COMMON_TABLE_TEMPLATES = {
  loading: {
    spinner: true,
    text: 'Cargando datos...'
  },
  
  empty: {
    icon: 'pi pi-folder-open',
    title: 'No se encontraron registros',
    text: 'Ajuste los filtros de búsqueda o intente con otros criterios'
  }
}

// Configuración de acciones comunes
export const COMMON_TABLE_ACTIONS = {
  view: {
    icon: 'pi pi-eye',
    tooltip: 'Ver detalles',
    severity: 'info',
    enabled: true,
    class: 'action-btn view-btn'
  },
  edit: {
    icon: 'pi pi-pencil',
    tooltip: 'Editar',
    severity: 'secondary',
    enabled: true,
    class: 'action-btn edit-btn'
  },
  delete: {
    icon: 'pi pi-trash',
    tooltip: 'Eliminar',
    severity: 'danger',
    enabled: false,
    class: 'action-btn delete-btn'
  },
  menu: {
    icon: 'pi pi-ellipsis-v',
    tooltip: 'Más opciones',
    severity: 'secondary',
    enabled: true,
    class: 'action-btn menu-btn'
  }
}