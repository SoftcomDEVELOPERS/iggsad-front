<!-- src/components/dashboard/DashboardGrid.vue -->
<template>
  <div class="dashboard-grid-container">
    <!-- Modo configuración: barra de herramientas -->
    <div v-if="configMode" class="config-toolbar mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h4 class="text-sm font-semibold text-blue-800">Modo Personalización</h4>
          <div class="flex items-center gap-2 text-xs text-blue-700">
            <i class="pi pi-info-circle"></i>
            <span>Arrastra para mover • Esquinas para redimensionar</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button 
            icon="pi pi-plus" 
            label="Añadir Card" 
            size="small"
            outlined
            @click="$emit('show-card-library')"
          />
          <Button 
            icon="pi pi-refresh" 
            label="Reset Layout" 
            size="small"
            severity="secondary"
            outlined
            @click="resetLayout"
          />
        </div>
      </div>
    </div>

    <!-- Grid Layout Principal -->
    <grid-layout
      v-model:layout="currentLayout"
      :col-num="colNum"
      :row-height="rowHeight"
      :is-draggable="configMode"
      :is-resizable="configMode"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[16, 16]"
      :use-css-transforms="true"
      :responsive="true"
      :breakpoints="breakpoints"
      :cols="responsiveCols"
      @layout-updated="handleLayoutUpdate"
      @breakpoint-changed="handleBreakpointChange"
    >
      <grid-item
        v-for="item in currentLayout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="getCardConfig(item.i)?.minW || 2"
        :min-h="getCardConfig(item.i)?.minH || 2"
        :max-w="getCardConfig(item.i)?.maxW || 12"
        :max-h="getCardConfig(item.i)?.maxH || 10"
        class="grid-item-container"
        :class="{ 'config-mode': configMode }"
      >
        <!-- Wrapper universal para todas las cards -->
        <GridCard
          :card-id="item.i"
          :card-config="getCardConfig(item.i)"
          :config-mode="configMode"
          :data="getCardData(item.i)"
          @remove-card="removeCard"
          @configure-card="configureCard"
        >
          <!-- Renderizar componente dinámico según tipo de card -->
          <component
            :is="getCardComponent(item.i)"
            :card-id="item.i"
            :config="getCardConfig(item.i)"
            :data="getCardData(item.i)"
            :config-mode="configMode"
            @update-config="updateCardConfig"
          />
        </GridCard>
      </grid-item>
    </grid-layout>

    <!-- Placeholder cuando no hay cards -->
    <div v-if="currentLayout.length === 0" class="empty-dashboard">
      <div class="text-center py-12">
        <i class="pi pi-th-large text-4xl text-slate-300 mb-4"></i>
        <h3 class="text-lg font-medium text-slate-600 mb-2">Dashboard Vacío</h3>
        <p class="text-sm text-slate-500 mb-4">Añade cards para personalizar tu experiencia</p>
        <Button 
          icon="pi pi-plus" 
          label="Añadir Primera Card" 
          @click="$emit('show-card-library')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
import Button from 'primevue/button'
import GridCard from './GridCard.vue'
import StatsDashboard from './cards/StatsDashboard.vue'
import RecentSearchesCard from './cards/RecentSearchesCard.vue'
import NotificationsCard from './cards/NotificationsCard.vue'
import ChatCard from './cards/ChatCard.vue'
import QuickActionsCard from './cards/QuickActionsCard.vue'

const props = defineProps({
  layout: {
    type: Array,
    required: true
  },
  cardsConfig: {
    type: Object,
    default: () => ({})
  },
  cardsData: {
    type: Object,
    default: () => ({})
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'layout-updated',
  'card-removed',
  'card-configured',
  'card-config-updated',
  'show-card-library',
  'breakpoint-changed'
])

// Estado del grid
const currentLayout = ref([...props.layout])
const currentBreakpoint = ref('lg')

// Configuración responsive
const breakpoints = {
  lg: 1200,
  md: 768,
  sm: 576,
  xs: 0
}

const responsiveCols = {
  lg: 12,
  md: 8,
  sm: 4,
  xs: 2
}

// Configuración del grid
const colNum = computed(() => responsiveCols[currentBreakpoint.value])
const rowHeight = computed(() => {
  switch (currentBreakpoint.value) {
    case 'xs': return 80
    case 'sm': return 70
    case 'md': return 60
    default: return 60
  }
})

// Mapeo de componentes
const cardComponents = {
  'stats-dashboard': StatsDashboard,
  'recent-searches': RecentSearchesCard,
  'notifications': NotificationsCard,
  'chat': ChatCard,
  'quick-actions': QuickActionsCard
}

// Configuración por defecto de las cards
const defaultCardConfigs = {
  'stats-dashboard': {
    minW: 4, minH: 3, maxW: 12, maxH: 6,
    title: 'Estadísticas',
    selectedStats: ['casos-activos', 'audiencias-proximas', 'casos-urgentes', 'total-clientes'],
    gridLayout: 'auto'
  },
  'recent-searches': {
    minW: 6, minH: 4, maxW: 12, maxH: 8,
    title: 'Búsquedas Recientes',
    maxItems: 5,
    showActions: true
  },
  'notifications': {
    minW: 3, minH: 4, maxW: 6, maxH: 12,
    title: 'Notificaciones',
    maxItems: 10,
    showMarkAllRead: true
  },
  'chat': {
    minW: 3, minH: 4, maxW: 6, maxH: 10,
    title: 'Chat',
    maxMessages: 5,
    showOpenChat: true
  },
  'quick-actions': {
    minW: 3, minH: 3, maxW: 6, maxH: 6,
    title: 'Acciones Rápidas',
    layout: 'vertical'
  }
}

// Métodos
const getCardComponent = (cardId) => {
  const cardType = cardId.includes('-') ? cardId.split('-')[0] + '-' + cardId.split('-')[1] : cardId
  return cardComponents[cardType] || cardComponents['stats-dashboard']
}

const getCardConfig = (cardId) => {
  return {
    ...defaultCardConfigs[cardId],
    ...props.cardsConfig[cardId]
  }
}

const getCardData = (cardId) => {
  return props.cardsData[cardId] || {}
}

const handleLayoutUpdate = (newLayout) => {
  currentLayout.value = newLayout
  emit('layout-updated', newLayout)
}

const handleBreakpointChange = (breakpoint, layout) => {
  currentBreakpoint.value = breakpoint
  emit('breakpoint-changed', { breakpoint, layout })
  console.log(`Grid breakpoint changed to: ${breakpoint}`)
}

const removeCard = (cardId) => {
  currentLayout.value = currentLayout.value.filter(item => item.i !== cardId)
  emit('card-removed', cardId)
}

const configureCard = (cardId) => {
  emit('card-configured', cardId)
}

const updateCardConfig = (cardId, newConfig) => {
  emit('card-config-updated', cardId, newConfig)
}

const resetLayout = () => {
  // Layout por defecto
  const defaultLayout = [
    { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
    { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
    { i: 'notifications', x: 8, y: 0, w: 4, h: 6 },
    { i: 'chat', x: 8, y: 6, w: 4, h: 4 },
    { i: 'quick-actions', x: 8, y: 10, w: 4, h: 3 }
  ]
  
  currentLayout.value = [...defaultLayout]
  emit('layout-updated', defaultLayout)
}

const addCard = (cardType, position = null) => {
  const newCardId = `${cardType}-${Date.now()}`
  const defaultPos = position || { x: 0, y: 0, w: 4, h: 4 }
  
  const newItem = {
    i: newCardId,
    ...defaultPos
  }
  
  currentLayout.value.push(newItem)
  emit('layout-updated', currentLayout.value)
}

// Watchers
watch(() => props.layout, (newLayout) => {
  currentLayout.value = [...newLayout]
}, { deep: true })

// Lifecycle
onMounted(() => {
  console.log('DashboardGrid montado con layout:', currentLayout.value)
})

// Exponer métodos públicos
defineExpose({
  addCard,
  removeCard,
  resetLayout,
  currentLayout: currentLayout.value
})
</script>

<style scoped>
.dashboard-grid-container {
  width: 100%;
  min-height: 400px;
}

.grid-item-container {
  transition: all 0.2s ease;
}

.grid-item-container.config-mode {
  /* Estilos para modo configuración */
}

.config-toolbar {
  user-select: none;
}

.empty-dashboard {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

/* Estilos para vue-grid-layout */
:deep(.vue-grid-layout) {
  background: transparent;
}

:deep(.vue-grid-item) {
  transition: all 0.2s ease;
  border-radius: 8px;
}

:deep(.vue-grid-item.cssTransforms) {
  transition-property: transform, opacity;
}

:deep(.vue-grid-item.resizing) {
  opacity: 0.9;
  z-index: 3;
}

:deep(.vue-grid-item.vue-draggable-dragging) {
  transition: none;
  z-index: 3;
  opacity: 0.9;
}

:deep(.vue-grid-item.no-touch) {
  -ms-touch-action: none;
  touch-action: none;
}

/* Resize handles */
:deep(.vue-resizable-handle) {
  position: absolute;
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.vue-grid-item:hover .vue-resizable-handle) {
  opacity: 0.8;
}

:deep(.vue-grid-item.config-mode .vue-resizable-handle) {
  opacity: 0.6;
}

:deep(.vue-resizable-handle-se) {
  bottom: 1px;
  right: 1px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEySDlWOUgxMlYxMlpNMTIgNkg5VjNIMTJWNloiIGZpbGw9IiM2MzY2ZjEiLz4KPC9zdmc+');
  background-repeat: no-repeat;
  background-position: bottom right;
  cursor: nw-resize;
  width: 12px;
  height: 12px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .config-toolbar {
    padding: 0.75rem;
  }
  
  .config-toolbar .flex {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  :deep(.vue-grid-layout) {
    margin: 0 -8px;
  }
}

@media (max-width: 576px) {
  :deep(.vue-grid-layout) {
    margin: 0 -4px;
  }
  
  .empty-dashboard {
    min-height: 300px;
    margin: 1rem 0;
  }
}
</style>