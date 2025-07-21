# 📚 IGGSAD Frontend - Esquema Arquitectural Completo

## 🎯 Resumen Ejecutivo

**IGGSAD Gestión Procesal** es una aplicación frontend Vue 3 para gestión de casos legales que se conecta a un backend .NET. El sistema cuenta con dashboard personalizable, gestión avanzada de expedientes, sistema de filtros sofisticado y arquitectura modular escalable.

---

## 📁 Estructura Real del Proyecto

```
front/
├── .env*                           # Variables de entorno (VITE_SSO_URL, VITE_COREAPI_URL, VITE_DEV_PORT)
├── Caddyfile                       # Proxy HTTPS local → SSO/API
├── package.json                    # Dependencias actualizadas (ver stack técnico)
├── vite.config.js                  # Config Vite + proxy + alias
├── tailwind.config.js              # Configuración Tailwind personalizada
├── public/
│   ├── index.html
│   ├── images/logoBalanza.png
│   └── mock/expedientes.json       # Datos mock para desarrollo
├── doc/                            # Documentación completa del sistema
│   ├── Schema_front.md
│   ├── Sistema Dashboard.md
│   ├── Sistema Datatable Generico.md
│   ├── Sistema de Estilos Mejorados.md
│   └── userProfile.md
└── src/                            # Código fuente
    ├── main.js                     # Punto de entrada de la aplicación
    ├── App.vue                     # Layout principal con navegación
    ├── assets/tailwind.css         # Importaciones Tailwind
    ├── components/                 # Componentes reutilizables
    │   ├── dashboard/              # Sistema dashboard completo
    │   │   ├── DashboardGrid.vue          # Grid drag & drop
    │   │   ├── GridCard.vue               # Wrapper universal
    │   │   └── cards/
    │   │       ├── StatCard.vue
    │   │       ├── StatsDashboard.vue
    │   │       ├── RecentSearchesCard.vue
    │   │       ├── NotificationsCard.vue
    │   │       ├── ChatCard.vue
    │   │       ├── QuickActionsCard.vue
    │   │       └── CustomCard.vue
    │   ├── datatable/              # Sistema tabla genérico
    │   │   ├── DataTableGeneric.vue       # Componente principal
    │   │   ├── ColumnRenderer.vue         # Renderizado de columnas
    │   │   └── TableActions.vue           # Acciones de fila
    │   ├── expedientes/            # Gestión de casos legales
    │   │   ├── ExpedientesTable.vue       # Tabla especializada
    │   │   ├── ExpedientesDetailDialog.vue
    │   │   └── ExpedientesDrawer.vue
    │   ├── filters/                # Sistema filtros avanzado
    │   │   ├── FilterPanel.vue            # Panel principal
    │   │   ├── FiltersDrawer.vue          # Drawer lateral
    │   │   ├── FloatingActiveFilters.vue  # Filtros activos
    │   │   ├── FilterDate.vue
    │   │   ├── FilterDateRange.vue
    │   │   ├── FilterField.vue
    │   │   ├── FilterMultiSelect.vue
    │   │   ├── FilterNumber.vue
    │   │   ├── FilterSelect.vue
    │   │   ├── FilterText.vue
    │   │   └── sections/                  # Secciones especializadas
    │   │       ├── FilterSectionFechas.vue
    │   │       ├── FilterSectionIntervinientes.vue
    │   │       ├── FilterSectionProcedimiento.vue
    │   │       ├── FilterSectionProcedimientoBasico.vue
    │   │       └── FilterSectionAdicionales.vue
    │   ├── AuthLayout.vue
    │   ├── BreadcrumbWrapper.vue
    │   ├── DarkModeToggle.vue
    │   ├── Dock.vue                       # Dock personalizable
    │   ├── LoginForm.vue
    │   ├── ResetPasswordForm.vue
    │   └── SearchBar.vue
    ├── composables/                # Lógica reutilizable (17 composables)
    │   ├── datatable/
    │   │   ├── useTableActions.js
    │   │   ├── useTablePagination.js
    │   │   └── useTableSorting.js
    │   ├── useAppLayout.js
    │   ├── useFilterPanel.js
    │   ├── useFiltersDrawer.js
    │   ├── usePersistentView.js           # Persistencia URL
    │   ├── useToast.js
    │   ├── useUrlPersistence.js
    │   ├── useUserDashboard.js            # Dashboard management (500+ líneas)
    │   └── useUserProfile.js              # Gestión perfil usuario
    ├── constants/
    │   ├── datatableConfig/
    │   │   ├── commonTableConfig.js
    │   │   └── expedientesTableConfig.js
    │   └── filterOptions.js
    ├── router/index.js             # Rutas y guards de autenticación
    ├── services/                   # Servicios API
    │   ├── httpInterceptor.js             # Interceptor HTTP universal
    │   ├── auth.services.js               # Servicios de autenticación
    │   ├── expedientes.services.js        # API expedientes
    │   └── jwtServices.js                 # Utilidades JWT
    ├── stores/                     # Estado global Pinia
    │   ├── auth.js                        # Autenticación y permisos
    │   └── expedientes.js                 # Estado expedientes
    ├── styles/                     # Estilos globales y componentes
    │   ├── components/
    │   ├── app-layout.css
    │   ├── dashboard.css
    │   ├── datatable.css
    │   ├── expedientes.css
    │   ├── expedientes-dialog.css
    │   ├── expedientes-table.css
    │   ├── index.css
    │   ├── toast.config.js
    │   ├── toast.styles.js
    │   └── toast.variants.js
    ├── themes/                     # Tematización personalizada
    │   ├── custom-tokens.css              # 360+ líneas de tokens CSS
    │   └── primevue-theme.js              # Tema PrimeVue personalizado
    ├── types/vue-grid-layout.d.ts  # Tipos TypeScript
    ├── utils/
    │   ├── defaultUserProfile.js          # 260+ líneas configuración
    │   └── mockExpedientesGenerator.js
    ├── views/                      # Vistas principales
    │   ├── Dashboard.vue                  # Dashboard principal
    │   ├── Expedientes.vue               # Vista expedientes (430+ líneas)
    │   ├── Login.vue
    │   └── ResetPassword.vue
    └── style.css                   # Estilos globales

---

## 🛠️ Stack Tecnológico Completo

### **Dependencias Principales (package.json)**
- **Vue 3.5.13** - Framework reactivo con Composition API
- **Vite 6.3.5** - Build tool y dev server
- **PrimeVue 4.3.6** - Biblioteca UI principal
- **@primeuix/themes 1.1.1** - Sistema de temas avanzado  
- **@primevue/forms 4.3.5** - Sistema de formularios con validación
- **Pinia 3.0.3** - Gestión de estado reactivo
- **Vue Router 4.5.1** - Enrutado SPA
- **Tailwind CSS 3.4.17** - Framework CSS utilitario
- **grid-layout-plus 1.1.0** - Sistema grid drag & drop para dashboard
- **Zod 3.25.64** - Validación de esquemas
- **js-cookie 3.0.5** - Gestión de cookies
- **PrimeIcons 7.0.0** - Iconografía

### **DevDependencies**
- **@vitejs/plugin-vue 5.2.3** - Plugin Vue para Vite
- **vite-plugin-vue-devtools 7.7.6** - Herramientas desarrollo Vue
- **@types/js-cookie 3.0.6** - Tipos TypeScript
- **autoprefixer 10.4.21** - PostCSS autoprefixer
- **postcss 8.5.4** - Procesador CSS

---

## 🔧 Comandos y Flujo de Desarrollo

### **Scripts Disponibles**
```bash
pnpm install              # Instalar dependencias (preferido)
npm run dev               # Servidor desarrollo Vite
npm run build             # Build producción
npm run preview           # Preview build
npm run start:caddy       # Proxy HTTPS local
npm run tw:init           # Inicializar Tailwind
```

### **Flujo de Desarrollo Típico**
1. **Instalación**: `pnpm install`
2. **Desarrollo**: `npm run dev` (puerto VITE_DEV_PORT o 5173)
3. **HTTPS Local**: `npm run start:caddy` (opcional para testing SSO)
4. **Build**: `npm run build` para producción

### **Bootstrap de la Aplicación** (`main.js`)
1. **Configuración Vue**: createApp + plugins
2. **PrimeVue**: Configuración con tema personalizado GestionProcesalTheme
3. **Pinia**: Inicialización stores
4. **HTTP Interceptor**: Configuración automática
5. **Verificación Auth**: `authStore.checkAuth()` automático
6. **Carga Perfil**: `useUserProfile().loadProfile()` si autenticado
7. **Montaje**: App montada tras router.isReady()

---

## 🔐 Sistema de Autenticación Avanzado

### **Interceptor HTTP Universal** (`httpInterceptor.js`)
- **Sobrescribe `window.fetch`** para TODAS las peticiones
- **Cookies automáticas**: `credentials: 'include'` 
- **Headers JSON**: `Content-Type: application/json` automático
- **Gestión 401**: Refresh token automático o logout
- **Gestión 403**: Redirección a página de error
- **Prevención bucles**: Control de intentos de refresh

### **Servicios de Autenticación** (`auth.services.js`)
- `login(credentials)` - Autenticación con cookies
- `logout()` - Cierre sesión completo
- `fetchMe()` - Obtener datos usuario y permisos
- `refreshToken()` - Renovación token automática
- `requestPasswordReset()` - Solicitar reset password
- `verifyResetToken()` - Verificar token reset
- `resetPassword()` - Cambiar password con token
- `changePassword()` - Cambio password autenticado

### **Store de Autenticación** (`stores/auth.js`)
**Estado:**
```javascript
{
  user: null,                    // Datos usuario logueado
  frontPermissions: [],          // Permisos para frontend
  isLoading: false,              // Estado carga
  userProfile: {                 // Configuración personalizada completa
    dashboard: { layout, cardsConfig },
    dock: { items, position, preferences },
    filters: { favoritos, configuracion },
    preferences: { tema, idioma, notificaciones }
  }
}
```

**Acciones:**
- `doLogin()` - Login completo con redirección
- `logout()` - Logout con limpieza estado  
- `checkAuth()` - Verificación automática sesión
- `updateUserProfile()` - Persistencia configuración usuario

### **Guards de Rutas** (`router/index.js`)
- **requiresAuth**: Requiere autenticación
- **requiredPermission**: Requiere permiso específico
- **public**: Rutas públicas (login, reset)
- **Redirección automática**: Login ↔ Dashboard según estado auth

---

## 🏗️ Arquitectura de Componentes

### **Sistema Dashboard** (Documentado en Sistema Dashboard.md)
- **DashboardGrid.vue**: Grid drag & drop con grid-layout-plus
- **GridCard.vue**: Wrapper universal para todas las cards
- **8 tipos de cards**: Stats, Recent Searches, Notifications, Chat, etc.
- **Configuración visual**: Panel modal con selector de componentes
- **Persistencia completa**: Layout guardado en userProfile

### **Sistema DataTable Genérico** (Documentado en Sistema Datatable.md)
- **DataTableGeneric.vue**: Componente base reutilizable
- **ColumnRenderer.vue**: Renderizado especializado por tipo
- **TableActions.vue**: Acciones de fila configurables
- **Composables especializados**: Paginación, ordenación, acciones
- **Configuración externa**: Archivos de configuración por tabla

### **Sistema Filtros Avanzado**
- **FilterPanel.vue**: Panel principal de filtros
- **FiltersDrawer.vue**: Drawer lateral para filtros
- **FloatingActiveFilters.vue**: Filtros activos flotantes
- **5+ componentes de filtro**: Date, DateRange, MultiSelect, etc.
- **5 secciones especializadas**: Fechas, Procedimiento, etc.
- **Persistencia URL**: Estado filtros en parámetros URL

### **Sistema Expedientes**
- **Expedientes.vue**: Vista principal (430+ líneas)
- **ExpedientesTable.vue**: Tabla especializada
- **ExpedientesDetailDialog.vue**: Modal detalles
- **ExpedientesDrawer.vue**: Drawer información
- **Integración completa**: Filtros + Búsqueda + Estadísticas

---

## 🎨 Sistema de Estilos y Temas

### **Tema PrimeVue Personalizado** (`themes/primevue-theme.js`)
- **GestionProcesalTheme**: Tema completo personalizado
- **Paleta profesional**: Azules corporativos + grises slate
- **Componentes estilizados**: Cards, Buttons, Toast, DataTable
- **Modo oscuro**: Soporte completo con `.p-dark`

### **Tokens CSS Personalizados** (`themes/custom-tokens.css`)
- **360+ líneas de tokens**: Spacing, typography, sizing
- **Sistema de colores**: Primarios, secundarios, estados
- **Variables específicas**: Componentes y layouts
- **Responsive**: Breakpoints y adaptación

### **Sistema Toast Especializado**
- **8 variantes especializadas**: Critical, Legal, Financial, etc.
- **Configuración avanzada**: toast.config.js
- **Estilos profesionales**: toast.styles.js
- **Contexto legal**: Adaptado a gestión procesal

---

## 💾 Gestión de Estado y Persistencia

### **Stores Pinia**
- **auth.js**: Autenticación, permisos, userProfile
- **expedientes.js**: Estado expedientes, filtros, búsquedas

### **Persistencia Múltiple**
- **LocalStorage**: userProfile, preferencias
- **URL Parameters**: Filtros, estado vistas
- **Cookies**: Tokens autenticación (httpOnly)
- **Backend**: Configuración usuario sincronizada

### **Composables de Persistencia**
- **usePersistentView.js**: Sincronización vista ↔ URL
- **useUrlPersistence.js**: Gestión parámetros URL
- **useUserProfile.js**: Gestión perfil usuario completo

---

## 🚀 Funcionalidades Implementadas

### **Dashboard Personalizable**
✅ Grid drag & drop con 12 columnas  
✅ 8 tipos de cards disponibles  
✅ Configuración modal visual  
✅ Auto-guardado automático  
✅ Responsive completo  
✅ Persistencia usuario  

### **Gestión Expedientes**
✅ Búsqueda avanzada con validación  
✅ Filtros flotantes activos  
✅ Tabla con acciones múltiples  
✅ Diálogo detalles completo  
✅ Estadísticas tiempo real  
✅ Exportación configurable  

### **Sistema Filtros**
✅ 10+ componentes de filtro  
✅ 5 secciones especializadas  
✅ Persistencia en URL  
✅ Filtros favoritos  
✅ Limpieza inteligente  

### **Autenticación Robusta**
✅ JWT con refresh automático  
✅ Guards de rutas avanzados  
✅ Reset password completo  
✅ Gestión permisos granular  
✅ Interceptor HTTP universal  

---

## 🔧 Configuración de Entorno

### **Variables de Entorno**
```bash
VITE_SSO_URL=https://localhost:5116/api     # URL autenticación
VITE_COREAPI_URL=https://localhost:5117/api # URL API core
VITE_DEV_PORT=5173                          # Puerto desarrollo
```

### **Proxy de Desarrollo** (`vite.config.js`)
- **Alias**: `@` → `src/`
- **Proxy `/api`**: Redirige a VITE_SSO_URL
- **CORS**: Configurado para desarrollo
- **DevTools**: Vue DevTools integrado

### **HTTPS Local** (`Caddyfile`)
- **Proxy automático**: Frontend + Backend
- **Gestión cookies**: Automática entre dominios
- **Certificados**: Self-signed para desarrollo

---

## 📋 Puntos Arquitecturales Clave

### **🔥 Críticos**
1. **httpInterceptor.js** es la fuente única para TODAS las peticiones HTTP
2. **userProfile** en auth store contiene TODA la configuración personalizada
3. **Composables especializados** manejan lógica específica reutilizable
4. **Configuración externa** permite tablas y filtros completamente configurables
5. **Persistencia URL** mantiene estado entre recargas y navegación

### **⚡ Importantes**
- **PrimeVue + Tailwind**: Híbrido para máxima flexibilidad
- **grid-layout-plus**: Dependencia crítica para dashboard
- **Zod**: Validación esquemas (implementación parcial)
- **Mock data**: Generadores para desarrollo sin backend
- **Sistema toast**: Especializado para contexto procesal legal

### **🎯 Arquitectónicos**
- **Composables** > Mixins (Vue 3 Composition API)
- **Pinia** > Vuex (gestión estado moderna)
- **Configuración declarativa** > Código hardcodeado
- **Persistencia múltiple** > Single source of truth
- **Componentes genéricos** > Componentes específicos

## 🔄 Composables y Lógica Reutilizable

### **Composables de Dashboard**
- **useUserDashboard.js** (500+ líneas): Gestión completa dashboard personalizable
- **useUserProfile.js**: Carga y sincronización perfil usuario

### **Composables de DataTable**
- **useTablePagination.js**: Paginación adaptada a PrimeVue
- **useTableSorting.js**: Ordenación múltiple
- **useTableActions.js**: Gestión acciones de fila

### **Composables de Filtros**
- **useFilterPanel.js**: Lógica panel filtros avanzados
- **useFiltersDrawer.js**: Gestión drawer filtros con persistencia URL

### **Composables de Persistencia**
- **usePersistentView.js**: Sincronización vista ↔ URL
- **useUrlPersistence.js**: Gestión parámetros URL
- **useAppLayout.js**: Gestión layout aplicación

---

## 🗺️ Rutas y Navegación

### **Rutas Implementadas** (`router/index.js`)
```javascript
{
  { path: '/login',           component: Login.vue,        meta: { public: true } },
  { path: '/reset-password',  component: ResetPassword.vue, meta: { public: true } },
  { path: '/',               component: Dashboard.vue,     meta: { requiresAuth: true } },
  { path: '/expedientes',    component: Expedientes.vue,   meta: { requiresAuth: true } }
}
```

### **Meta Propiedades**
- **public**: Rutas accesibles sin autenticación
- **requiresAuth**: Requiere usuario autenticado
- **requiredPermission**: Permiso específico necesario

---

## 📊 Mock Data y Testing

### **Generadores Mock** (`utils/mockExpedientesGenerator.js`)
- Datos realistas para expedientes
- Generación automática para testing
- Estructura coherente con API backend

### **Datos Mock Estáticos** (`public/mock/expedientes.json`)
- Dataset fijo para desarrollo
- Casos de prueba consistentes

---

## 🎨 Theming y Personalización Visual

### **Sistema de Tokens Completo** (`themes/custom-tokens.css`)
- 50+ variables spacing
- 20+ variables typography  
- 15+ variables sizing
- Sistema z-index completo
- Variables modo oscuro

### **Tema PrimeVue Especializado**
- **GestionProcesalTheme**: Optimizado para contexto legal
- **Componentes personalizados**: DataTable, Cards, Toast
- **Modo oscuro nativo**: Soporte completo `.p-dark`

---

## 🔧 Desarrollo y Herramientas

### **Configuración Vite Avanzada**
- **Proxy desarrollo**: Transparente a backend
- **Vue DevTools**: Integrado automáticamente  
- **Hot Module Replacement**: Optimizado
- **Alias inteligentes**: `@` para src/

### **PostCSS y Autoprefixer**
- **Compatibilidad navegadores**: Automática
- **Optimización CSS**: Build optimizado
- **TailwindCSS**: Integración completa

---

## 📈 Rendimiento y Optimización

### **Lazy Loading**
- Componentes cargados bajo demanda
- Rutas con carga diferida
- Imágenes optimizadas

### **Bundle Optimization**
- **Code splitting**: Por rutas
- **Tree shaking**: Eliminación código no usado
- **Minificación**: Build optimizado

---

## 🛡️ Seguridad

### **Sanitización y Validación**
- **Escape HTML**: En contenido dinámico
- **Validación Zod**: Esquemas de datos
- **CSRF Protection**: Via cookies httpOnly

### **Gestión Permisos**
- **Guards granulares**: Por ruta y componente
- **Permisos frontend**: Independientes del backend
- **Estados de autenticación**: Consistentes

---

## 📚 Documentación Relacionada

- **Sistema Dashboard.md**: Documentación detallada del dashboard
- **Sistema Datatable Generico.md**: Guía completa del sistema de tablas
- **Sistema de Estilos Mejorados.md**: Documentación de temas y estilos
- **userProfile.md**: Estructura y gestión del perfil de usuario

---

## 🎯 Conclusión

**IGGSAD Frontend** es una aplicación **robusta**, **escalable** y **altamente personalizable** que implementa las mejores prácticas de desarrollo Vue 3. Con más de **8,500+ líneas de código**, arquitectura modular y componentes reutilizables, proporciona una base sólida para un sistema de gestión procesal completo.

### **Características Destacadas:**
✅ **Dashboard 100% personalizable** con drag & drop  
✅ **Sistema filtros avanzado** con persistencia URL  
✅ **Gestión expedientes completa** con tabla especializada  
✅ **Autenticación robusta** con refresh automático  
✅ **Theming profesional** adaptado al contexto legal  
✅ **Arquitectura escalable** con composables reutilizables  
✅ **Documentación exhaustiva** para mantenimiento

---

*Documentación actualizada del esquema arquitectural completo | IGGSAD Gestión Procesal Frontend*