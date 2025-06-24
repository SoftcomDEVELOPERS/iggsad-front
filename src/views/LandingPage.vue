<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header de bienvenida -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">
            Sistema de Gestión Procesal
          </h1>
          <p class="text-slate-600">
            Dashboard principal - {{ new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-500">Último acceso</p>
          <p class="text-slate-700 font-medium">{{ lastAccess }}</p>
        </div>
      </div>
      
      <!-- Mensaje de estado global -->
      <div v-if="globalMessage" class="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
        <p class="text-green-800 text-sm font-medium">{{ globalMessage }}</p>
      </div>
    </div>

    <!-- Barra de búsqueda principal -->
    <div class="mb-8">
      <div class="flex gap-3">
        <div class="flex-1">
          <SearchBar
            v-model="searchQuery"
            placeholder="Buscar expedientes por número, cliente, tipo..."
            :show-validation="true"
            validation-message="Ingrese un número de expediente"
            @search="performSearch"
            @clear="clearSearchFromBothSources"
          />
        </div>
        <Button 
          icon="pi pi-filter" 
          label="Filtros"
          @click="toggleFilters"
          :badge="totalActiveFilters > 0 ? totalActiveFilters.toString() : null"
          :severity="totalActiveFilters > 0 ? 'secondary' : undefined"
          :outlined="totalActiveFilters === 0"
        />
        <Button 
          icon="pi pi-search" 
          label="Buscar"
          @click="performSearch"
          :disabled="!canPerformSearch"
          :severity="canPerformSearch ? undefined : 'secondary'"
        />
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Panel principal - 2 columnas -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Últimas búsquedas -->
        <Card>
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800">Búsquedas Recientes</h3>
              <Button 
                icon="pi pi-trash" 
                text 
                size="small"
                severity="secondary"
                @click="clearSearchHistory"
                title="Limpiar historial"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-2" v-if="recentSearches.length > 0">
              <div 
                v-for="search in recentSearches" 
                :key="search.id"
                class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-sm"
                @click="selectRecentSearch(search)"
              >
                <div class="flex items-center space-x-3">
                  <span class="font-mono text-blue-600 font-medium">{{ search.expediente }}</span>
                  <span class="text-slate-700">{{ search.cliente }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span class="text-green-600 font-medium">{{ search.deuda }}</span>
                  <Button 
                    icon="pi pi-times" 
                    text 
                    size="small"
                    @click.stop="removeRecentSearch(search.id)"
                  />
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-slate-500">
              <i class="pi pi-search text-2xl mb-2 block"></i>
              <p>No hay búsquedas recientes</p>
            </div>
          </template>
        </Card>

        <!-- Resultados de búsqueda o estadísticas -->
        <Card v-if="searchResults.length > 0">
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800">
                Resultados ({{ searchResults.length }})
              </h3>
              <Button 
                icon="pi pi-times" 
                text 
                size="small"
                @click="clearSearch"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-2">
              <div 
                v-for="result in searchResults" 
                :key="result.id"
                class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-l-4 text-sm"
                :class="getPriorityBorderColor(result.priority)"
                @click="openCase(result.id)"
              >
                <div class="flex items-center space-x-3">
                  <span class="font-mono text-blue-600 font-medium">{{ result.number }}</span>
                  <span class="text-slate-700">{{ result.client }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <span :class="getStatusClass(result.status)" class="text-xs px-2 py-1 rounded-full">
                    {{ result.statusText }}
                  </span>
                  <span class="text-xs text-slate-500">{{ result.lastUpdate }}</span>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Tarjetas de estadísticas -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
            <template #content>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="pi pi-folder text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-800">{{ stats.totalCases }}</p>
                  <p class="text-sm text-slate-600">Casos Activos</p>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
            <template #content>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="pi pi-calendar text-green-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-800">{{ stats.upcomingHearings }}</p>
                  <p class="text-sm text-slate-600">Audiencias Próximas</p>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
            <template #content>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="pi pi-exclamation-triangle text-amber-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-800">{{ stats.urgentCases }}</p>
                  <p class="text-sm text-slate-600">Casos Urgentes</p>
                </div>
              </div>
            </template>
          </Card>

          <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
            <template #content>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i class="pi pi-users text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p class="text-2xl font-bold text-slate-800">{{ stats.totalClients }}</p>
                  <p class="text-sm text-slate-600">Clientes</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Panel lateral derecho -->
      <div class="space-y-6">
        <!-- Notificaciones -->
        <Card>
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i class="pi pi-bell mr-2"></i>
                Notificaciones
                <Badge v-if="unreadNotifications > 0" :value="unreadNotifications" class="ml-2" />
              </h3>
              <Button 
                icon="pi pi-check-circle" 
                text 
                size="small"
                @click="markAllAsRead"
                title="Marcar todas como leídas"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="notification in notifications" 
                :key="notification.id"
                class="p-3 rounded-lg border-l-4 text-xs"
                :class="getNotificationClass(notification)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p class="font-medium text-slate-800 mb-1">{{ notification.title }}</p>
                    <p class="text-slate-600 mb-2">{{ notification.message }}</p>
                    <p class="text-slate-500">{{ notification.time }}</p>
                  </div>
                  <Button 
                    v-if="!notification.read"
                    icon="pi pi-times" 
                    text 
                    size="small"
                    @click="markAsRead(notification.id)"
                  />
                </div>
              </div>
            </div>
            <div v-if="notifications.length === 0" class="text-center py-4 text-slate-500">
              <i class="pi pi-bell-slash text-2xl mb-2 block"></i>
              <p class="text-sm">No hay notificaciones</p>
            </div>
          </template>
        </Card>

        <!-- Mensajes del chat -->
        <Card>
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800 flex items-center">
                <i class="pi pi-comments mr-2"></i>
                Chat
                <Badge v-if="unreadMessages > 0" :value="unreadMessages" class="ml-2" severity="success" />
              </h3>
              <Button 
                icon="pi pi-external-link" 
                text 
                size="small"
                @click="openChat"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="message in recentMessages" 
                :key="message.id"
                class="p-3 bg-green-50 rounded-lg border-l-4 border-green-400 cursor-pointer hover:bg-green-100 text-xs"
                @click="openMessage(message)"
              >
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium text-slate-800">{{ message.sender }}</p>
                  <div v-if="message.unread" class="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <p class="text-slate-600 mb-2 line-clamp-2">{{ message.preview }}</p>
                <p class="text-slate-500">{{ message.time }}</p>
              </div>
            </div>
            <div v-if="recentMessages.length === 0" class="text-center py-4 text-slate-500">
              <i class="pi pi-comment text-2xl mb-2 block"></i>
              <p class="text-sm">No hay mensajes</p>
            </div>
          </template>
        </Card>

        <!-- Acciones rápidas -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-800 p-6 pb-0">Acciones Rápidas</h3>
          </template>
          <template #content>
            <div class="space-y-2">
              <Button 
                label="Nuevo Caso" 
                icon="pi pi-plus" 
                fluid 
                size="small"
                @click="$router.push('/casos/nuevo')"
              />
              <Button 
                label="Subir Documento" 
                icon="pi pi-upload" 
                fluid 
                outlined
                size="small"
                @click="$router.push('/documentos/upload')"
              />
              <Button 
                label="Nuevo Cliente" 
                icon="pi pi-user-plus" 
                fluid 
                outlined
                size="small"
                @click="$router.push('/clientes/nuevo')"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Componente Dock personalizado -->
    <Dock 
      :items="dockItems"
      @item-click="handleDockClick"
      @dock-hidden="onDockHidden"
      @dock-shown="onDockShown"
      hide-tooltip="Ocultar panel de navegación"
      show-tooltip="Mostrar panel de navegación"
      :auto-hide="false"
    />

    <!-- Drawer de filtros avanzado con tamaño dinámico -->
    <Drawer 
      v-model:visible="showFilters" 
      position="bottom" 
      :modal="!drawerFullscreen"
      :dismissable-mask="!drawerFullscreen"
      class="filter-drawer"
      :style="drawerFullscreen ? 'height: 100vh; width: 100vw;' : 'height: 75vh;'"
    >
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-semibold text-slate-800">Filtros de Búsqueda de Expedientes</h2>
          <div class="flex gap-2">
            <Button 
              :icon="drawerFullscreen ? 'pi pi-compress' : 'pi pi-expand'"
              :label="drawerFullscreen ? 'Ventana' : 'Pantalla Completa'"
              outlined 
              size="small"
              class="text-xs"
              @click="toggleDrawerFullscreen"
            />
          </div>
        </div>
      </template>

      <FilterPanel 
        :persistent-filters="persistentFilters"
        :persistent-expediente-search="persistentExpedienteSearch"
        @apply-filters="handleApplyFilters"
        @clear-filters="handleClearFilters"
        @filter-change="handleFilterChange"
        @search-expediente="handleExpedienteSearch"
        @toggle-fullscreen="handleToggleFullscreen"
      />
    </Drawer>
  </div>
</template>    

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Drawer from 'primevue/drawer'
import Dock from '@/components/Dock.vue'
import FilterPanel from '@/components/filters/FilterPanel.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useExpedientesStore } from '@/stores/expedientes'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showWarn, showError, showSuccess } = useToast()
// Estado reactivo
const searchQuery = ref('')
const showFilters = ref(false)
const searchResults = ref([])
const lastAccess = ref('14 Jun 2025, 09:30')

// ✅ Estado persistente de filtros
const persistentFilters = ref({})
const persistentExpedienteSearch = ref('')
const drawerFullscreen = ref(false)

const expedientesStore = useExpedientesStore()

// Mensaje global del sistema
const globalMessage = ref('Estamos a 23. Has recuperado 0,00 €. Muy lejos del objetivo de 0,00 €. Estás dando pérdidas.')

// Datos
const stats = ref({
  totalCases: 147,
  upcomingHearings: 12,
  urgentCases: 5,
  totalClients: 89
})

const recentSearches = ref([
  { 
    id: 1, 
    expediente: 'EXP-2024-001', 
    cliente: 'García López, María',
    deuda: '€25,450'
  },
  { 
    id: 2, 
    expediente: 'EXP-2024-045', 
    cliente: 'Empresas del Norte S.L.',
    deuda: '€87,230'
  },
  { 
    id: 3, 
    expediente: 'EXP-2024-023', 
    cliente: 'Martín Rodríguez, Juan',
    deuda: '€12,800'
  }
])

const notifications = ref([
  {
    id: 1,
    title: 'Audiencia mañana',
    message: 'EXP-2024-001 a las 10:00',
    time: 'Hace 1h',
    read: false
  },
  {
    id: 2,
    title: 'Documento subido',
    message: 'Nuevo archivo en EXP-2024-045',
    time: 'Hace 2h',
    read: false
  },
  {
    id: 3,
    title: 'Plazo próximo',
    message: 'Alegaciones EXP-2024-023',
    time: 'Ayer',
    read: true
  }
])

const recentMessages = ref([
  {
    id: 1,
    sender: 'María García',
    preview: '¿Podemos revisar el contrato mañana?',
    time: 'Hace 30 min',
    unread: true
  },
  {
    id: 2,
    sender: 'Juan Martín',
    preview: 'Adjunto documentación solicitada',
    time: 'Hace 1h',
    unread: true
  }
])

// Items del Dock
const dockItems = ref([
  {
    id: 'casos',
    label: 'Casos',
    icon: 'pi pi-folder',
    active: false,
    command: () => router.push('/casos')
  },
  {
    id: 'audiencias',
    label: 'Audiencias',
    icon: 'pi pi-calendar',
    badge: stats.value.upcomingHearings.toString(),
    command: () => router.push('/audiencias')
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: 'pi pi-users',
    command: () => router.push('/clientes')
  },
  {
    id: 'documentos',
    label: 'Documentos',
    icon: 'pi pi-file',
    command: () => router.push('/documentos')
  },
  {
    id: 'perfil',
    label: 'Perfil',
    icon: 'pi pi-user',
    command: () => router.push('/perfil')
  }
])

// Computed
const unreadNotifications = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const unreadMessages = computed(() => 
  recentMessages.value.filter(m => m.unread).length
)

// ✅ Calcular filtros activos desde el estado persistente
const totalActiveFilters = computed(() => {
  let count = 0
  
  // ✅ NO contar la búsqueda por expediente como filtro
  // Solo contar filtros del objeto persistente (NO la búsqueda)
  Object.entries(persistentFilters.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      if (Array.isArray(value)) {
        const validItems = value.filter(v => v !== null && v !== '' && v !== undefined)
        if (validItems.length > 0) {
          count++
        }
      } else {
        count++
      }
    }
  })
  
  return count
})

// ✅ Computed para validar si se puede buscar
const canPerformSearch = computed(() => {
  const hasExpediente = (searchQuery.value && searchQuery.value.trim()) || 
                       (persistentExpedienteSearch.value && persistentExpedienteSearch.value.trim())
  return hasExpediente
})

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
  
  // ✅ Siempre abrir en modo minimizado
  if (showFilters.value) {
    drawerFullscreen.value = false
  }
}

const addToRecentSearches = (query) => {
  const newSearch = {
    id: Date.now(),
    expediente: query.includes('EXP-') ? query : `EXP-2024-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
    cliente: query.includes('EXP-') ? 'Cliente Ejemplo' : query,
    deuda: `€${(Math.random() * 100000).toFixed(0)}`
  }
  
  const exists = recentSearches.value.find(s => s.expediente === newSearch.expediente)
  if (!exists) {
    recentSearches.value.unshift(newSearch)
    if (recentSearches.value.length > 5) {
      recentSearches.value = recentSearches.value.slice(0, 5)
    }
  }
}

// ✅ Método para mostrar mensaje de validación
const showSearchValidation = () => {
  console.warn('⚠️ Debe ingresar un número de expediente para realizar la búsqueda')
   showWarn(
    'Búsqueda requerida',
    'Debe ingresar un número de expediente para realizar la búsqueda'
  )
}

const performSearch = async () => {
  const expedienteQuery = searchQuery.value || persistentExpedienteSearch.value
  
  if (!expedienteQuery || !expedienteQuery.trim()) {
    console.warn('⚠️ No se puede buscar sin número de expediente')
    showSearchValidation()
    return
  }
  
  try {
    console.log('🔍 Iniciando búsqueda desde LandingPage:', expedienteQuery.trim())
    
    // ✅ NO actualizar persistentExpedienteSearch aquí si ya está igual
    if (persistentExpedienteSearch.value !== expedienteQuery.trim()) {
      persistentExpedienteSearch.value = expedienteQuery.trim()
    }
    
    await expedientesStore.searchExpedientes(persistentFilters.value, expedienteQuery.trim())
    
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(),
      statusText: exp.estado
    }))
    
    addToRecentSearches(expedienteQuery.trim())
    console.log('✅ Búsqueda desde LandingPage completada:', searchResults.value.length)
    
  } catch (error) {
    console.error('❌ Error en búsqueda desde LandingPage:', error)
    searchResults.value = []
  }
}

const selectRecentSearch = (search) => {
  searchQuery.value = search.expediente
  performSearch()
}

const removeRecentSearch = (searchId) => {
  recentSearches.value = recentSearches.value.filter(s => s.id !== searchId)
}

const clearSearchHistory = () => {
  recentSearches.value = []
  // ✅ También limpiar búsquedas activas
  clearSearchFromBothSources()
}

const clearSearch = () => {
  clearSearchFromBothSources()
}

const clearSearchFromBothSources = () => {
  searchQuery.value = ''
  persistentExpedienteSearch.value = ''
  searchResults.value = []
  expedientesStore.clearResults()
  console.log('🧹 Búsqueda limpiada desde ambas fuentes')
}

// ✅ Manejar filtros de forma persistente
const handleApplyFilters = async (filterData) => {
  console.log('📋 Aplicando filtros desde FilterPanel:', filterData)
  
  // ✅ Guardar filtros persistentemente
  persistentFilters.value = { ...filterData }
  
  // ✅ No hacer búsqueda automática aquí, ya la hace el FilterPanel
  // Solo actualizar el estado local
  console.log('✅ Filtros guardados correctamente')
  
  // ✅ Si tenemos resultados en el store, sincronizarlos
  if (expedientesStore.hasExpedientes) {
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(),
      statusText: exp.estado
    }))
    console.log('🔄 Resultados sincronizados desde store:', searchResults.value.length)
  }
}

// Metodos para gestión de filtros
const handleClearFilters = () => {
  console.log('Limpiando todos los filtros')
  
  // ✅ Limpiar estado persistente
  persistentFilters.value = {}
  persistentExpedienteSearch.value = ''
  
  // ✅ Limpiar resultados y búsquedas
  clearSearchFromBothSources()
  
  console.log('✅ Filtros y búsquedas limpiados completamente')
}

const handleFilterChange = (filterData) => {
  console.log('Filtros cambiados:', filterData)
  
  // ✅ Actualizar filtros persistentes en tiempo real
  persistentFilters.value = { ...filterData }
}

const handleExpedienteSearch = async (expediente) => {
  console.log('🔍 Búsqueda desde FilterPanel:', expediente)
  
  // ✅ Solo actualizar sin disparar watchers
  persistentExpedienteSearch.value = expediente || ''
  
  // ✅ Sincronizar searchQuery directamente
  if (expediente !== searchQuery.value) {
    searchQuery.value = expediente || ''
  }
  
  // ✅ Los resultados ya están en el store desde FilterPanel
  if (expedientesStore.hasExpedientes) {
    searchResults.value = expedientesStore.expedientes.map(exp => ({
      id: exp.id,
      number: exp.numero,
      client: exp.cliente,
      lastUpdate: 'Hace 2h',
      priority: exp.estado === 'Activo' ? 'high' : 'normal',
      status: exp.estado.toLowerCase(), 
      statusText: exp.estado
    }))
    
    if (expediente) {
      addToRecentSearches(expediente)
    }
  }
}


// ✅ Método para alternar pantalla completa del drawer
const toggleDrawerFullscreen = () => {
  drawerFullscreen.value = !drawerFullscreen.value
  console.log('Drawer fullscreen:', drawerFullscreen.value)
}

// Mantener este método para recibir eventos del FilterPanel
const handleToggleFullscreen = (isFullscreen) => {
  drawerFullscreen.value = isFullscreen
  console.log('Drawer fullscreen desde FilterPanel:', isFullscreen)
}

const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) notification.read = true
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const openCase = (caseId) => {
  router.push(`/casos/${caseId}`)
}

const openMessage = (message) => {
  message.unread = false
  router.push('/chat')
}

const openChat = () => {
  router.push('/chat')
}

// Métodos del Dock
const handleDockClick = (item) => {
  console.log('Dock item clicked:', item)
  
  // Actualizar estado activo
  dockItems.value.forEach(dockItem => {
    dockItem.active = dockItem.id === item.id
  })
  
  // Ejecutar comando si existe
  if (item.command) {
    item.command()
  }
}

const onDockHidden = () => {
  console.log('Dock ocultado')
}

const onDockShown = () => {
  console.log('Dock mostrado')
}

// Helpers
const getPriorityBorderColor = (priority) => {
  switch (priority) {
    case 'urgent': return 'border-red-500'
    case 'high': return 'border-amber-500'
    default: return 'border-green-500'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getNotificationClass = (notification) => {
  return notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-400'
}

onMounted(() => {
  console.log('Dashboard cargado')
  // Marcar el item actual como activo (ejemplo: dashboard)
  dockItems.value[0].active = true
})


</script>

<style scoped>

 /* Clases para estilos básicos */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Drawer fullscreen usando las clases nativas de PrimeVue */
.filter-drawer :deep(.p-drawer-full .p-drawer) {
  height: 100vh !important;
  width: 100vw !important;
}
</style>