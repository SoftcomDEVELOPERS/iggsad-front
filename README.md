# iggsad-front

Frontend del proyecto IGGSAD: Sistema Distribuido con .NET 9 (Microservicios y Vue 3)

## 📁 Estructura general

```plaintext
.
├─ logoBalanza.png
├─ .env*                  # Variables de entorno (VITE_SSO_URL, VITE_COREAPI_URL, VITE_DEV_PORT)
├─ .env.development       # Entorno de desarrollo
├─ .env.production        # Entorno de producción
├─ .gitignore             # Reglas de Git
├─ Caddyfile              # Proxy HTTPS local → SSO/API
├─ index.html             # HTML principal
├─ package.json           # Dependencias y scripts (Vite, Tailwind, PrimeVue…)
├─ pnpm-lock.yaml         # Lockfile de pnpm
├─ postcss.config.js      # Config de PostCSS
├─ tailwind.config.js     # Configuración de TailwindCSS
├─ vite.config.js         # Alias, plugins y proxy de desarrollo
├─ README.md              # Documentación del frontend
└─ src/                   # Código fuente
   ├─ assets/             # Recursos estáticos y CSS
   │   └─ tailwind.css    # Import de utilidades Tailwind
   ├─ components/         # Componentes reutilizables
   │   ├─ dashboard/      # Dashboard y grid
   │   │   ├─ cards/      # Cards del dashboard
   │   │   │   ├─ ChatCard.vue
   │   │   │   ├─ CustomCard.vue
   │   │   │   ├─ NotificationsCard.vue
   │   │   │   ├─ QuickActionsCard.vue
   │   │   │   ├─ RecentSearchesCard.vue
   │   │   │   ├─ StatCard.vue
   │   │   │   ├─ StatsDashboard.vue
   │   │   │   ├─ GridCard.vue
   │   │   └─ DashboardGrid.vue
   │   ├─ filters/        # Panel de filtros y secciones
   │   │   ├─ sections/
   │   │   │   ├─ FilterDate.vue
   │   │   │   ├─ FilterDateRange.vue
   │   │   │   ├─ FilterField.vue
   │   │   │   ├─ FilterMultiSelect.vue
   │   │   │   ├─ FilterNumber.vue
   │   │   ├─ FilterPanel.vue
   │   │   ├─ FilterPanel.styles.css
   │   │   ├─ FilterSelect.vue
   │   │   ├─ FilterText.vue
   │   │   ├─ FloatingActiveFilters.vue
   │   │   └─ index.js
   │   ├─ AuthLayout.vue
   │   ├─ DarkModeToggle.vue
   │   ├─ Dock.vue
   │   ├─ LoginForm.vue
   │   ├─ ResetPasswordForm.vue
   │   └─ SearchBar.vue
   ├─ composables/        # Composables reuse
   │   ├─ useAppLayout.js
   │   ├─ useFilterPanel.js
   │   ├─ useToast.js
   │   └─ useUserDashboard.js
   ├─ constants/          # Constantes y opciones
   │   └─ filterOptions.js
   ├─ router/             # Definición de rutas y guards
   │   └─ index.js
   ├─ services/           # Lógica HTTP y auth
   │   ├─ httpInterceptor.js
   │   ├─ auth.services.js
   │   ├─ jwtServices.js
   │   └─ expedientes.services.js
   ├─ stores/             # Pinia stores
   │   ├─ auth.js         # Gestión de sesión y recuperación
   │   └─ expedientes.js  # Estado de expedientes
   ├─ styles/             # CSS global y componentes
   │   ├─ components/
   │   │   ├─ app-layout.css
   │   │   ├─ dashboard.css
   │   │   ├─ index.css
   │   │   ├─ toast.config.js
   │   │   ├─ toast.styles.js
   │   │   └─ toast.variants.js
   ├─ themes/             # Temas y tokens
   │   ├─ custom-tokens.css
   │   └─ primevue-theme.js
   ├─ types/              # Definiciones TypeScript
   │   └─ vue-grid-layout.d.ts
   ├─ utils/              # Utilidades y mocks
   │   └─ defaultUserProfile.js
   ├─ views/              # Vistas principales
   │   ├─ App.vue
   │   ├─ Dashboard.vue
   │   ├─ Login.vue
   │   ├─ ResetPassword.vue
   ├─ main.js             # Punto de entrada: Vue, Pinia, PrimeVue, routing
   └─ style.css           # Estilos globales (dark/light)
```

```plaintext
front/
├─ .env\*                  # Variables de entorno (VITE\_SSO\_URL, VITE\_COREAPI\_URL, VITE\_DEV\_PORT)
├─ Caddyfile              # Proxy HTTPS local → SSO/API
├─ package.json           # Dependencias y scripts (Vite, Tailwind, PrimeVue, Pinia, etc.)
├─ vite.config.js         # Alias, plugins y proxy de desarrollo
├─ tailwind.config.js     # Configuración de TailwindCSS
├─ public/                # index.html, favicon y recursos estáticos
├─ src/                   # Código fuente
│  ├─ main.js             # Bootstrapping: Vue, Pinia, PrimeVue, interceptor HTTP, checkAuth
│  ├─ App.vue             # Layout principal con header, Menubar y router-view
│  ├─ router/index.js     # Definición de rutas y guards (login, dashboard, reset-password, permisos)
│  ├─ services/           # httpInterceptor.js, auth.services.js, jwtServices.js
│  ├─ stores/             # auth.js (Pinia store con login, logout, checkAuth y recuperación de contraseña)
│  ├─ composables/        # useFilterPanel.js, useUserDashboard.js, useToast.js, etc.
│  ├─ constants/          # filterOptions.js: opciones para filtros UI
│  ├─ components/         # Reutilizables (SearchBar, Dock, DashboardGrid, filtros…)
│  ├─ views/              # Login.vue, ResetPassword.vue, Dashboard.vue, etc.
│  └─ styles/             # Tailwind imports y estilos globales (app-layout, toast, theme)
└─ .git/                  # Control de versiones y hooks internos

```

## 🔧 Dependencias y scripts
- **Framework**: Vue 3 + Composition API
- **Build**: Vite
- **UI**: PrimeVue 4, PrimeIcons, @primeuix/themes
- **Estado**: Pinia 3
- **Consultas**: @tanstack/vue-query 5
- **CSS**: Tailwind CSS 3
- **Extras**: Zod, js-cookie, grid-layout-plus

**Scripts** (package.json):
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "start:caddy": "caddy run --config Caddyfile"
}
````

## ⚙️ Configuración y entornos

* **.env.development** / **.env.production**: URLs de SSO/API, puertos
* **Caddyfile**: HTTPS local + proxy de cookies
* **vite.config.js**: Alias (`@`→`src`), proxy `/api`→SSO, plugins y certificados self-signed
* **tailwind.config.js**: Breakpoints personalizados y configuración extendida

## 🚀 Flujo de ejecución

1. `pnpm install`
2. `npm run dev` (Vite + Caddy local)
3. **main.js** monta la aplicación, interceptores y verifica autenticación
4. `authStore.checkAuth()` redirige al login o al dashboard según el estado

## 🔐 Autenticación y autorización

* **httpInterceptor.js**:

  * Sobreescribe `window.fetch` para incluir cookies y JSON headers
  * Maneja respuestas 401 (refresh token / logout automático) y 403
* **services/auth.services.js**:

  * `login()`, `logout()`, `fetchMe()`, `refreshToken()`
  * **Recuperación de contraseña**: `requestPasswordReset()`, `verifyResetToken()`, `resetPassword()`, `changePassword()`
* **stores/auth.js**:

  * `doLogin()`, `checkAuth()`, `logout()`, `tryRefreshToken()`
  * Acciones de recuperación: `requestPasswordReset()`, `verifyResetToken()`, `resetPassword()`, `changePassword()`

## 🌐 Rutas principales

```javascript
// src/router/index.js
themes: [
  { path: '/login',            name: 'Login',        component: Login.vue,        meta: { public: true } },
  { path: '/',                  name: 'Dashboard',    component: Dashboard.vue,    meta: { requiresAuth: true } },
  { path: '/reset-password',    name: 'ResetPassword',component: ResetPassword.vue,meta: { public: true }, beforeEnter: /* valida token */ },
  // ... rutas protegidas con meta.requiredPermission
]
```

## 🔍 Filtros y búsquedas

* **useFilterPanel.js**: lógica para panel de filtros avanzados
* **filterOptions.js**: listado de opciones reutilizables
* **SearchBar.vue** + **FilterPanel.vue**: componentes de UI con validación y eventos

## 🎨 UI y estilos

* **PrimeVue** configurado en main.js con `GestionProcesalTheme`
* **Tailwind** para estilos globales y utilidades (dark mode, focus rings)
* **Toast**: servicio de notificaciones con variantes personalizadas

## 🗝️ Puntos clave

* **httpInterceptor.js** es la fuente de verdad para todas las peticiones API
* **auth.services & stores/auth** gestionan completo ciclo de sesión y recuperación de contraseña
* **Integración de recuperación** incluye rutas, vista (ResetPassword.vue), servicio y store
* **UI modular**: DashboardGrid, Dock, SearchBar, FilterPanel…

---
