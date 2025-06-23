Aquí tienes un resumen fiel de todo lo que contiene **iggsad-front**, tras explorar cada archivo y carpeta:

---

## 📁 Estructura general

```
front/  
├─ .env*                  # Variables de entorno (VITE_SSO_URL, etc.)  
├─ Caddyfile              # Proxy local HTTPS → SSO/API  
├─ package.json           # Dependencias: Vue 3, Vite, Tailwind, PrimeVue, Pinia, @tanstack/vue-query, Zod…  
├─ vite.config.js         # Configuración de Vite + proxy a SSO en dev  
├─ tailwind.config.js     # TailwindCSS  
├─ public/                # index.html, favicon, estáticos  
├─ src/                   # Código fuente  
│  ├─ main.js             # Bootstrapping de la app: crea Vue, Pinia, PrimeVue, monta router, inicializa interceptor HTTP y checkAuth  
│  ├─ assets/             # Tailwind imports y otros recursos  
│  ├─ themes/             # primevue-theme.js: tema personalizado  
│  ├─ router/             # index.js: definición de rutas y guards (login → landing + checks de permisos)  
│  ├─ services/           #  
│  │   ├─ httpInterceptor.js   #  
│  │   │  – Sobrescribe window.fetch para:  
│  │   │     • Incluir `credentials: 'include'` en todas las peticiones a `/api` o VITE_SSO_URL  
│  │   │     • Gestionar refresh tokens (evitar bucles, 401 → redirige a login)  
│  │   │     • Centralizar headers JSON y errores HTTP  
│  │   ├─ auth.services.js     # login, logout, fetchMe(), refreshToken() usando fetch directo a `${VITE_SSO_URL}/auth/...`  
│  │   └─ jwtServices.js       # parseJwt(token) para extraer payload y expiración  
│  ├─ stores/             #  
│  │   └─ auth.js             # Pinia store “auth”:  
│  │       • state: `{ user, frontPermissions, isLoading }`  
│  │       • getters: `isAuthenticated`, `canAccess(permission)`  
│  │       • actions: `login()`, `logout()`, `checkAuth()` que llama a auth.services.fetchMe() y refreshToken()  
│  ├─ composables/        # useFilterPanel.js: lógica reusable para paneles de filtros  
│  ├─ constants/          # filterOptions.js: opciones de filtros en UI  
│  ├─ components/         #  
│  │   └─ filters/sections/FilterSection*.vue   # Secciones de filtro reutilizables  
│  ├─ views/              #  
│  │   ├─ Login.vue            # Formulario de login  
│  │   └─ LandingPage.vue      # Dashboard / página principal  
│  └─ style.css           # Estilos globales adicionales  
└─ .git/                  # Control de versiones (hooks, configuración…)  
```

---

## 🔧 Herramientas y flujo de ejecución

1. **Arranque**

   * `pnpm install`
   * `npm run dev` → Vite levanta server + Caddy proxy a SSO/API
2. **Autenticación**

   * `main.js` inicializa el interceptor (`httpInterceptor.js`) y ejecuta `authStore.checkAuth()`.
   * Si el usuario no está autenticado o expira el token, el interceptor/redirección de rutas lleva al login.
3. **Peticiones HTTP**

   * Toda llamada a API pasa por `httpInterceptor.js`, que:

     * Añade JSON headers + `credentials: 'include'`.
     * Intercepta 401 para refrescar el token o forzar login.
     * Proporciona `httpClient.get/post/put/delete()` (aunque `auth.services.js` usa `fetch` directo para login/refresh).
4. **Gestión de permisos**

   * Después de login, `authStore.fetchMe()` recupera `{ user, frontPermissions }`.
   * El guard de rutas (`router.beforeEach`) bloquea rutas según `meta.requiresAuth` y `meta.requiredPermission`.

---

## ⚙️ Configuración y entornos

* **.env** variables comunes
* **.env.development** (ej. `VITE_SSO_URL=https://localhost:5116/api`)
* **.env.production** (URLs reales)
* **Caddyfile**: HTTPS local + proxy automático de cookies a backend
* **vite.config.js**: integra alias (`@` → `src`), plugin de devtools y proxy de desarrollo a SSO/API

---

## 🗂 Puntos clave a retener

* **httpInterceptor.js** es la única fuente de verdad para todas las peticiones (`window.fetch` sobrescrito).
* **auth.services.js** concentra login/refresh/logout/fetchMe pero usa `fetch` “a pelo” apuntando a `VITE_SSO_URL`.
* **stores/auth.js** une servicios y router guards: controla estado de sesión, tokens, permisos y redirecciones.
* La **UI** usa PrimeVue + Tailwind + Zod para validación (aunque por ahora Zod solo está instalado, no ampliamente usado).
* Solo hay dos vistas activas (Login y Landing); el resto está comentado como ejemplo.

---

Con esto tienes un “mapa mental” completo del frontend. La parte de recuperación de contraseña que vamos a añadir debe integrarse en:

1. Nuevas **vistas** en `src/views/`
2. **Rutas** en `router/index.js`
3. Eventualmente **servicios** reutilizando `httpInterceptor.js` (no duplicar `fetch`)
4. Opcionalmente nuevas **acciones** en `stores/auth.js` si quieres manejar estado del token de recuperación allí.

Dime cómo quieres avanzar y en qué punto concreto profundizamos.
