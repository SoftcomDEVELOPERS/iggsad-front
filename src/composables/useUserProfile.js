// src/composables/useUserProfile.js
import { reactive, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getDefaultUserProfile } from '@/utils/defaultUserProfile'

export function useUserProfile() {
  const authStore = useAuthStore()

  // Perfil combinado: defaults + servidor
  const profile = reactive({
    ...getDefaultUserProfile(),
    ...authStore.userProfile
  })

  // 1. Carga del perfil (defaults + authStore.userProfile)
  function loadProfile() {
    const defaults = getDefaultUserProfile()
    Object.assign(profile, defaults, authStore.userProfile)
  }

  // 2. Guarda en authStore y localStorage
  async function saveProfile() {
    // Actualizar el store
    authStore.userProfile = { ...profile }
    // Llamada al método de sincronización del store
    await authStore.updateUserProfile?.(profile)
  }

  // 3. Restablece a defaults
  async function resetProfile() {
    const defaults = getDefaultUserProfile()
    Object.assign(profile, defaults)
    await saveProfile()
  }

  // 4. Actualiza secciones genéricas
  async function updateSection(sectionKey, data) {
    profile[sectionKey] = {
      ...profile[sectionKey],
      ...data
    }
    await saveProfile()
  }

  // Atajos por sección
  const updateDashboardConfig    = (data) => updateSection('dashboard',    data)
  const updateDockConfig         = (data) => updateSection('dock',         data)
  const updateFiltersConfig      = (data) => updateSection('filters',      data)
  const updatePreferences        = (data) => updateSection('preferences',  data)
  const updateNotificationsConfig= (data) => updateSection('notifications',data)
  const updateIntegrationsConfig = (data) => updateSection('integrations', data)

  // 5. Búsquedas recientes
  const recentSearches = computed(() => profile.recentSearches || [])

  async function addRecentSearch(search) {
    const max = profile.preferences?.searchConfig?.maxHistoryItems ?? 5
    const list = profile.recentSearches || []
    // Desduplicar y añadir al principio
    const updated = [search, ...list.filter(s => s.id !== search.id)]
    profile.recentSearches = updated.slice(0, max)
    await saveProfile()
  }

  // 6. Auto‐load al montar el layout
  onMounted(() => {
    loadProfile()
  })

  // 7. Auto‐save al cambiar layout (útil para que "se registre automáticamente")
  watch(
    () => profile.dashboard?.layout,
    () => {
      saveProfile().catch(console.error)
    },
    { deep: true }
  )

  return {
    // Datos
    profile,
    recentSearches,

    // Carga y guardado
    loadProfile,
    saveProfile,
    resetProfile,

    // Actualizaciones genéricas y atajos
    updateSection,
    updateDashboardConfig,
    updateDockConfig,
    updateFiltersConfig,
    updatePreferences,
    updateNotificationsConfig,
    updateIntegrationsConfig,

    // Búsquedas recientes
    addRecentSearch
  }
}
