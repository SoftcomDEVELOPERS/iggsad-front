# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con código en este repositorio.

## Descripción del Proyecto

Esta es una aplicación frontend Vue 3 para "IGGSAD Gestión Procesal" - un sistema de gestión de casos legales que se conecta a un backend .NET a través de APIs RESTful. La aplicación maneja autenticación, gestión de casos legales (expedientes), y proporciona un dashboard sofisticado con widgets personalizables.

## Comandos

### Desarrollo
- `npm run dev` - Iniciar servidor de desarrollo Vite (puerto desde VITE_DEV_PORT o 5173)
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run start:caddy` - Iniciar proxy HTTPS con Caddy (para desarrollo SSL local)

### Gestión de Paquetes
- `pnpm install` - Instalar dependencias (el proyecto usa pnpm)

### Flujo de Desarrollo
1. `pnpm install`
2. `npm run dev` (inicia Vite y puede combinarse con Caddy para HTTPS)
3. La aplicación redirige automáticamente a `/login` si no está autenticado o `/` (Dashboard) si está autenticado

## Arquitectura

### Flujo de Autenticación
- **httpInterceptor.js** sobrescribe `window.fetch` para manejar todas las peticiones HTTP
- Incluye automáticamente cookies y headers JSON para llamadas API
- Maneja respuestas 401 con refresh automático de token o logout
- **auth.services.js** proporciona métodos core de auth: `login()`, `logout()`, `fetchMe()`, `refreshToken()`
- **stores/auth.js** (Pinia) gestiona estado de autenticación y permisos
- Los guards de router verifican `meta.requiresAuth` y `meta.requiredPermission`

### Arquitectura de Servicios Core
- **Interceptor HTTP**: Todas las llamadas API pasan por `src/services/httpInterceptor.js`
- **Autenticación**: Basada en JWT con soporte para refresh token
- **Gestión de Estado**: Stores de Pinia para auth y expedientes
- **Obtención de Datos**: @tanstack/vue-query para gestión de estado del servidor

### Arquitectura UI
- **PrimeVue 4** como biblioteca UI principal con tema personalizado (`GestionProcesalTheme`)
- **Tailwind CSS** para estilos utilitarios
- **Sistema DataTable Genérico**: Componente de tabla reutilizable con paginación, ordenamiento, filtrado
- **Sistema de Filtros**: Filtrado avanzado con múltiples tipos de filtros y persistencia URL
- **Dashboard**: Layout de grid personalizable con widgets arrastrables

### Directorios Clave
- `src/components/` - Componentes UI reutilizables
  - `datatable/` - Sistema de tablas genérico
  - `filters/` - Componentes de filtrado avanzado
  - `dashboard/` - Componentes de dashboard y widgets
  - `expedientes/` - Componentes de gestión de casos legales
- `src/services/` - Capa de comunicación API
- `src/stores/` - Gestión de estado Pinia
- `src/composables/` - Funciones de composición Vue 3
- `src/themes/` - Configuración de tema PrimeVue personalizado

### Configuración de Entorno
- **Variables de Entorno**:
  - `VITE_SSO_URL` - URL del servicio de autenticación backend
  - `VITE_COREAPI_URL` - URL del API core
  - `VITE_DEV_PORT` - Puerto del servidor de desarrollo
- **Configuración Proxy**: Vite redirige peticiones `/api` a `VITE_SSO_URL`
- **Desarrollo HTTPS**: Caddyfile proporciona proxy HTTPS local

### Patrones de Gestión de Datos
- **Persistencia URL**: Preferencias de usuario y estados de filtros persisten en parámetros URL
- **Local Storage**: Layouts de dashboard y preferencias de usuario almacenadas localmente
- **Estado del Servidor**: @tanstack/vue-query gestiona datos del servidor con caché
- **Validación de Formularios**: Esquemas Zod para validación de datos
- **Notificaciones Toast**: Sistema toast personalizado con variantes de estilo profesional

### Arquitectura de Componentes
- **DataTableGeneric.vue**: Tabla reutilizable con columnas configurables
- **FilterPanel.vue**: Filtrado avanzado con organización basada en secciones
- **DashboardGrid.vue**: Layout dashboard drag-and-drop con grid-layout-plus
- Todos los componentes siguen patrones PrimeVue con tematización personalizada

### Notas de Desarrollo
- El proyecto usa **Vue 3 Composition API** exclusivamente
- **Soporte TypeScript** disponible pero no enforced (no hay archivos .ts actualmente)
- **No hay framework de testing** configurado actualmente
- **No hay configuración de linting** detectada
- Los componentes usan patrones **PrimeVue** y deben mantener consistencia con el tema existente
- Todas las llamadas API deben pasar por el interceptor - nunca usar fetch directamente para peticiones autenticadas
- El estado de autenticación se gestiona globalmente - verificar `authStore.isAuthenticated` para estado auth

### Ubicaciones de Archivos Importantes
- Entrada principal de la app: `src/main.js`
- Configuración del router: `src/router/index.js`
- Store de auth: `src/stores/auth.js`
- Interceptor HTTP: `src/services/httpInterceptor.js`
- Configuración del tema: `src/themes/primevue-theme.js`
- Configuración tabla genérica: `src/constants/datatableConfig/commonTableConfig.js`