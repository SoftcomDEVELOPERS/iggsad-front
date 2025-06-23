# 📚 Documentación del Sistema de Gestión Procesal

## 🏗️ Arquitectura General

### Stack Tecnológico
- **Framework**: Vue 3 con Composition API
- **Router**: Vue Router 4
- **Estado**: Pinia
- **Build Tool**: Vite
- **UI Library**: PrimeVue 4
- **Estilos**: Tailwind CSS + PrimeVue Theme personalizado
- **Iconos**: PrimeIcons

### Estructura del Proyecto
```
src/
├── components/
│   ├── LandingPage.vue (Dashboard principal)
│   └── Dock.vue (Componente dock personalizado)
├── stores/ (Pinia stores)
├── App.vue (Layout principal con navegación)
├── main.js (Configuración de la aplicación)
└── primevue-theme.js (Tema personalizado)
```

## 🎨 Tema Personalizado (primevue-theme.js)

### Paleta de Colores
- **Primary**: Azules (#2563eb como principal)
- **Surface**: Escala de grises slate
- **Fondo**: Blanco y grises claros

### Componentes Personalizados

#### Menubar
- **Root**: Fondo transparente, sin bordes
- **Items**: 
  - Normal: Texto gris oscuro (`{surface.700}`)
  - Hover: Fondo azul sólido (`{primary.600}`) + texto blanco
  - Padding: `0.5rem 1rem`, border-radius: `6px`

#### Cards
- Border-radius: `12px`
- Sombra sutil
- Padding: `1.5rem`

#### Buttons
- Border-radius: `8px`
- Focus ring azul
- Sombra en variante raised

#### Toast
- Width: `25rem`
- Border-radius: `12px`
- Sin bordes, solo sombra

## 🏠 App.vue - Layout Principal

### Header
- **Logo**: `logoBalanza.png` (con fallback a icono)
- **Título**: "Gestión Procesal" + "Sistema Jurídico Integral"
- **Navegación**: Menubar con 4 secciones principales
- **Usuario**: Botones de perfil y logout

### Estructura del Menú
```javascript
menuItems = [
  {
    label: 'Casos',
    items: ['Todos los Casos', 'Nuevo Caso', 'Casos Urgentes', 'Archivo']
  },
  {
    label: 'Audiencias', 
    items: ['Calendario', 'Próximas Citas', 'Historial']
  },
  {
    label: 'Documentos',
    items: ['Biblioteca', 'Plantillas', 'Subir Documento']
  },
  {
    label: 'Clientes',
    items: ['Lista de Clientes', 'Nuevo Cliente', 'Deudores']
  }
]
```

### Estilos CSS
- Solo para botones del usuario en el header
- Toast con z-index alto
- Familia de fuentes: Inter

## 📊 LandingPage.vue - Dashboard Principal

### Layout (Grid 3 columnas)
- **Columnas principales (2/3)**: Búsqueda, resultados, estadísticas
- **Sidebar derecha (1/3)**: Notificaciones, chat, acciones rápidas

### Componentes Principales

#### Header Dashboard
- Título + fecha actual
- Último acceso

#### Barra de Búsqueda
- Input principal con icono
- Botón "Filtros" con badge de conteo
- Botón "Buscar"

#### Búsquedas Recientes
- Cards compactas con:
  - Número expediente (font-mono, azul)
  - Nombre cliente
  - Cantidad deuda (verde)
- Máximo 5 búsquedas
- Botón limpiar historial

#### Estadísticas (Grid 2x2)
- Casos Activos (icono folder, azul)
- Audiencias Próximas (icono calendar, verde)
- Casos Urgentes (icono warning, ámbar)
- Total Clientes (icono users, morado)

#### Panel Derecho
1. **Notificaciones**
   - Badge con conteo no leídas
   - Items con colores por tipo
   - Botón "marcar todas como leídas"

2. **Chat**
   - Badge verde con mensajes no leídos
   - Vista previa de mensajes
   - Enlace a chat completo

3. **Acciones Rápidas**
   - Nuevo Caso
   - Subir Documento
   - Nuevo Cliente

#### Drawer de Filtros
- **Componente**: Drawer (no Sidebar - deprecado)
- **Posición**: Izquierda
- **Filtros básicos**: Tipo proceso, Estado, Fechas, Juzgado, Prioridad
- **Filtros avanzados**: Cuantía, Abogado, Cliente (en Accordion)

### Estado Reactivo
```javascript
// Búsqueda
searchQuery, searchResults, showFilters

// Datos simulados
stats, recentSearches, notifications, recentMessages

// Filtros
filters: {
  processType: [], status: null, dateRange: null,
  court: null, priority: [], amountFrom: null,
  amountTo: null, lawyer: null, clientName: ''
}
```

## 🚢 Dock.vue - Componente Dock Personalizado

### Características
- **Posicionamiento**: Fijo en cualquier borde de pantalla
- **Orientación**: Automática (horizontal/vertical según borde)
- **Ocultable**: Con animaciones suaves
- **Selector de posición**: Grid 3x3 visual

### Props
```javascript
{
  items: Array (required),
  hideTooltip: String,
  showTooltip: String, 
  autoHide: Boolean,
  autoHideDelay: Number,
  initialEdge: String ['top', 'right', 'bottom', 'left']
}
```

### Items Structure
```javascript
{
  id: String,
  label: String,
  icon: String (PrimeIcon),
  active: Boolean,
  badge: String,
  command: Function
}
```

### Estados Reactivos
- `isHidden`: Visibilidad del dock
- `showHideButton`: Mostrar botones de control
- `showPositionSelector`: Mostrar selector de posición
- `edge`: Borde actual ('top', 'right', 'bottom', 'left')

### Botones de Control
- **Azul**: Ocultar/mostrar (icono según borde)
- **Verde**: Selector de posición (icono arrows-alt)
- **Tamaño**: 28x28px, border-radius 8px
- **Posición**: Centrados respecto al contenedor

### Selector de Posición
- Grid 3x3 con iconos direccionales
- Posicionamiento inteligente (siempre visible)
- Estado activo resaltado
- Tooltips nativos (title)

### Estilos
- **Contenedor**: Fondo oscuro semi-transparente, blur
- **Items**: 48x48px, fondo blanco, border-radius 12px
- **Badges**: 14x14px, rojo, esquina superior derecha
- **Animaciones**: Shimmer effect, scale en hover

### Posicionamiento
- **CSS positioning**: Basado en edge actual
- **Transform**: Para centrado perfecto
- **Márgenes**: 20px desde bordes de pantalla

## 📋 Configuración main.js

### PrimeVue Setup
```javascript
app.use(PrimeVue, {
  theme: {
    preset: GestionProcesalTheme, // Tema personalizado
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  }
})

// Tooltip directive
app.directive('tooltip', TooltipDirective)
```

### Router
- Hash o History mode
- Rutas básicas para cada sección

### Pinia
- Store de autenticación (opcional)
- Stores para estado global

## 🎯 Características Clave

### Responsive Design
- Grid adaptativo en dashboard
- Dock responsive (tamaños móvil)
- Drawer full-width en móviles

### Accesibilidad
- Tooltips en todos los elementos interactivos
- Focus rings en tema
- Contraste apropiado
- Navegación por teclado

### Animaciones
- Transiciones suaves (0.2s ease)
- Cubic-bezier para movimientos naturales
- Hover effects con scale y sombras
- Fade in/out para elementos condicionales

### Estados Visuales
- Badges con contadores
- Indicadores de prioridad (colores borde)
- Estados activos en navegación
- Loading states preparados

## 🔧 Funcionalidades Implementadas

### Dashboard
✅ Búsqueda con filtros avanzados
✅ Historial de búsquedas (5 últimas)
✅ Estadísticas en tiempo real
✅ Notificaciones con estados
✅ Chat con vista previa
✅ Acciones rápidas

### Dock
✅ Posicionamiento en 4 bordes
✅ Selector visual de posición
✅ Ocultación con animaciones
✅ Badges dinámicos
✅ Estados activos
✅ Tooltips informativos

### Navegación
✅ Menú principal con submenús
✅ Hover states apropiados
✅ Router integration
✅ Logout functionality

## 📝 Notas de Desarrollo

### Dependencias Clave
- `@primeuix/themes`: Para tema personalizado
- `primevue`: Componentes UI
- `primeicons`: Iconografía
- `vue-router`: Navegación
- `pinia`: Estado global

### Archivos Importantes
- `primevue-theme.js`: Configuración visual completa
- `App.vue`: Layout y navegación principal  
- `LandingPage.vue`: Dashboard funcional
- `Dock.vue`: Componente dock reutilizable

### Convenciones
- Composition API en todos los componentes
- Props validation donde sea necesario
- Emits declarados explícitamente
- Estilos scoped cuando sea posible
- Colores usando tokens del tema

---

Esta documentación cubre la estructura completa del sistema. Actualízala según evolucione el proyecto.