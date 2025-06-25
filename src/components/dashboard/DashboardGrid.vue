<!-- src/components/dashboard/DashboardGrid.vue - VERSIÓN INTUITIVA -->
<template>
  <div class="dashboard-grid-container">
    <!-- Botón de configuración flotante -->
    <div class="config-toggle">
      <Button
        :icon="configMode ? 'pi pi-check' : 'pi pi-cog'"
        :label="configMode ? 'Finalizar' : 'Configurar'"
        :class="{ 
          'config-active': configMode,
          'config-inactive': !configMode 
        }"
        @click="toggleConfigMode"
        :severity="configMode ? 'success' : 'secondary'"
        size="small"
      />
    </div>

    <!-- Toolbar flotante en modo configuración -->
    <Transition name="slide-down">
      <div v-if="configMode" class="config-toolbar">
        <div class="toolbar-content">
          <div class="toolbar-section">
            <i class="pi pi-info-circle text-blue-600"></i>
            <span class="toolbar-text">Arrastra para mover • Esquina inferior derecha para redimensionar</span>
          </div>
          
          <div class="toolbar-actions">
            <Button
              icon="pi pi-plus"
              label="Añadir Card"
              size="small"
              outlined
              @click="showCardSelector = true"
            />
            <Button
              icon="pi pi-refresh"
              label="Reset"
              size="small"
              outlined
              severity="warn"
              @click="resetLayout"
            />
          </div>
        </div>
      </div>
    </Transition>

    <!-- Grid principal -->
    <div class="" :class="{ 'config-mode-active': configMode }">
      <grid-layout
        v-model:layout="currentLayout"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="configMode"
        :is-resizable="configMode"
        :vertical-compact="true"
        :use-css-transforms="true"
        :auto-size="true"
        :responsive="true"
        :breakpoints="breakpoints"
        :cols="responsiveCols"
        :margin="[12, 12]"
        class="full-width-grid"
        @update:layout="handleLayoutUpdate"
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
          class="grid-item"
          :class="{ 
            'in-config-mode': configMode,
            'dragging': isDragging && draggedItem === item.i,
            'resizing': isResizing && resizedItem === item.i
          }"
        >
          <!-- Card con overlay de configuración -->
          <div class="card-container">
            <!-- Overlay de configuración -->
            <div v-if="configMode" class="config-overlay">
              <div class="config-handles">
                <!-- Handle de arrastre -->
                <div class="drag-handle" title="Arrastra para mover">
                  <i class="pi pi-arrows-alt"></i>
                </div>
                
                <!-- Botón de eliminar -->
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  size="small"
                  text
                  rounded
                  class="remove-btn"
                  @click="removeCard(item.i)"
                  title="Eliminar card"
                />
              </div>
              
              <!-- Información de la card -->
              <div class="card-info">
                <span class="card-size">{{ item.w }}×{{ item.h }}</span>
              </div>
            </div>

            <!-- Contenido de la card -->
            <GridCard
              :card-id="item.i"
              :card-config="getCardConfig(item.i)"
              :config-mode="configMode"
              :data="getCardData(item.i)"
              :class="{ 'with-overlay': configMode }"
              @remove-card="removeCard"
              @configure-card="configureCard"
            >
              <component
                :is="getCardComponent(item.i)"
                :card-id="item.i"
                :config="getCardConfig(item.i)"
                :data="getCardData(item.i)"
                :config-mode="configMode"
                @update-config="updateCardConfig"
              />
            </GridCard>
          </div>
        </grid-item>
      </grid-layout>
    </div>

    <!-- Estado vacío -->
    <div v-if="currentLayout.length === 0" class="empty-dashboard">
      <div class="empty-content">
        <i class="pi pi-th-large"></i>
        <h3>Dashboard Personalizable</h3>
        <p>Activa el modo configuración para añadir y organizar tus cards</p>
        <Button 
          icon="pi pi-cog" 
          label="Configurar Dashboard" 
          @click="configMode = true"
        />
      </div>
    </div>

    <!-- Selector de cards (modal simple) -->
    <Dialog 
      v-model:visible="showCardSelector" 
      header="Seleccionar Card"
      modal
      :style="{ width: '600px' }"
    >
      <div class="card-selector-grid">
        <div 
          v-for="card in availableCards" 
          :key="card.id"
          class="card-option"
          :class="{ 'already-added': isCardInLayout(card.id) }"
          @click="addCard(card.id)"
        >
          <i :class="card.icon"></i>
          <span>{{ card.title }}</span>
          <Badge v-if="isCardInLayout(card.id)" value="Añadida" severity="success" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Badge from 'primevue/badge'
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
  }
})

const emit = defineEmits([
  'layout-updated',
  'card-removed',
  'card-configured',
  'card-config-updated',
  'config-mode-changed'
])

// Estado del grid
const currentLayout = ref([...props.layout])
const configMode = ref(false)
const showCardSelector = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)
const draggedItem = ref(null)
const resizedItem = ref(null)

// Configuración del grid
const colNum = 12
const rowHeight = 60
const breakpoints = { lg: 1200, md: 768, sm: 576, xs: 0 }
const responsiveCols = { lg: 12, md: 8, sm: 4, xs: 2 }

// Cards disponibles
const availableCards = [
  { id: 'stats-dashboard', title: 'Estadísticas', icon: 'pi pi-chart-bar' },
  { id: 'recent-searches', title: 'Búsquedas Recientes', icon: 'pi pi-search' },
  { id: 'notifications', title: 'Notificaciones', icon: 'pi pi-bell' },
  { id: 'chat', title: 'Chat', icon: 'pi pi-comments' },
  { id: 'quick-actions', title: 'Acciones Rápidas', icon: 'pi pi-bolt' }
]

// Computed
const isCardInLayout = (cardId) => {
  return currentLayout.value.some(item => item.i === cardId)
}

// Métodos
const toggleConfigMode = () => {
  configMode.value = !configMode.value
  emit('config-mode-changed', configMode.value)
  
  if (configMode.value) {
    // Mostrar ayuda visual
    nextTick(() => {
      document.querySelectorAll('.grid-item').forEach(el => {
        el.style.outline = '2px dashed #3b82f6'
        el.style.outlineOffset = '4px'
      })
    })
  } else {
    // Guardar cambios y ocultar ayuda visual
    document.querySelectorAll('.grid-item').forEach(el => {
      el.style.outline = 'none'
    })
    handleLayoutUpdate(currentLayout.value)
  }
}

const handleLayoutUpdate = (newLayout) => {
  if (JSON.stringify(newLayout) !== JSON.stringify(currentLayout.value)) {
    currentLayout.value = [...newLayout]
    emit('layout-updated', newLayout)
  }
}

const handleBreakpointChange = (newBreakpoint, newCols) => {
  emit('breakpoint-changed', { breakpoint: newBreakpoint, cols: newCols })
}

const addCard = (cardId) => {
  if (isCardInLayout(cardId)) return
  
  // Encontrar posición libre
  const newItem = {
    i: cardId,
    x: 0,
    y: 0,
    w: 4,
    h: 4
  }
  
  // Buscar posición óptima
  const existingItems = currentLayout.value
  let placed = false
  
  for (let y = 0; y < 20 && !placed; y++) {
    for (let x = 0; x <= colNum - newItem.w && !placed; x++) {
      const isOccupied = existingItems.some(item => 
        x < item.x + item.w && 
        x + newItem.w > item.x && 
        y < item.y + item.h && 
        y + newItem.h > item.y
      )
      
      if (!isOccupied) {
        newItem.x = x
        newItem.y = y
        placed = true
      }
    }
  }
  
  currentLayout.value.push(newItem)
  showCardSelector.value = false
  
  // Auto-save después de añadir
  nextTick(() => {
    handleLayoutUpdate(currentLayout.value)
  })
}

const removeCard = (cardId) => {
  const index = currentLayout.value.findIndex(item => item.i === cardId)
  if (index !== -1) {
    currentLayout.value.splice(index, 1)
    emit('card-removed', cardId)
    handleLayoutUpdate(currentLayout.value)
  }
}

const resetLayout = () => {
  if (confirm('¿Restablecer el dashboard a la configuración por defecto?')) {
    const defaultLayout = [
      { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
      { i: 'recent-searches', x: 8, y: 0, w: 4, h: 4 },
      { i: 'notifications', x: 0, y: 4, w: 6, h: 3 },
      { i: 'chat', x: 6, y: 4, w: 6, h: 3 }
    ]
    
    currentLayout.value = [...defaultLayout]
    handleLayoutUpdate(defaultLayout)
  }
}

// Métodos de configuración de cards
const getCardConfig = (cardId) => {
  return props.cardsConfig[cardId] || {}
}

const getCardData = (cardId) => {
  return props.cardsData[cardId] || {}
}

const getCardComponent = (cardId) => {
  const components = {
    'stats-dashboard': StatsDashboard,
    'recent-searches': RecentSearchesCard,
    'notifications': NotificationsCard,
    'chat': ChatCard,
    'quick-actions': QuickActionsCard
  }
  return components[cardId] || 'div'
}

const configureCard = (cardId) => {
  emit('card-configured', cardId)
}

const updateCardConfig = (cardId, config) => {
  emit('card-config-updated', cardId, config)
}

// Watchers
watch(() => props.layout, (newLayout) => {
  if (JSON.stringify(newLayout) !== JSON.stringify(currentLayout.value)) {
    currentLayout.value = [...newLayout]
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  console.log('DashboardGrid montado con layout:', currentLayout.value)
})
</script>

<style scoped>
.dashboard-grid-container {
  position: relative;
  width: 100%;
  max-width: none !important;
}

/* Botón de configuración flotante */
.config-toggle {
  display: flex;
  justify-content: flex-end;
  margin: 0 13px;
}

.config-toggle :deep(.p-button) {
  transition: all 0.3s ease;
  border-radius: 8px 8px 0 0;
}

.config-active :deep(.p-button) {
  background: #10b981;
  border-color: #10b981;
  transform: translateY(4px);
}

.config-inactive :deep(.p-button) {
  background: #6b7280;
  border-color: #6b7280;
}

/* Toolbar flotante */
.config-toolbar {
  position: sticky;
  top: 0;
  z-index: 9;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  margin-bottom: 1rem;
  margin-left: 13px;
  margin-right: 13px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.toolbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.toolbar-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-text {
  font-size: 0.875rem;
  color: #1e40af;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

/* Transiciones */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Grid wrapper */
.grid-wrapper {
  transition: all 0.3s ease;
}

.grid-wrapper.config-mode-active {
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(59, 130, 246, 0.05) 10px,
    rgba(59, 130, 246, 0.05) 20px
  );
  border-radius: 12px;
  padding: 8px;
}

/* Grid items */
.grid-item {
  transition: all 0.2s ease !important;
}

.grid-item.in-config-mode {
  cursor: move;
}

.grid-item.dragging {
  opacity: 0.8;
  transform: rotate(2deg) scale(1.02);
  z-index: 1000 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
}

.grid-item.resizing {
  opacity: 0.9;
  z-index: 999 !important;
}

/* Card container */
.card-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Config overlay */
.config-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.grid-item.in-config-mode .config-overlay {
  opacity: 1;
}

.grid-item.in-config-mode:hover .config-overlay {
  background: rgba(59, 130, 246, 0.15);
}

.config-handles {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
}

.drag-handle {
  background: #3b82f6;
  color: white;
  padding: 6px;
  border-radius: 6px;
  cursor: grab;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
}

.remove-btn {
  pointer-events: auto;
}

.card-info {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
}

.card-size {
  font-weight: 600;
}

/* GridCard with overlay */
:deep(.grid-card.with-overlay) {
  border: none !important;
  box-shadow: none !important;
}

/* Empty dashboard */
.empty-dashboard {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
}

.empty-content {
  text-align: center;
  color: #6b7280;
}

.empty-content i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.empty-content p {
  margin-bottom: 1.5rem;
}

/* Card selector */
.card-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.card-option:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.card-option.already-added {
  border-color: #10b981;
  background: #f0fdf4;
  cursor: default;
}

.card-option i {
  font-size: 2rem;
  color: #6b7280;
}

.card-option.already-added i {
  color: #10b981;
}

/* Resize handles styling */
:deep(.vue-resizable-handle) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.grid-item:hover .vue-resizable-handle) {
  opacity: 0.6;
}

:deep(.grid-item.in-config-mode .vue-resizable-handle) {
  opacity: 0.8;
}

:deep(.vue-resizable-handle-se) {
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 3px;
  cursor: nw-resize;
}

:deep(.vue-resizable-handle-se::after) {
  content: '';
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 8px;
  height: 8px;
  background: linear-gradient(-45deg, 
    transparent 0%, 
    transparent 40%, 
    white 40%, 
    white 50%, 
    transparent 50%, 
    transparent 60%, 
    white 60%, 
    white 70%, 
    transparent 70%
  );
}

/* Responsive */
@media (max-width: 768px) {
  .config-toggle {
    top: -50px;
  }
  
  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-actions {
    justify-content: center;
  }
  
  .card-selector-grid {
    grid-template-columns: 1fr;
  }
}

:deep(.vgl-layout) {
  width: 100% !important;
  min-width: 100% !important;
}

.dashboard-grid-container {
  width: 100%;
  min-width: 100%;
}

.full-width-grid {
  width: 100% !important;
}

</style>