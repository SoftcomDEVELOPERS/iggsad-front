# 📊 Sistema de Dashboard - Documentación Completa

## 🎯 Introducción

El sistema de Dashboard de la aplicación es una solución **modular**, **configurable** y **responsive** que permite a los usuarios personalizar completamente su experiencia de trabajo. Construido con **Vue 3**, **grid-layout-plus** y **PrimeVue**, ofrece un entorno intuitivo donde cada usuario puede organizar la información según sus necesidades específicas.

---

## 🏗️ Arquitectura del Sistema

### **Jerarquía de Componentes**

```
📁 src/views/Dashboard.vue (CONTROLADOR PRINCIPAL)
├── 🔍 SearchBar.vue
├── 🎛️ FilterPanel.vue (en Drawer)
├── 🎯 Dock.vue
├── 📊 DashboardGrid.vue (MOTOR DEL GRID)
│   ├── 🎴 GridCard.vue (WRAPPER UNIVERSAL)
│   │   ├── 📈 StatsDashboard.vue
│   │   ├── 🔍 RecentSearchesCard.vue
│   │   ├── 🔔 NotificationsCard.vue
│   │   ├── 💬 ChatCard.vue
│   │   ├── ⚡ QuickActionsCard.vue
│   │   └── 🛠️ CustomCard.vue
│   └── ⚙️ DashboardConfigPanel.vue (PANEL DE CONTROL)
│       ├── 📚 CardLibrary.vue
│       ├── 📊 StatsSelector.vue
│       └── 🔧 CustomCard configurador
└── 🗃️ useUserDashboard.js (COMPOSABLE CENTRAL)
```

### **Componentes Clave**

#### **1. Dashboard.vue** - El Controlador Principal
**Responsabilidades:**
- Gestión del estado global del dashboard
- Coordinación entre todos los componentes
- Manejo de la configuración del usuario
- Control del modo configuración

**Estado Principal:**
```javascript
const dashboardLayout = ref([...])     // Layout del grid
const cardsConfig = ref({...})         // Configuración específica de cada card
const cardsData = ref({...})           // Datos dinámicos para las cards
const showConfigPanel = ref(false)     // Control del modal de configuración
const configMode = ref(false)          // Modo configuración activo/inactivo
```

#### **2. DashboardGrid.vue** - El Motor del Grid
**Características:**
- Utiliza `grid-layout-plus` para el sistema de grid drag & drop
- Responsive con breakpoints configurables
- Modo configuración con ayudas visuales
- Gestión automática de colisiones

**Configuración del Grid:**
```javascript
const colNum = 12                       // Columnas base
const rowHeight = 60                    // Altura de cada fila
const breakpoints = { 
  lg: 1200, md: 768, sm: 576, xs: 0 
}
const responsiveCols = { 
  lg: 12, md: 8, sm: 4, xs: 2 
}
```

#### **3. GridCard.vue** - Wrapper Universal
**Funcionalidad:**
- Contenedor común para todas las cards
- Overlay de configuración en modo edición
- Handles de redimensionamiento
- Gestión de estados hover/focus

---

## 🔧 Sistema de Configuración

### **DashboardConfigPanel.vue** - Panel de Control Central

**Opciones Disponibles:**
- **Vista Previa del Layout**: Muestra la configuración actual
- **Librería de Cards**: Añadir/quitar componentes
- **Configurador de Estadísticas**: Personalizar métricas
- **Importar/Exportar**: Gestión de configuraciones

### **CardLibrary.vue** - Gestión de Componentes

**Cards Disponibles:**
```javascript
const availableCards = [
  {
    id: 'stats-dashboard',
    title: 'Panel de Estadísticas',
    description: 'Dashboard con múltiples métricas',
    icon: 'pi pi-chart-bar',
    category: 'stats',
    recommendedSize: { w: 8, h: 4 }
  },
  {
    id: 'recent-searches',
    title: 'Búsquedas Recientes',
    description: 'Historial de búsquedas con acciones rápidas',
    icon: 'pi pi-search',
    category: 'content',
    recommendedSize: { w: 8, h: 5 }
  },
  // ... más cards
]
```

**Categorías de Cards:**
- **📊 stats**: Estadísticas y métricas
- **📄 content**: Contenido y navegación
- **💬 communication**: Notificaciones y mensajes
- **⚡ productivity**: Herramientas de productividad
- **📅 scheduling**: Calendario y citas
- **📋 documents**: Gestión documental

### **StatsSelector.vue** - Configurador de Estadísticas

**Estadísticas Disponibles:**
- Casos Activos
- Audiencias Próximas
- Casos Urgentes
- Total Clientes
- Deudas Pendientes
- Documentos Subidos
- Tareas Completadas

**Layouts de Grid:**
- **Auto**: Distribución automática
- **2x2**: Grid cuadrado
- **1x4**: Horizontal
- **4x1**: Vertical

---

## 💾 Persistencia de Datos

### **Stores/Auth.js** - Almacenamiento Central

**Estructura del UserProfile:**
```javascript
userProfile: {
  dashboard: {
    layout: [                    // Posiciones vue-grid-layout
      { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
      { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
      // ...
    ],
    cardsConfig: {               // Configuración específica
      'stats-dashboard': {
        selectedStats: ['casos-activos', 'audiencias-proximas'],
        gridLayout: 'auto',
        refreshInterval: 30000
      },
      'recent-searches': {
        maxItems: 5,
        showActions: true,
        autoRefresh: true
      }
    },
    lastModified: '2025-01-15T10:30:00Z'
  }
}
```

### **useUserDashboard.js** - Composable de Gestión

**Funcionalidades:**
- CRUD de cards (crear, leer, actualizar, eliminar)
- Validación de configuraciones
- Exportar/importar configuraciones
- Auto-guardado de cambios
- Gestión del modo configuración

**Métodos Principales:**
```javascript
const updateDashboardLayout = async (newLayout) => { /* ... */ }
const addCard = async (cardConfig) => { /* ... */ }
const removeCard = async (cardId) => { /* ... */ }
const updateCardConfig = async (cardId, config) => { /* ... */ }
const exportDashboardConfig = () => { /* ... */ }
const importDashboardConfig = (file) => { /* ... */ }
```

---

## 🎴 Cards Individuales

### **StatsDashboard.vue** - Panel de Estadísticas
**Características:**
- Grid interno configurable (2x2, 1x4, 4x1, auto)
- Métricas seleccionables
- Auto-actualización opcional
- Formato numérico con separadores
- Códigos de color por tipo de métrica

### **RecentSearchesCard.vue** - Búsquedas Recientes
**Funcionalidades:**
- Historial de búsquedas
- Acciones rápidas por búsqueda
- Información de expedientes
- Botón para limpiar historial
- Click para repetir búsqueda

### **NotificationsCard.vue** - Centro de Notificaciones
**Tipos de Notificaciones:**
- **info**: Información general
- **warning**: Advertencias
- **error**: Errores del sistema
- **success**: Confirmaciones
- **legal**: Notificaciones judiciales

### **ChatCard.vue** - Vista de Mensajes
**Características:**
- Preview de conversaciones
- Indicadores de mensajes no leídos
- Acceso rápido al chat completo
- Estados de usuarios online

### **QuickActionsCard.vue** - Acciones Rápidas
**Acciones Disponibles:**
- Nuevo Caso
- Nueva Audiencia
- Subir Documento
- Nuevo Cliente
- Generar Reporte

---

## 📱 Sistema Responsive

### **Breakpoints Configurados**
```javascript
breakpoints: { 
  lg: 1200,  // Desktop grande
  md: 768,   // Tablet/Desktop pequeño
  sm: 576,   // Tablet vertical
  xs: 0      // Móvil
}

cols: { 
  lg: 12,    // 12 columnas en desktop
  md: 8,     // 8 columnas en tablet
  sm: 4,     // 4 columnas en móvil grande
  xs: 2      // 2 columnas en móvil pequeño
}
```

### **Adaptación por Dispositivo**
- **Desktop (lg)**: Grid completo de 12 columnas, todas las funcionalidades
- **Tablet (md)**: 8 columnas, reorganización automática
- **Móvil (sm/xs)**: Stack vertical, interfaz simplificada

---

## 🔄 Flujo de Configuración

### **Proceso Completo de Personalización**

1. **Activación del Modo Configuración**
   - Usuario hace clic en "⚙️ Configurar Dashboard"
   - Se activa el modo de edición visual
   - Aparece toolbar con opciones

2. **Modificación del Layout**
   - **Arrastrar**: Mover cards por el grid
   - **Redimensionar**: Esquina inferior derecha
   - **Eliminar**: Botón X en cada card

3. **Gestión de Cards**
   - **Añadir**: Botón "+" → CardLibrary
   - **Configurar**: Botón configuración → opciones específicas
   - **Ordenar**: Drag & drop automático

4. **Configuración Avanzada**
   - Panel de configuración → DashboardConfigPanel
   - Selección de estadísticas → StatsSelector
   - Importar/exportar configuraciones

5. **Persistencia**
   - Auto-guardado cada cambio
   - Sincronización con userProfile
   - Respaldo en localStorage (fallback)

---

## 🎨 Personalización Visual

### **Estilos Adaptativos**
- **Modo Normal**: Cards con bordes sutiles, sombras ligeras
- **Modo Configuración**: Overlays azules, handles visibles
- **Estados Hover**: Elevación de cards, efectos sutiles
- **Drag & Drop**: Rotación y escala durante arrastre

### **Indicadores Visuales**
```css
/* Modo configuración activo */
.config-mode-active {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(59, 130, 246, 0.05) 10px,
    rgba(59, 130, 246, 0.05) 20px
  );
}

/* Card siendo arrastrada */
.grid-item.dragging {
  opacity: 0.8;
  transform: rotate(2deg) scale(1.02);
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

---

## 🚀 Eventos y Comunicación

### **Sistema de Eventos**

**Dashboard.vue** (Controlador):
```javascript
@layout-updated="handleLayoutUpdate"      // Grid cambió
@card-removed="handleCardRemoved"         // Card eliminada
@card-configured="handleCardConfigured"   // Card editada
@config-save="handleConfigSave"           // Guardar configuración
```

**DashboardGrid.vue** (Grid Manager):
```javascript
@layout-updated="emit('layout-updated')"     // Layout por drag&drop
@card-removed="emit('card-removed')"         // Card eliminada
@card-config-updated="emit('card-updated')"  // Config actualizada
```

**Componentes de Configuración**:
```javascript
// CardLibrary
@card-added="emit('card-added')"
@card-removed="emit('card-removed')"

// StatsSelector  
@apply="emit('apply')"
@cancel="emit('cancel')"
```

---

## 🔧 Servicios y Utilidades

### **HTTP Interceptor** - `src/services/httpInterceptor.js`
- Manejo automático de cookies
- Gestión de errores 401/403
- Redirección automática al login

### **Auth Services** - `src/services/auth.services.js`
- Login con cookies automáticas
- Verificación de autenticación
- Persistencia del userProfile

### **Toast System** - Notificaciones Especializadas
```javascript
// Variantes para gestión procesal
.toast-critical    // Eliminaciones, acciones irreversibles
.toast-system      // Mantenimiento, actualizaciones  
.toast-legal       // Notificaciones judiciales
.toast-financial   // Información financiera
.toast-deadline    // Vencimientos/deadlines
```

---

## 📊 Métricas y Datos

### **Datos Mock para Desarrollo**
```javascript
const mockData = {
  'stats-dashboard': {
    casosActivos: 145,
    audienciasProximas: 12,
    casosUrgentes: 8,
    totalClientes: 89
  },
  'recent-searches': [
    { expediente: 'EXP-2024-001', cliente: 'Juan Pérez', deuda: '€2,500' },
    { expediente: 'EXP-2024-002', cliente: 'María García', deuda: '€1,800' }
  ],
  'notifications': [
    { type: 'audiencia', message: 'Audiencia programada para mañana', time: '2 min' }
  ]
}
```

### **Auto-actualización Configurável**
- **StatsDashboard**: Cada 30 segundos (configurable)
- **Notifications**: Cada 60 segundos
- **Chat**: Cada 5 segundos
- **RecentSearches**: Solo manual

---

## 🛡️ Seguridad y Validaciones

### **Validaciones de Configuración**
- Layout válido (posiciones dentro del grid)
- Cards existentes (componentes disponibles)
- Configuraciones válidas por card
- Límites de tamaño (minW, maxW, minH, maxH)

### **Sanitización de Datos**
- Escape de HTML en custom cards
- Validación de CSS personalizado
- Filtrado de JavaScript malicioso

---

## 🔮 Funcionalidades Avanzadas

### **Import/Export de Configuraciones**
```javascript
// Estructura de exportación
{
  layout: [...],
  cardsConfig: {...},
  timestamp: '2025-01-15T10:30:00Z',
  version: '1.0.0'
}
```

### **CustomCard.vue** - Widgets Personalizados
- Editor de código HTML/CSS
- Plantillas predefinidas
- Ejecución segura en iframe
- Múltiples tipos de contenido

### **Modo Colaborativo** (Futuro)
- Compartir configuraciones entre usuarios
- Templates organizacionales
- Configuraciones por rol/departamento

---

## 🐛 Debugging y Desarrollo

### **Logs del Sistema**
```javascript
console.log('✅ Dashboard montado con layout:', currentLayout.value)
console.log('🔧 Modo configuración:', configMode.value)
console.log('💾 Guardando configuración:', config)
```

### **DevTools Integration**
- Vue DevTools compatible
- Pinia store observable
- Grid layout debuggable

---

## 📈 Rendimiento y Optimización

### **Lazy Loading**
- Cards se cargan bajo demanda
- Componentes de configuración son modales
- Datos se cargan por chunks

### **Memoización**
- Computed properties cacheados
- Watchers optimizados
- Re-renders mínimos

### **Bundle Splitting**
- Dashboard como chunk separado
- Cards como componentes async
- Configuración como feature module

---

## 🎯 Casos de Uso Típicos

### **Usuario Abogado Senior**
```javascript
layout: [
  { i: 'stats-dashboard', x: 0, y: 0, w: 6, h: 4 },    // Métricas principales
  { i: 'recent-searches', x: 6, y: 0, w: 6, h: 4 },    // Búsquedas frecuentes  
  { i: 'notifications', x: 0, y: 4, w: 8, h: 3 },      // Notificaciones amplias
  { i: 'quick-actions', x: 8, y: 4, w: 4, h: 3 }       // Acciones frecuentes
]
```

### **Usuario Asistente Legal**
```javascript
layout: [
  { i: 'quick-actions', x: 0, y: 0, w: 4, h: 6 },      // Acciones prioritarias
  { i: 'chat', x: 4, y: 0, w: 8, h: 6 },               // Comunicación constante
  { i: 'notifications', x: 0, y: 6, w: 12, h: 4 }      // Todas las notificaciones
]
```

### **Usuario Administrador**
```javascript
layout: [
  { i: 'stats-dashboard', x: 0, y: 0, w: 12, h: 5 },   // Vista completa de stats
  { i: 'recent-searches', x: 0, y: 5, w: 6, h: 4 },    // Monitoreo de actividad
  { i: 'notifications', x: 6, y: 5, w: 6, h: 4 }       // Alertas del sistema
]
```

---

## 🚀 Roadmap y Futuras Mejoras

### **v2.0 - Widgets Avanzados**
- Gráficos interactivos con Chart.js
- Integración con calendarios externos
- Mini-reportes embebidos

### **v2.1 - Colaboración**
- Compartir dashboards entre usuarios
- Templates por departamento
- Configuraciones organizacionales

### **v2.2 - IA y Automatización**
- Sugerencias automáticas de layout
- Auto-configuración basada en uso
- Predicción de métricas

---

## 📚 Conclusión

El sistema de Dashboard representa una solución **robusta**, **escalable** y **centrada en el usuario** que transforma la experiencia de trabajo diaria. Su arquitectura modular permite:

✅ **Personalización Total**: Cada usuario adapta su interfaz a sus necesidades  
✅ **Escalabilidad**: Fácil adición de nuevas cards y funcionalidades  
✅ **Mantenibilidad**: Código limpio y bien estructurado  
✅ **UX Excepcional**: Interfaz intuitiva con feedback visual constante  
✅ **Responsive Design**: Funciona perfectamente en todos los dispositivos  
✅ **Rendimiento Óptimo**: Lazy loading y optimizaciones avanzadas  

Este dashboard no es solo una interfaz, es una **plataforma de productividad** que se adapta y evoluciona con las necesidades del usuario, proporcionando un entorno de trabajo verdaderamente personalizado y eficiente.

---

*Documentación generada para el Sistema de Gestión Procesal | Versión 1.0.0*