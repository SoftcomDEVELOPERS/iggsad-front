// src/composables/useAppLayout.js
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * useAppLayout reúne:
 * - showLayout: oculta el header/global layout en rutas públicas (meta.public)
 * - isDarkMode, toggleDarkMode, initializeTheme: lógica de tema dark/light
 */
export function useAppLayout() {
  const route = useRoute()
  const authStore = useAuthStore()

  // ── Layout visibility ───────────────────────────
  const isPublicPage = computed(() => route.meta?.public === true)
  const showLayout   = computed(() => !isPublicPage.value)

  // ── Dark Mode ────────────────────────────────────
  const isDarkMode = computed({
    get: () => authStore.userProfile?.dashboard?.theme === 'dark',
    set: (value) => {
      const theme = value ? 'dark' : 'light'
      authStore.updateTheme(theme)
      applyTheme(theme)
    }
  })

  function applyTheme(theme) {
    const html = document.documentElement
    html.classList.toggle('dark', theme === 'dark')
    html.classList.toggle('light', theme === 'light')
  }

  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    console.log(`🌙 Dark Mode: ${isDarkMode.value ? 'activado' : 'desactivado'}`)
  }

  function initializeTheme() {
    const saved = authStore.userProfile?.dashboard?.theme || 'light'
    applyTheme(saved)
    console.log(`🎨 Tema inicializado: ${saved}`)
  }

  return {
    showLayout,
    isPublicPage,
    isDarkMode,
    toggleDarkMode,
    initializeTheme
  }
}
