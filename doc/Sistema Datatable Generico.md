# 📊 DataTableGeneric - Documentación de Uso

## 🎯 **Resumen**

`DataTableGeneric` es un componente reutilizable que encapsula PrimeVue DataTable con funcionalidades avanzadas: paginación, ordenación, selección, expansión y menú contextual.

---

## 🏗️ **Arquitectura**

### **Componente Principal:**
- `DataTableGeneric.vue` - Componente reutilizable
- Usa **PrimeVue DataTable nativo** 
- **Estado local simple** (sin composables complejos)
- **Composables especializados** solo para funcionalidades específicas

### **Composables Incluidos:**
- `useTableSorting` - Ordenación múltiple
- `useTablePagination` - Paginación adaptada a PrimeVue

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

**¡DataTableGeneric: Simple, Potente y Reutilizable!** 🚀