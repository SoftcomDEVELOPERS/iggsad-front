# 📊 DataTableGeneric - Documentación de Uso

## 🎯 **Resumen**

`DataTableGeneric` es un componente reutilizable que encapsula PrimeVue DataTable con funcionalidades avanzadas: paginación, ordenación, selección, expansión y menú contextual.

---

## 🏗️ **Arquitectura**

### **Componentes del Sistema:**
- `DataTableGeneric.vue` - Componente principal reutilizable
- `ColumnRenderer.vue` - Renderizado especializado por tipo de columna
- `TableActions.vue` - Componente de acciones de fila configurable
- Usa **PrimeVue DataTable nativo** como base
- **Estado local simple** (sin composables complejos)
- **Composables especializados** solo para funcionalidades específicas

### **Composables Incluidos:**
- `useTableSorting` - Ordenación múltiple
- `useTablePagination` - Paginación adaptada a PrimeVue
- `useTableActions` - Gestión de acciones de fila

---

## 🔧 **Cómo Usar DataTableGeneric**

### **1. Estructura Básica:**

```vue
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="items"
    :loading="loading"
    :pagination="pagination"
    @page="handlePage"
    @action="handleAction"
  />
</template>

<script setup>
import DataTableGeneric from '@/components/datatable/DataTableGeneric.vue'
import { MI_TABLE_CONFIG } from '@/constants/datatableConfig/miTableConfig.js'

const tableConfig = computed(() => MI_TABLE_CONFIG)
</script>
```

### **2. Props Requeridas:**

| Prop | Tipo | Descripción |
|------|------|-------------|
| `config` | Object | Configuración de la tabla (columnas, acciones, etc.) |
| `data` | Array | Datos a mostrar |
| `loading` | Boolean | Estado de carga |
| `pagination` | Object | `{ page: 1, pageSize: 25, total: 0 }` |

### **3. Eventos Principales:**

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `@page` | Cambio de página | `pageNumber` (base 1) |
| `@page-size-change` | Cambio de tamaño | `newPageSize` |
| `@sort` | Ordenación | `sortMeta` |
| `@action` | Acción de fila | `{ action, data }` |
| `@selection-change` | Selección | `selectedItems[]` |

---

## ⚙️ **Configuración de Tabla**

### **Archivo de Configuración:**

```javascript
// constants/datatableConfig/miTableConfig.js
export const MI_TABLE_CONFIG = {
  // Metadatos
  meta: {
    name: 'items',
    title: 'Mi Tabla',
    icon: 'pi pi-list',
    selectable: true,     // Checkboxes
    expandable: true,     // Flechas de expansión
    dataKey: 'id'
  },
  
  // Columnas
  columns: [
    { 
      field: 'nombre', 
      header: 'Nombre', 
      visible: true,
      sortable: true,
      type: 'text'
    },
    { 
      field: 'precio', 
      header: 'Precio', 
      visible: true,
      type: 'money' 
    }
  ],
  
  // Acciones (botones en columna)
  actions: {
    view: { 
      icon: 'pi pi-eye', 
      tooltip: 'Ver detalles',
      enabled: true 
    },
    edit: { 
      icon: 'pi pi-pencil', 
      tooltip: 'Editar',
      enabled: true 
    }
  },
  
  // Menú contextual (botón 3 puntos)
  contextMenu: [
    { label: 'Ver Detalles', icon: 'pi pi-eye', action: 'view' },
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
    { separator: true },
    { label: 'Eliminar', icon: 'pi pi-trash', action: 'delete' }
  ],
  
  // Expansión de filas
  expansion: {
    enabled: true,
    sections: [
      {
        title: 'Información Adicional',
        fields: [
          { field: 'descripcion', label: 'Descripción' },
          { field: 'fecha', label: 'Fecha', type: 'date' }
        ]
      }
    ]
  }
}
```

---

## 🔄 **Composables**

### **useTablePagination**

**Se adapta a PrimeVue**, no lucha contra él:

```javascript
const { 
  currentPageSize,     // Tamaño actual de página
  firstRowIndex,       // Índice para :first de PrimeVue
  paginatorTemplate,   // Template del paginador
  onPage,              // Manejador de cambio de página  
  onPageSizeChange     // Manejador de cambio de tamaño
} = useTablePagination(config, props, emit)
```

**Eventos automáticos:**
- Convierte página base-0 (PrimeVue) → base-1 (nuestro sistema)
- Emite `page-size-change` cuando cambia el dropdown

### **useTableSorting**

```javascript
const { 
  multiSortMeta,       // Para PrimeVue
  onSort               // Manejador de ordenación
} = useTableSorting(config, props, emit)
```

---

## 📱 **Integración con Store**

### **En el Store:**

```javascript
// stores/miStore.js
export const useMiStore = defineStore('miStore', {
  state: () => ({
    items: [],
    loading: false,
    pagination: { page: 1, pageSize: 25, total: 0 }
  }),
  
  actions: {
    async changePage(newPage) {
      // Cambiar página manteniendo filtros
      await this.searchItems(this.activeFilters, this.searchQuery, newPage, this.pagination.pageSize)
    },
    
    async changePageSize(newPageSize) {
      // Cambiar tamaño, resetear a página 1
      await this.searchItems(this.activeFilters, this.searchQuery, 1, newPageSize)
    }
  }
})
```

### **En el Componente Padre:**

```vue
<template>
  <MiTable
    :items="miStore.items"
    :loading="miStore.loading"
    :pagination="miStore.pagination"
    @page="miStore.changePage"
    @page-size-change="miStore.changePageSize"
  />
</template>
```

---

## 🎨 **Estilos**

### **CSS Genérico:**
- `datatable.css` - Estilos base para todas las tablas

### **CSS Específico:**
- `mi-table.css` - Solo estilos específicos de tu tabla
- **NO duplicar** estilos que ya están en `datatable.css`

### **Clases PassThrough:**
```javascript
// En la configuración
pt: {
  root: 'mi-table-root',
  header: 'mi-table-header', 
  body: 'mi-table-body'
}
```

---

## ✅ **Estado Local vs Composables**

### **✅ Estado Local (Recomendado):**
```javascript
// Estado simple sin composables complejos
const selectedItems = ref([])
const expandedRows = ref([])

// Sincronización con props
watch(() => props.selectedItems, (newVal) => {
  selectedItems.value = [...newVal]
})
```

### **❌ Evitar:**
- Composables que manejen estado que PrimeVue ya maneja
- Duplicar estado entre props y composables
- Manejadores custom que interfieran con PrimeVue

---

## 🔧 **Crear Nueva Tabla**

### **1. Crear Configuración:**
```bash
# constants/datatableConfig/miTableConfig.js
```

### **2. Crear Componente Wrapper:**
```vue
<!-- components/miTable/MiTable.vue -->
<template>
  <DataTableGeneric
    :config="tableConfig"
    :data="items"
    :loading="loading"
    :pagination="pagination"
    @page="$emit('page', $event)"
    @action="handleAction"
  />
</template>
```

### **3. Usar en Vista:**
```vue
<MiTable 
  :items="store.items"
  :pagination="store.pagination"
  @page="store.changePage"
/>
```

---

## 🎯 **Reglas de Oro**

1. **Déjate llevar por PrimeVue** - No luches contra él
2. **Estado local simple** - Sin composables complejos para selección/expansión  
3. **Un composable = Una responsabilidad** - No mezclar funcionalidades
4. **Configuración centralizada** - Todo en el archivo de config
5. **CSS sin duplicaciones** - Genérico en `datatable.css`, específico en archivos propios

---

## 🐛 **Troubleshooting**

### **Paginador no funciona:**
- ✅ Verificar que el store tenga `changePage` y `changePageSize`
- ✅ Comprobar que `pagination` tenga `{ page, pageSize, total }`

### **Expansión marca checkboxes:**
- ✅ Verificar que no hay composables de selección interfiriendo
- ✅ Usar estado local simple

### **CSS no se aplica:**
- ✅ Comprobar que las clases `:pt` estén bien configuradas
- ✅ Verificar que no hay estilos duplicados interfiriendo

---

---

## 📦 **Componentes Auxiliares No Documentados**

### **ColumnRenderer.vue** - Renderizado Especializado por Tipo

**Propósito:** Renderiza diferentes tipos de columnas según su configuración.

**Tipos soportados:**
- `text` - Texto simple
- `number` - Números con formato
- `money` - Valores monetarios
- `date` - Fechas formateadas
- `boolean` - Valores verdadero/falso
- `badge` - Badges de estado
- `avatar` - Avatares de usuario

**Uso interno:**
```vue
<Column v-for="col in visibleColumns" :key="col.field">
  <template #body="{ data }">
    <ColumnRenderer 
      :column="col"
      :data="data"
      :value="data[col.field]"
    />
  </template>
</Column>
```

**Configuración en column:**
```javascript
{
  field: 'amount',
  type: 'money',
  format: { currency: 'EUR', decimals: 2 }
}
```

### **TableActions.vue** - Acciones de Fila Configurables

**Propósito:** Renderiza botones de acción para cada fila según configuración.

**Características:**
- **Botones individuales**: Según `config.actions`
- **Menú contextual**: Botón "⋮" con opciones adicionales
- **Estados condicionales**: enabled/disabled por fila
- **Tooltips automáticos**: Según configuración
- **Confirmaciones**: Para acciones destructivas

**Estructura actions:**
```javascript
actions: {
  view: { 
    icon: 'pi pi-eye', 
    tooltip: 'Ver detalles',
    enabled: (data) => data.status !== 'deleted'
  },
  edit: { 
    icon: 'pi pi-pencil', 
    tooltip: 'Editar',
    enabled: (data) => data.canEdit
  },
  delete: { 
    icon: 'pi pi-trash', 
    tooltip: 'Eliminar',
    confirm: true,
    enabled: true
  }
}
```

**Eventos emitidos:**
```javascript
// Acción directa de botón
@action="{ action: 'view', data: rowData }"

// Acción desde menú contextual  
@action="{ action: 'delete', data: rowData }"
```

### **useTableActions.js** - Composable Gestión de Acciones

**Propósito:** Maneja la lógica de acciones de fila y menú contextual.

**Funcionalidades:**
- Filtrado de acciones visibles/habilitadas
- Construcción automática del menú contextual
- Gestión de confirmaciones
- Emit de eventos de acción

**Uso:**
```javascript
const { 
  visibleActions,      // Acciones como botones
  contextMenuItems,    // Items para menú contextual  
  handleAction,        // Manejador de acciones
  confirmAction        // Confirmación de acciones
} = useTableActions(config, props, emit)
```

---

## 🔍 **Configuración Avanzada Real**

### **Configuración Completa de Tabla (Ejemplo Real)**

```javascript
// constants/datatableConfig/expedientesTableConfig.js
export const EXPEDIENTES_TABLE_CONFIG = {
  meta: {
    name: 'expedientes',
    title: 'Gestión de Expedientes', 
    icon: 'pi pi-folder',
    selectable: true,
    expandable: true,
    dataKey: 'numeroExpediente'
  },
  
  columns: [
    { 
      field: 'numeroExpediente', 
      header: 'N° Expediente',
      type: 'text',
      sortable: true,
      visible: true,
      width: '120px'
    },
    { 
      field: 'cliente', 
      header: 'Cliente',
      type: 'text', 
      sortable: true,
      visible: true
    },
    { 
      field: 'deudaPendiente', 
      header: 'Deuda',
      type: 'money',
      sortable: true,
      visible: true,
      format: { currency: 'EUR' }
    },
    { 
      field: 'estado', 
      header: 'Estado',
      type: 'badge',
      visible: true,
      format: {
        'Activo': 'success',
        'Pendiente': 'warning', 
        'Cerrado': 'secondary'
      }
    },
    { 
      field: 'fechaCreacion', 
      header: 'Fecha Creación',
      type: 'date',
      sortable: true,
      visible: true,
      format: 'dd/MM/yyyy'
    }
  ],
  
  actions: {
    view: { 
      icon: 'pi pi-eye', 
      tooltip: 'Ver detalles',
      enabled: true
    },
    edit: { 
      icon: 'pi pi-pencil', 
      tooltip: 'Editar expediente',
      enabled: (data) => data.estado !== 'Cerrado'
    },
    documents: { 
      icon: 'pi pi-file', 
      tooltip: 'Documentos',
      enabled: true
    }
  },
  
  contextMenu: [
    { label: 'Ver Detalles', icon: 'pi pi-eye', action: 'view' },
    { label: 'Editar', icon: 'pi pi-pencil', action: 'edit' },
    { label: 'Ver Documentos', icon: 'pi pi-file', action: 'documents' },
    { separator: true },
    { label: 'Marcar como Urgente', icon: 'pi pi-exclamation-triangle', action: 'urgent' },
    { label: 'Asignar Abogado', icon: 'pi pi-user', action: 'assign' },
    { separator: true },
    { label: 'Exportar PDF', icon: 'pi pi-download', action: 'export' },
    { label: 'Archivar', icon: 'pi pi-archive', action: 'archive' }
  ],
  
  expansion: {
    enabled: true,
    sections: [
      {
        title: 'Información del Cliente',
        fields: [
          { field: 'cliente.nombre', label: 'Nombre Completo' },
          { field: 'cliente.dni', label: 'DNI' },
          { field: 'cliente.telefono', label: 'Teléfono' },
          { field: 'cliente.email', label: 'Email' }
        ]
      },
      {
        title: 'Detalles del Expediente', 
        fields: [
          { field: 'descripcion', label: 'Descripción', type: 'text' },
          { field: 'juzgado', label: 'Juzgado' },
          { field: 'tipoExpediente', label: 'Tipo' },
          { field: 'prioridad', label: 'Prioridad', type: 'badge' }
        ]
      }
    ]
  }
}
```

**¡DataTableGeneric: Simple, Potente y Reutilizable!** 🚀