import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  // {
  //   path: '/change-password',
  //   name: 'ChangePassword',
  //   component: () => import('@/views/ChangePassword.vue')
  // },
  {
    path: '/',
    name: 'Landing Page',
    component: () => import('@/views/LandingPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // público
  if (!to.meta.requiresAuth) {
    return next()
  }

  // privado: debe estar logueado
  if (!auth.isAuthenticated) {
    try { await auth.doLogin({ /* vacío: el endpoint puede auto-logearse si ya hay cookie? */ }) }
    catch { return next({ name: 'Login' }) }
  }

  // permisos de front
  if (!auth.canAccess(to.name)) {
    return next({ name: 'Landing Page' }) // o a una página 403
  }

  next()
})

export default router
