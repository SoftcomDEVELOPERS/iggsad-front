# 🗺️ Esquema de Relaciones del Dashboard System

## 📋 **Jerarquía de Componentes**

```
📁 src/views/Dashboard.vue (PRINCIPAL)
├── 🔍 SearchBar.vue
├── 🎛️ FilterPanel.vue (en Drawer)
├── 🎯 Dock.vue
├── 📊 DashboardGrid.vue (CONTENEDOR DEL GRID)
│   ├── 🎴 GridCard.vue (WRAPPER UNIVERSAL)
│   │   ├── 📈 StatsDashboard.vue
│   │   ├── 🔍 RecentSearchesCard.vue
│   │   ├── 🔔 NotificationsCard.vue
│   │   ├── 💬 ChatCard.vue
│   │   ├── ⚡ QuickActionsCard.vue
│   │   └── 🛠️ CustomCard.vue (NUEVO)
│   └── ⚙️ DashboardConfigPanel.vue (MODAL)
│       ├── 📚 CardLibrary.vue (NUEVO)
│       ├── 📊 StatsSelector.vue (NUEVO)
│       └── 🔧 CustomCard.vue (integrado)
└── 🗃️ useUserDashboard.js (COMPOSABLE)
```

## 🔄 **Flujo de Datos y Eventos**

### **1. Dashboard.vue (Controlador Principal)**
```javascript
// Estado centralizado
const dashboardLayout = ref([...])     // Layout del grid
const cardsConfig = ref({...})         // Configuración de cada card
const cardsData = ref({...})           // Datos para las cards
const showConfigPanel = ref(false)     // Control del modal
const configMode = ref(false)          // Modo configuración ON/OFF

// Funciones principales
const handleLayoutUpdate = (newLayout) => { /* Guarda cambios */ }
const handleCardAdded = (cardData) => { /* Añade nueva card */ }
const handleCardRemoved = (cardId) => { /* Elimina card */ }
const toggleConfigMode = () => { /* Activa/desactiva modo config */ }
```

### **2. DashboardGrid.vue (Motor del Grid)**
```javascript
// Props recibidas
props: {
  layout: Array,           // Layout actual
  cardsConfig: Object,     // Configuración de cards
  cardsData: Object,       // Datos de las cards
  configMode: Boolean      // Modo configuración
}

// Eventos emitidos
emit('layout-updated', newLayout)
emit('card-removed', cardId)
emit('card-configured', cardId)
emit('show-card-library')            // Para abrir CardLibrary
```

### **3. DashboardConfigPanel.vue (Panel de Control)**
```javascript
// Props recibidas
props: {
  visible: Boolean,
  dashboardLayout: Array,
  cardsConfig: Object,
  availableCards: Array
}

// Componentes internos
- CardLibrary.vue          // Gestión de cards disponibles
- StatsSelector.vue        // Configuración de estadísticas
- CustomCard configurador  // Editor de widgets personalizados

// Eventos emitidos
emit('save')               // Guardar configuración
emit('card-added', item)   // Nueva card añadida
emit('card-removed', id)   // Card eliminada
```

### **4. CardLibrary.vue (Gestión de Cards)**
```javascript
// Funcionalidades
- Mostrar cards disponibles con preview
- Filtrar por categoría/búsqueda
- Añadir/quitar cards del dashboard
- Importar/exportar configuraciones

// Eventos emitidos
emit('card-added', cardItem)
emit('card-removed', cardId)
emit('close')
```

### **5. StatsSelector.vue (Configurador de Estadísticas)**
```javascript
// Funcionalidades
- Seleccionar qué estadísticas mostrar
- Configurar layout del grid (2x2, 1x4, etc.)
- Opciones específicas por estadística
- Preview en tiempo real

// Eventos emitidos
emit('apply', statsConfig)
emit('cancel')
emit('close')
```

### **6. CustomCard.vue (Widgets Personalizados)**
```javascript
// Funcionalidades
- Editor de código (HTML, CSS, JS)
- Plantillas predefinidas
- Múltiples tipos de contenido
- Ejecución segura de código

// Eventos emitidos
emit('update-config', cardId, newConfig)
```

## 🎯 **Cards Individuales**

### **StatsDashboard.vue**
```javascript
// Contenido: Mini-grid de estadísticas personalizable
// Configuración: selectedStats, gridLayout, opciones por stat
// Datos: Valores actuales de cada estadística
```

### **GridCard.vue (Wrapper Universal)**
```javascript
// Funcionalidades:
- Toolbar de configuración (solo en configMode)
- Botones de editar/eliminar
- Contenedor para cualquier tipo de card
- Manejo de resize y drag&drop
```

## 📊 **Flujo de Configuración Completo**

```
1. Usuario hace clic en "⚙️ Configurar Dashboard"
   ↓
2. Dashboard.vue abre DashboardConfigPanel.vue
   ↓
3. DashboardConfigPanel muestra:
   - Vista previa del layout actual
   - Botones "Librería de Cards" y "Configurar Estadísticas"
   ↓
4a. Si elige "Librería de Cards":
    - Abre CardLibrary.vue
    - Usuario navega/filtra cards disponibles
    - Puede añadir/quitar cards
    - CardLibrary emite 'card-added'/'card-removed'
    ↓
4b. Si elige "Configurar Estadísticas":
    - Abre StatsSelector.vue
    - Usuario selecciona stats y layout
    - StatsSelector emite 'apply' con nueva configuración
    ↓
5. DashboardConfigPanel recoge todos los cambios
   ↓
6. Usuario hace clic en "Guardar Cambios"
   ↓
7. DashboardConfigPanel emite 'save'
   ↓
8. Dashboard.vue actualiza el estado y guarda en userProfile
   ↓
9. DashboardGrid.vue re-renderiza con la nueva configuración
```

## 🔗 **Comunicación de Datos**

### **useUserDashboard.js (Composable Central)**
```javascript
// Gestiona:
- Configuración del dashboard desde el store de usuario
- CRUD de cards (añadir, eliminar, modificar)
- Validación de configuraciones
- Import/export de layouts
- Gestión del modo configuración

// Conecta con:
- stores/auth.js (userProfile.dashboard)
- Componentes del dashboard
- Persistencia de datos
```

### **Stores/Auth.js**
```javascript
userProfile: {
  dashboard: {
    layout: [                    // Array de posiciones vue-grid-layout
      { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
      { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
      // ...
    ],
    cardsConfig: {               // Configuración específica por card
      'stats-dashboard': {
        selectedStats: ['casos-activos', 'audiencias-proximas'],
        gridLayout: 'auto'
      },
      'custom-widget-1': {
        customHtml: '<div>...</div>',
        customCss: '.clase {...}',
        contentType: 'html'
      }
    }
  }
}
```

## 🚀 **Eventos del Sistema**

### **Dashboard.vue (Controlador)**
```javascript
@layout-updated="handleLayoutUpdate"      // DashboardGrid cambió layout
@card-removed="handleCardRemoved"         // Card eliminada
@card-configured="handleCardConfigured"   // Card editada
@config-save="handleConfigSave"           // Guardar configuración
@show-card-library="showCardLibrary = true" // Mostrar librería
```

### **DashboardGrid.vue (Grid Manager)**
```javascript
@layout-updated="emit('layout-updated')"     // Layout cambió por drag&drop
@card-removed="emit('card-removed')"         // Card eliminada
@card-config-updated="emit('card-updated')"  // Configuración de card cambió
```

### **CardLibrary.vue (Gestión de Cards)**
```javascript
@card-added="emit('card-added')"          // Nueva card seleccionada
@card-removed="emit('card-removed')"      // Card deseleccionada
@close="showCardLibrary = false"          // Cerrar modal
```

### **StatsSelector.vue (Configurador Stats)**
```javascript
@apply="emit('apply')"                    // Aplicar configuración
@cancel="emit('cancel')"                  // Cancelar cambios
@close="showStatsSelector = false"       // Cerrar modal
```

## 📱 **Responsive Behavior**

### **Breakpoints (vue-grid-layout)**
```javascript
breakpoints: { lg: 1200, md: 768, sm: 576, xs: 0 }
cols: { lg: 12, md: 8, sm: 4, xs: 2 }
rowHeight: { lg: 60, md: 60, sm: 70, xs: 80 }
```

### **Adaptación de Cards**
- **Desktop (lg)**: Grid completo de 12 columnas
- **Tablet (md)**: 8 columnas, reorganización automática
- **Mobile (sm/xs)**: Stack vertical, 4/2 columnas

---

**¡Este es el sistema completo funcionando en armonía! 🎼**