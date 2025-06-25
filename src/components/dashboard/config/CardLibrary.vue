<!-- src/components/dashboard/config/CardLibrary.vue -->
<template>
  <div class="card-library">
    <!-- Header con búsqueda -->
    <div class="library-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-slate-800">
          <i class="pi pi-th-large mr-2"></i>
          Librería de Cards
        </h3>
        <Button
          icon="pi pi-times"
          text
          size="small"
          @click="$emit('close')"
          title="Cerrar librería"
        />
      </div>
      
      <!-- Búsqueda y filtros -->
      <div class="space-y-3">
        <div class="relative">
          <InputText
            v-model="searchQuery"
            placeholder="Buscar cards..."
            class="w-full pl-10"
          />
          <i class="pi pi-search absolute left-3 top-3 text-slate-400"></i>
        </div>
        
        <!-- Filtros por categoría -->
        <div class="flex gap-2 flex-wrap">
          <Button
            v-for="category in categories"
            :key="category.id"
            :label="category.label"
            size="small"
            :outlined="selectedCategory !== category.id"
            @click="selectedCategory = selectedCategory === category.id ? null : category.id"
            class="text-xs"
          />
        </div>
      </div>
    </div>

    <!-- Grid de cards disponibles -->
    <div class="library-content p-4 overflow-y-auto" style="max-height: 60vh;">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="card-preview border border-slate-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
          :class="{
            'bg-blue-50 border-blue-300': isCardInDashboard(card.id),
            'bg-white': !isCardInDashboard(card.id)
          }"
          @click="toggleCardInDashboard(card)"
        >
          <!-- Preview del card -->
          <div class="card-preview-header flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <i 
                :class="card.icon" 
                :style="{ color: card.color || '#6366f1' }"
                class="text-lg"
              ></i>
              <span class="font-medium text-sm">{{ card.title }}</span>
            </div>
            
            <!-- Estado -->
            <div class="flex items-center gap-1">
              <Badge
                v-if="isCardInDashboard(card.id)"
                value="Añadida"
                severity="success"
                size="small"
              />
              <Button
                :icon="isCardInDashboard(card.id) ? 'pi pi-minus' : 'pi pi-plus'"
                text
                size="small"
                :class="isCardInDashboard(card.id) ? 'text-red-500' : 'text-blue-500'"
              />
            </div>
          </div>

          <!-- Descripción -->
          <p class="text-xs text-slate-600 mb-3">{{ card.description }}</p>

          <!-- Configuraciones disponibles -->
          <div v-if="card.configurations && card.configurations.length > 0" class="mb-3">
            <span class="text-xs font-medium text-slate-700">Configuraciones:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <Tag
                v-for="config in card.configurations.slice(0, 3)"
                :key="config"
                :value="config"
                severity="info"
                class="text-xs"
              />
              <Tag
                v-if="card.configurations.length > 3"
                :value="`+${card.configurations.length - 3}`"
                severity="secondary"
                class="text-xs"
              />
            </div>
          </div>

          <!-- Preview visual del contenido -->
          <div class="card-content-preview bg-slate-50 rounded p-2 text-xs">
            <component
              :is="getPreviewComponent(card)"
              :card="card"
              :preview-mode="true"
            />
          </div>

          <!-- Tamaño recomendado -->
          <div class="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>{{ card.category }}</span>
            <span>{{ card.recommendedSize?.w }}x{{ card.recommendedSize?.h }}</span>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="filteredCards.length === 0" class="text-center py-12">
        <i class="pi pi-search text-4xl text-slate-300 mb-4"></i>
        <h4 class="text-lg font-medium text-slate-600 mb-2">No se encontraron cards</h4>
        <p class="text-sm text-slate-500">
          {{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay cards disponibles en esta categoría' }}
        </p>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div class="library-footer p-4 border-t border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-slate-600">
          {{ cardsInDashboard.length }} cards en dashboard
        </div>
        
        <div class="flex gap-2">
          <Button
            label="Importar Config"
            icon="pi pi-upload"
            outlined
            size="small"
            @click="$emit('import-config')"
          />
          <Button
            label="Exportar Config"
            icon="pi pi-download"
            outlined
            size="small"
            @click="$emit('export-config')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'

const props = defineProps({
  dashboardLayout: {
    type: Array,
    required: true
  },
  availableCards: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'card-added', 'card-removed', 'import-config', 'export-config'])

// Estado reactivo
const searchQuery = ref('')
const selectedCategory = ref(null)

// Categorías disponibles
const categories = ref([
  { id: 'stats', label: 'Estadísticas', icon: 'pi pi-chart-bar' },
  { id: 'content', label: 'Contenido', icon: 'pi pi-list' },
  { id: 'actions', label: 'Acciones', icon: 'pi pi-cog' },
  { id: 'communication', label: 'Comunicación', icon: 'pi pi-comments' },
  { id: 'custom', label: 'Personalizada', icon: 'pi pi-plus-circle' }
])

// Definición completa de cards disponibles
const defaultAvailableCards = ref([
  {
    id: 'stats-dashboard',
    title: 'Panel de Estadísticas',
    description: 'Dashboard personalizable con múltiples métricas y estadísticas',
    icon: 'pi pi-chart-bar',
    color: '#3b82f6',
    category: 'stats',
    recommendedSize: { w: 8, h: 4 },
    configurations: ['Grid 2x2', 'Grid 1x4', 'Grid 4x1', 'Auto'],
    component: 'StatsDashboard'
  },
  {
    id: 'recent-searches',
    title: 'Búsquedas Recientes',
    description: 'Historial de búsquedas realizadas con acciones rápidas',
    icon: 'pi pi-search',
    color: '#10b981',
    category: 'content',
    recommendedSize: { w: 8, h: 5 },
    configurations: ['Máximo elementos', 'Mostrar acciones', 'Formato compacto'],
    component: 'RecentSearchesCard'
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    description: 'Centro de notificaciones del sistema',
    icon: 'pi pi-bell',
    color: '#f59e0b',
    category: 'communication',
    recommendedSize: { w: 4, h: 6 },
    configurations: ['Máximo elementos', 'Auto-actualizar', 'Filtros por tipo'],
    component: 'NotificationsCard'
  },
  {
    id: 'chat',
    title: 'Chat',
    description: 'Vista previa de mensajes y conversaciones',
    icon: 'pi pi-comments',
    color: '#8b5cf6',
    category: 'communication',
    recommendedSize: { w: 4, h: 4 },
    configurations: ['Máximo mensajes', 'Mostrar avatares', 'Enlaces rápidos'],
    component: 'ChatCard'
  },
  {
    id: 'quick-actions',
    title: 'Acciones Rápidas',
    description: 'Botones de acceso rápido a funciones principales',
    icon: 'pi pi-bolt',
    color: '#ef4444',
    category: 'actions',
    recommendedSize: { w: 4, h: 3 },
    configurations: ['Layout vertical', 'Layout horizontal', 'Iconos grandes'],
    component: 'QuickActionsCard'
  },
  {
    id: 'calendar',
    title: 'Calendario',
    description: 'Vista de calendario con próximos eventos y audiencias',
    icon: 'pi pi-calendar',
    color: '#06b6d4',
    category: 'content',
    recommendedSize: { w: 6, h: 5 },
    configurations: ['Vista mensual', 'Vista semanal', 'Solo próximos eventos'],
    component: 'CalendarCard'
  },
  {
    id: 'documents',
    title: 'Documentos Recientes',
    description: 'Lista de documentos subidos recientemente',
    icon: 'pi pi-file',
    color: '#84cc16',
    category: 'content',
    recommendedSize: { w: 6, h: 4 },
    configurations: ['Vista lista', 'Vista grid', 'Filtros por tipo'],
    component: 'DocumentsCard'
  },
  {
    id: 'weather',
    title: 'Clima',
    description: 'Información meteorológica actual y pronóstico',
    icon: 'pi pi-sun',
    color: '#f97316',
    category: 'custom',
    recommendedSize: { w: 3, h: 3 },
    configurations: ['Ubicación automática', 'Pronóstico extendido', 'Unidades'],
    component: 'WeatherCard'
  },
  {
    id: 'custom-widget',
    title: 'Widget Personalizado',
    description: 'Crea tu propio widget con HTML/CSS personalizado',
    icon: 'pi pi-code',
    color: '#6366f1',
    category: 'custom',
    recommendedSize: { w: 4, h: 4 },
    configurations: ['Código HTML', 'Estilos CSS', 'Datos dinámicos'],
    component: 'CustomCard'
  }
])

// Computed
const cardsInDashboard = computed(() => {
  return props.dashboardLayout.map(item => item.i)
})

const filteredCards = computed(() => {
  let cards = props.availableCards.length > 0 ? props.availableCards : defaultAvailableCards.value
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    cards = cards.filter(card => 
      card.title.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query) ||
      card.category.toLowerCase().includes(query)
    )
  }
  
  // Filtrar por categoría
  if (selectedCategory.value) {
    cards = cards.filter(card => card.category === selectedCategory.value)
  }
  
  return cards
})

// Métodos
const isCardInDashboard = (cardId) => {
  return cardsInDashboard.value.includes(cardId)
}

const toggleCardInDashboard = (card) => {
  if (isCardInDashboard(card.id)) {
    emit('card-removed', card.id)
  } else {
    const newItem = {
      i: card.id,
      x: 0,
      y: 0,
      w: card.recommendedSize?.w || 4,
      h: card.recommendedSize?.h || 4
    }
    emit('card-added', newItem)
  }
}

const getPreviewComponent = (card) => {
  // Componente de preview simplificado
  return {
    template: `
      <div class="text-center text-slate-500">
        <i :class="card.icon" class="text-lg mb-1"></i>
        <div class="text-xs">{{ card.title }}</div>
      </div>
    `,
    props: ['card', 'previewMode']
  }
}

// Lifecycle
onMounted(() => {
  console.log('CardLibrary montada con', filteredCards.value.length, 'cards disponibles')
})
</script>

<style scoped>
.card-library {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.library-header {
  flex-shrink: 0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.library-content {
  flex: 1;
  overflow-y: auto;
}

.library-footer {
  flex-shrink: 0;
}

.card-preview {
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.card-preview:hover {
  transform: translateY(-2px);
}

.card-preview:active {
  transform: translateY(0);
}

.card-content-preview {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .card-library {
    max-width: 95vw;
    max-height: 90vh;
  }
  
  .library-content .grid {
    grid-template-columns: 1fr;
  }
  
  .library-footer .flex {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}

/* Scrollbar personalizado */
.library-content::-webkit-scrollbar {
  width: 6px;
}

.library-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.library-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.library-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones */
.card-preview {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>