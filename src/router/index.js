// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        return next({ name: 'Landing Page' })
      }
      next()
    }
  },
  {
    path: '/',
    name: 'Landing Page',
    component: () => import('@/views/LandingPage.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'landing-accessView' // ejemplo: 'expediente-readView'
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
  console.log("authStore -> ", auth.user);
  
  if (!to.meta.requiresAuth) {
    return next()
  }

  if (!auth.isAuthenticated) {
    const ok = await auth.checkAuth().catch(() => false)
    if (!ok) return next({ name: 'Login' })
  }

  const required = to.meta.requiredPermission || to.meta.requiredPermission === null
  if (required && !auth.canAccess(required)) {
    return next({ name: 'Landing Page' }) // o tu 403
  }

  next()
})

export default router
