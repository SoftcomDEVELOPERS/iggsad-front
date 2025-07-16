# 📊 Sistema DataTable Genérico - Documentación Completa

## 🎯 Resumen del Sistema

El sistema DataTable Genérico es una arquitectura modular que permite crear tablas complejas de datos con funcionalidades avanzadas como paginación, ordenación, selección múltiple, expansión de filas y acciones personalizadas. Está construido sobre PrimeVue DataTable con composables especializados y configuración centralizada.

---

## 🏗️ Arquitectura del Sistema

### **Estructura de Archivos**

```
src/
├── components/datatable/
│   ├── DataTableGeneric.vue        # 🔧 Componente principal reutilizable
│   ├── ColumnRenderer.vue          # 🎨 Renderizado inteligente de columnas
│   └── TableActions.vue            # ⚡ Barra de herramientas de la tabla
├── composables/datatable/
│   ├── useTableSorting.js          # 📊 Lógica de ordenación múltiple
│   ├── useTablePagination.js       # 📄 Gestión de paginación
│   ├── useTableSelection.js        # ✅ Selección múltiple inteligente
│   └── useTableData.js             # 💾 Gestión general de datos
├── constants/datatableConfig/
│   ├── commonTableConfig.js        # ⚙️ Configuraciones base compartidas
│   └── expedientesTableConfig.js   # 📋 Configuración específica de expedientes
├── composables/
│   └── useExpedientesTable.js      # 🧩 Lógica de negocio específica
├── styles/
│   ├── datatable.css               # 🎨 Estilos base del sistema
│   └── expedientes-table.css       # 🎨 Estilos específicos de expedientes
└── components/expedientes/
    └── ExpedientesTable.vue        # 📝 Implementación específica de expedientes
```

---

## 🔧 Componentes Principales

### **1. DataTableGeneric.vue - Componente Central**

**Ubicación:** `src/components/datatable/DataTableGeneric.vue`

**Responsabilidades:**
- ✅ Renderizado de tabla con configuración dinámica
- ✅ Integración de todos los composables del sistema
- ✅ Gestión de expansión de filas con template personalizado
- ✅ Columnas de selección y acciones dinámicas
- ✅ Configuración de paginación serverside
- ✅ Sistema de PassThrough para estilos

**Props Principales:**
```javascript
{
  config: Object,           // Configuración completa de la tabla
  data: Array,             // Datos a mostrar
  loading: Boolean,        // Estado de carga
  pagination: Object,      // Información de paginación
  selectedItems: Array,    // Elementos seleccionados
  expandedRows: Array      // Filas expandidas
}
```

**Eventos Emitidos:**
```javascript
{
  'page',              // Cambio de página
  'sort',              // Ordenación
  'refresh',           // Actualizar datos
  'export',            // Exportar datos
  'action',            // Acciones específicas
  'selection-change',  // Cambio de selección
  'row-expand',        // Expansión de fila
  'row-collapse'       // Colapso de fila
}
```

**Composables Integrados:**
```javascript
// Todos los composables están integrados
const { multiSortMeta, onSort } = useTableSorting(props.config, props, emit)
const { selectedPageSize, onPage, onPageSizeChange } = useTablePagination(props.config, props, emit)
const { selectedItems, selectionMode, onSelectionChange } = useTableSelection(props.config, props, emit)
const { expandedRows, allColumns, visibleColumns } = useTableData(props.config, props, emit)
```

### **2. ColumnRenderer.vue - Renderizado Inteligente**

**Ubicación:** `src/components/datatable/ColumnRenderer.vue`

**Tipos de Columna Soportados:**
- `expediente` - Número con badge urgente
- `money` - Formato monetario (€1.234,56)
- `date` - Formato de fecha localizado (DD/MM/YYYY)
- `embargo` - Tag Sí/No con colores
- `cartera` - Icono + texto de cartera
- `titular` - Nombre con icono de persona
- `tag` - Tags personalizables con severity
- `percentage` - Porcentajes formateados
- `code` - Código con fuente monoespaciada
- `status` - Estado con iconos y colores
- `text` - Texto por defecto

**Funcionalidades:**
```javascript
// Detecta expedientes urgentes automáticamente
const isUrgent = computed(() => {
  if (props.config.type === 'expediente') {
    return EXPEDIENTES_TABLE_HELPERS.isUrgent(props.data)
  }
  return false
})
```

### **3. TableActions.vue - Barra de Herramientas**

**Ubicación:** `src/components/datatable/TableActions.vue`

**Acciones Disponibles:**
- 🔄 **Refrescar** datos
- 📊 **Exportar** a Excel
- ⚙️ **Configurar** columnas
- 🗑️ **Limpiar** selección
- 📧 **Email masivo** (específico de expedientes)
- 📋 **Exportar selección** (específico de expedientes)

**Funcionalidades de Selección:**
```javascript
const hasSelection = computed(() => 
  props.selectedItems && props.selectedItems.length > 0
)
```

---

## 🎛️ Sistema de Configuración

### **commonTableConfig.js - Configuración Base**

**Ubicación:** `src/constants/datatableConfig/commonTableConfig.js`

**Configuraciones Compartidas:**

#### **Paginación Común:**
```javascript
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
```

#### **PassThrough para Estilos:**
```javascript
export const COMMON_TABLE_PT = {
  root: 'datatable-generic-root',
  header: 'datatable-generic-header',
  body: 'datatable-generic-body',
  row: 'datatable-generic-row'
}
```

#### **Formatters Comunes:**
```javascript
export const COMMON_TABLE_FORMATTERS = {
  formatDate: (d) => new Date(d).toLocaleDateString('es-ES'),
  formatCurrency: (v) => new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR'
  }).format(v),
  formatPercentage: (v) => `${v}%`
}
```

#### **Acciones Comunes:**
```javascript
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
  }
}
```

### **expedientesTableConfig.js - Configuración Específica**

**Ubicación:** `src/constants/datatableConfig/expedientesTableConfig.js`

**Estructura Completa:**
```javascript
export const EXPEDIENTES_TABLE_CONFIG = {
  // Metadatos de la tabla
  meta: {
    name: 'expedientes',
    title: 'Expedientes',
    icon: 'pi pi-folder',
    selectable: true,
    expandable: true,
    dataKey: 'numero'
  },
  
  // Columnas con configuración detallada
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
    // ... más columnas
  ],
  
  // Acciones específicas (hereda de COMMON y personaliza)
  actions: {
    ...COMMON_TABLE_ACTIONS,
    view: {
      ...COMMON_TABLE_ACTIONS.view,
      tooltip: 'Ver expediente'
    },
    edit: {
      ...COMMON_TABLE_ACTIONS.edit,
      tooltip: 'Editar expediente'
    }
  },
  
  // Configuración de expansión
  expansion: {
    enabled: true,
    sections: [
      {
        title: 'Información Procesal',
        fields: [
          { field: 'autos', label: 'Autos' },
          { field: 'fechaPresentacion', label: 'F. Presentación', type: 'date' }
        ]
      }
    ]
  },
  
  // Menú contextual (NO se muestra, solo acciones directas)
  contextMenu: [
    { label: 'Ver Detalles', icon: 'pi pi-eye', action: 'view' },
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' }
  ]
}
```

---

## 🔄 Composables del Sistema

### **useTableSorting.js - Ordenación Múltiple**

**Ubicación:** `src/composables/datatable/useTableSorting.js`

**Funcionalidades:**
- ✅ Ordenación múltiple (varios campos simultáneamente)
- ✅ Persistencia de criterios de ordenación
- ✅ Soporte para datos client-side y server-side
- ✅ Gestión automática de meta-data de ordenación

**API Principal:**
```javascript
const { multiSortMeta, onSort } = useTableSorting(config, props, emit)

// Aplicar ordenación programática
applySorting('fechaEnvio', 'desc')
addSortCriteria('principal', 'asc')
clearSort()
```

### **useTablePagination.js - Gestión de Paginación**

**Ubicación:** `src/composables/datatable/useTablePagination.js`

**Funcionalidades:**
- ✅ Paginación serverside con lazy loading
- ✅ Cambio dinámico de tamaño de página
- ✅ Navegación entre páginas con validación
- ✅ Información de paginación calculada automáticamente

**API Principal:**
```javascript
const {
  selectedPageSize,      // Tamaño de página actual
  paginationInfo,        // Info calculada (start, end, total)
  onPage,               // Cambio de página
  onPageSizeChange      // Cambio de tamaño
} = useTablePagination(config, props, emit)
```

### **useTableSelection.js - Selección Inteligente**

**Ubicación:** `src/composables/datatable/useTableSelection.js`

**Funcionalidades:**
- ✅ Selección individual y múltiple
- ✅ Selección por criterios (urgentes, por cartera)
- ✅ Estadísticas automáticas de selección
- ✅ Resumen financiero para expedientes

**API Principal:**
```javascript
const {
  selectedItems,        // Elementos seleccionados
  selectionMode,        // Modo de selección de PrimeVue
  selectionInfo,        // Estadísticas de selección
  onSelectionChange,    // Manejador de cambios
  clearSelection,       // Limpiar selección
  selectAll,           // Seleccionar todos
  selectUrgent         // Seleccionar urgentes
} = useTableSelection(config, props, emit)
```

### **useTableData.js - Gestión de Datos**

**Ubicación:** `src/composables/datatable/useTableData.js`

**Funcionalidades:**
- ✅ Gestión de filas expandidas
- ✅ Configuración dinámica de columnas
- ✅ Métodos de navegación de paginación
- ✅ Funciones de exportación

**API Principal:**
```javascript
const {
  expandedRows,         // Filas expandidas
  allColumns,          // Todas las columnas configuradas
  visibleColumns,      // Solo columnas visibles
  onRowExpand,         // Expandir fila
  onRowCollapse,       // Colapsar fila
  refreshTable,        // Refrescar datos
  exportToExcel        // Exportar a Excel
} = useTableData(config, props, emit)
```

---

## 🧩 Composables de Negocio

### **useExpedientesTable.js - Lógica Específica**

**Ubicación:** `src/composables/useExpedientesTable.js`

**Responsabilidades:**
- ✅ Lógica de negocio específica de expedientes
- ✅ Manejo de acciones personalizadas (ver, editar, generar documento)
- ✅ Estadísticas especializadas de expedientes
- ✅ Integración con emits específicos del componente padre

**Acciones Específicas:**
```javascript
const onAction = ({ action, data }) => {
  switch (action) {
    case 'view':
      viewExpediente(data)
      break
    case 'edit':
      editExpediente(data)
      break
    case 'generateDocument':
      generateDocument(data)
      break
    case 'duplicateExpediente':
      duplicateExpediente(data)
      break
  }
}
```

**Estadísticas Especializadas:**
```javascript
const getExpedientesStats = () => ({
  total: expedientes.length,
  totalPrincipal: suma_principal,
  totalIntereses: suma_intereses,
  urgentes: count_urgentes,
  conEmbargos: count_embargos,
  carteras: array_carteras_unicas
})
```

---

## 🎨 Sistema de Estilos

### **datatable.css - Estilos Base**

**Ubicación:** `src/styles/datatable.css`

**Características:**
- 🎨 Usa tokens CSS de iggsad (`--iggsad-*`)
- 🎨 Headers sticky funcionales
- 🎨 Efectos hover mejorados
- 🎨 Filas seleccionadas destacadas
- 🎨 Animaciones sutiles
- 🎨 Sistema responsive

**Clases Principales:**
```css
.datatable-generic-container    /* Contenedor principal */
.datatable-generic-header       /* Headers de la tabla */
.datatable-generic-body         /* Cuerpo de la tabla */
.expand-column                  /* Columna de expansión */
.selection-column               /* Columna de selección */
.acciones-column               /* Columna de acciones */
```

**Estilos de Expansión:**
```css
.expanded-row-content          /* Contenido expandido */
.expansion-grid               /* Grid de secciones */
.detail-section              /* Cada sección de detalles */
.detail-item                 /* Cada elemento de detalle */
```

### **expedientes-table.css - Estilos Específicos**

**Ubicación:** `src/styles/expedientes-table.css`

**Características:**
- 🎨 Estilos específicos para tipos de celda de expedientes
- 🎨 Formateo visual de importes monetarios
- 🎨 Badges y tags especializados
- 🎨 Indicadores de urgencia

---

## 📝 Implementación Específica: ExpedientesTable.vue

### **Estructura del Componente**

**Ubicación:** `src/components/expedientes/ExpedientesTable.vue`

```vue
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="expedientes"
    :loading="loading"
    :pagination="pagination"
    :selected-items="selectedItems"
    :expanded-rows="expandedRows"
    @page="onPage"
    @sort="onSort"
    @refresh="onRefresh"
    @export="onExport"
    @action="onAction"
    @row-expand="onRowExpand"
    @row-collapse="onRowCollapse"
    @selection-change="onSelectionChange"
  />
</template>

<script setup>
import { computed } from 'vue'
import DataTableGeneric from '@/components/datatable/DataTableGeneric.vue'
import { EXPEDIENTES_TABLE_CONFIG } from '@/constants/datatableConfig/expedientesTableConfig'
import { useExpedientesTable } from '@/composables/useExpedientesTable'

// Props heredadas del componente original
const props = defineProps({
  expedientes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, required: true }
})

// Emits específicos
const emit = defineEmits([
  'page', 'sort', 'refresh', 'export', 
  'row-expand', 'selection-change'
])

// Integración con composable específico
const {
  selectedItems, expandedRows, onPage, onSort,
  onRefresh, onExport, onAction, onSelectionChange,
  getExpedientesStats
} = useExpedientesTable(props, emit)

// Configuración reactiva
const tableConfig = computed(() => EXPEDIENTES_TABLE_CONFIG)
</script>
```

---

## 🚀 Guía de Implementación

### **Crear Nueva Tabla (Ejemplo: ClientesTable)**

#### **1. Crear Configuración**
```javascript
// constants/datatableConfig/clientesTableConfig.js
export const CLIENTES_TABLE_CONFIG = {
  meta: {
    name: 'clientes',
    title: 'Gestión de Clientes',
    icon: 'pi pi-users',
    selectable: true,
    expandable: false,
    dataKey: 'id'
  },
  
  columns: [
    { field: 'codigo', header: 'Código', type: 'code', visible: true },
    { field: 'nombre', header: 'Nombre', type: 'person', visible: true },
    { field: 'email', header: 'Email', type: 'text', visible: true },
    { field: 'deudaTotal', header: 'Deuda', type: 'money', visible: true }
  ],
  
  actions: {
    ...COMMON_TABLE_ACTIONS,
    view: { ...COMMON_TABLE_ACTIONS.view, tooltip: 'Ver cliente' }
  },
  
  pagination: COMMON_PAGINATION_CONFIG,
  pt: COMMON_TABLE_PT,
  classes: COMMON_TABLE_CLASSES
}
```

#### **2. Crear Composable Específico**
```javascript
// composables/useClientesTable.js
export function useClientesTable(props, emit) {
  const selectedItems = ref([])
  
  const onAction = ({ action, data }) => {
    switch (action) {
      case 'view':
        viewCliente(data)
        break
      case 'edit':
        editCliente(data)
        break
    }
  }
  
  const viewCliente = (cliente) => {
    emit('view-cliente', cliente)
  }
  
  return {
    selectedItems,
    onAction,
    viewCliente
  }
}
```

#### **3. Crear Componente**
```vue
<!-- components/clientes/ClientesTable.vue -->
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="clientes"
    :loading="loading"
    :pagination="pagination"
    @action="onAction"
  />
</template>

<script setup>
import { computed } from 'vue'
import DataTableGeneric from '@/components/datatable/DataTableGeneric.vue'
import { CLIENTES_TABLE_CONFIG } from '@/constants/datatableConfig/clientesTableConfig'
import { useClientesTable } from '@/composables/useClientesTable'

const props = defineProps({
  clientes: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  pagination: { type: Object, required: true }
})

const emit = defineEmits(['view-cliente'])

const { onAction } = useClientesTable(props, emit)
const tableConfig = computed(() => CLIENTES_TABLE_CONFIG)
</script>
```

---

## ✅ Estado Actual del Sistema

### **Funcionalidades Completadas**
- ✅ **DataTableGeneric** integra todos los composables
- ✅ **Expansión de filas** funciona con template personalizado
- ✅ **Botones de acciones** (Ver/Editar) aparecen correctamente
- ✅ **Configuración centralizada** completamente modular
- ✅ **Estilos unificados** con tokens CSS
- ✅ **Sistema de tipos de columna** extensible
- ✅ **ExpedientesTable** funciona como referencia

### **Pendientes**
- ⚠️ **Paginador**: Implementar lazy loading real
- 📝 **Nuevos tipos de columna**: rating, progress, etc.
- 🔍 **Búsqueda avanzada**: Filtros integrados
- 📊 **Gráficos inline**: Métricas visuales en columnas

---

## 🔍 Referencias Rápidas

### **Archivos Clave para Modificar**
- **Añadir nueva tabla**: `constants/datatableConfig/` + `composables/`
- **Nuevo tipo de columna**: `ColumnRenderer.vue`
- **Nueva acción**: `COMMON_TABLE_ACTIONS` en `commonTableConfig.js`
- **Estilos globales**: `styles/datatable.css`
- **Estilos específicos**: `styles/[tabla]-table.css`

### **Composables Disponibles**
- `useTableSorting` → Ordenación múltiple
- `useTablePagination` → Paginación serverside
- `useTableSelection` → Selección inteligente
- `useTableData` → Gestión general de datos
- `useExpedientesTable` → Lógica específica de expedientes

### **Configuraciones Base**
- `COMMON_TABLE_ACTIONS` → Acciones reutilizables
- `COMMON_TABLE_FORMATTERS` → Formatters compartidos
- `COMMON_PAGINATION_CONFIG` → Configuración de paginación
- `COMMON_TABLE_PT` → PassThrough para estilos

---

*Documentación generada para el Sistema de Gestión Procesal | DataTable Genérico v1.0*