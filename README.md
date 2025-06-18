Aquí va un **resumen global** de tu SPA en Vue 3, cubriendo carpetas, dependencias, flujo de autenticación y pantallas públicas vs. protegidas:

---

## 🚀 Tecnologías y dependencias

* **Vue 3 + Vite**
* **TailwindCSS** para estilos utilitarios
* **PrimeVue** (componentes UI)
* **Pinia** para estado global
* **TanStack Query** para fetching y cache de datos
* **pnpm** como gestor de paquetes
* **Caddy** sirviendo en `https://localhost:3443`, con proxy a `http://sso-service:5116`
* **Autenticación** por cookie `HttpOnly; Secure` emitida por SSO

---

## 📁 Estructura de carpetas

```
front/
├─ public/              # favicon, etc.
├─ src/
│   ├─ assets/          # tailwind.css, imágenes…
│   ├─ components/      # formularios, botones, layouts reutilizables
│   ├─ services/        # lógica de llamadas a API (authService, userService…)
│   ├─ stores/          # Pinia: auth, user, settings…
│   ├─ router/          # rutas, guards (login & change-password públicas; resto protegidas)
│   ├─ views/           # pantallas completas (Login.vue, ChangePassword.vue, Dashboard.vue…)
│   ├─ App.vue          # layout base con <router-view/> y barra de navegación
│   └─ main.ts          # arranque: pinia, router, PrimeVue, VueQuery, tailwind.css
├─ Caddyfile            # HTTPS local + reverse_proxy /api → sso-service:5116
├─ package.json
└─ vite.config.ts
```

---

## 🔐 Flujo de autenticación

1. **Pantallas públicas**

   * `/login` → LoginForm (PrimeVue)
   * `/change-password` → ChangePasswordForm

2. **Al hacer login**

   * `authService.login()` → POST `/api/auth/login` (cookie HttpOnly+Secure)
   * Pinia guarda estado y, usando VueQuery, `authStore.loadMe()` → GET `/api/me`

3. **Protección de rutas**

   * `router.beforeEach`
   * Si `meta.requiresAuth` y `!auth.isAuthenticated` → redirige `/login`
   * Todas las demás vistas (`Dashboard`, `Usuarios`, etc.) están detrás de login

---

## 🔄 Ciclo de datos y cache

* **TanStack Query** gestiona fetching, reintentos y cache global.
* Se usará para `/me`, `/permissions`, `/front-actions` y todas las llamadas CRUD a tus microservicios.
* `{ credentials: 'include' }` en cada petición para enviar la cookie.

---

## 🎨 Layout y navegación

* **App.vue** montará el `<Navbar/>` y un `<router-view/>`.
* La **Navbar** (o Sidebar) leerá `authStore.frontActions` para mostrar/ocultar enlaces según permisos.
* Las páginas interiores usarán componentes de PrimeVue (Cards, Tables, Forms) y clases de Tailwind para el estilo.

---

## 📈 Siguientes pasos

1. **Crear `ChangePasswordForm.vue`** en `components/` y `views/ChangePassword.vue`, con su propia mutación de VueQuery.
2. **Definir rutas** en `router/index.ts` para `/change-password` como pública.
3. **Implementar layout protegido** (por ejemplo, un wrapper que llame `authStore.loadMe()` al montar).
4. **Construir el Dashboard** y submódulos (Usuarios, Policies, Logs…) utilizando services, stores y VueQuery de forma consistente.

Con esto tienes la **visión de conjunto**: un SPA completamente protegida tras login, organizada en servicios, stores, componentes y vistas, usando TanStack Query para datos y Caddy como proxy HTTPS local. ¿Listo para arrancar con el cambio de contraseña?

