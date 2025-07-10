// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, public: true },
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore()
      if (auth.isAuthenticated) return next({ name: 'Dashboard' })
      next()
    }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, public: false }
  },
  {
    path: '/expedientes',
    name: 'Expedientes',
    component: () => import('@/views/Expedientes.vue'),
    meta: { 
      requiresAuth: true, 
      public: false,
     // requiredPermission: 'expedientes-view' 
    }
  },
  
  // RUTAS ADICIONALES DE EXPEDIENTES
  // {
  //   path: '/expedientes/nuevo',
  //   name: 'ExpedienteNuevo',
  //   component: () => import('@/views/expedientes/ExpedienteCreate.vue'),
  //   meta: { 
  //     requiresAuth: true, 
  //     public: false,
  //     requiredPermission: 'expedientes-create' 
  //   }
  // },
  // {
  //   path: '/expedientes/:id',
  //   name: 'ExpedienteDetail',
  //   component: () => import('@/views/expedientes/ExpedienteDetail.vue'),
  //   meta: { 
  //     requiresAuth: true, 
  //     public: false,
  //     requiredPermission: 'expedientes-view' 
  //   },
  //   props: true
  // },
  // {
  //   path: '/expedientes/:id/edit',
  //   name: 'ExpedienteEdit',
  //   component: () => import('@/views/expedientes/ExpedienteEdit.vue'),
  //   meta: { 
  //     requiresAuth: true, 
  //     public: false,
  //     requiredPermission: 'expedientes-edit' 
  //   },
  //   props: true
  // },
  
  // ✨ RUTA DE RECUPERACIÓN DE CONTRASEÑA (para reset con token del email)
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    meta: { requiresAuth: false, public: true },
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore()
      if (auth.isAuthenticated) return next({ name: 'Dashboard' })
      if (!to.query.token) return next({ name: 'Login' }) // Verificar que hay un token en la query
      next()
    }
  },

  
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   component: () => import('@/views/Admin.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     requiredPermission: 'admin-accessView'
  //   }
  // },
  // … resto de rutas, cada una con:
  // meta: { requiresAuth: true, requiredPermission: 'entity-actionView' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  console.log("IsAuthenticated -> ",auth.isAuthenticated);
  
  if (!to.meta.requiresAuth) return next()
  
  if (!auth.isAuthenticated) {
    const ok = await auth.checkAuth().catch(() => false)
    console.log("checkAuth ok -> ", ok);
    if (!ok) return next({ name: 'Login' })
  }

  const required = to.meta.requiredPermission || to.meta.requiredPermission === null
  console.log("required -> ", required);
  if (required && !auth.canAccess(required)) {
    console.log("auth.canAccess(required) -> ", auth.canAccess(required));
    return next({ name: 'Dashboard' }) // o tu 403
  }
  next()
})

export default router