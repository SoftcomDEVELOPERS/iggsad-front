<!-- src/components/dashboard/GridCard.vue -->
<template>
  <div 
    class="grid-card"
    :class="{ 
      'config-mode': configMode,
      'is-dragging': isDragging,
      'is-resizing': isResizing
    }"
  >
    <!-- Header de la card (solo en modo configuración) -->
    <div v-if="configMode" class="card-header">
      <div class="flex items-center justify-between p-2 bg-slate-100 border-b border-slate-200">
        <div class="flex items-center gap-2">
          <i class="pi pi-grip-horizontal text-slate-400 cursor-move drag-handle"></i>
          <span class="text-xs font-medium text-slate-600">{{ cardConfig?.title || cardId }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Button
            v-if="showConfigButton"
            icon="pi pi-cog"
            text
            size="small"
            class="w-6 h-6 text-xs"
            @click="$emit('configure-card', cardId)"
            title="Configurar card"
          />
          <Button
            icon="pi pi-times"
            text
            severity="danger"
            size="small"
            class="w-6 h-6 text-xs"
            @click="confirmRemove"
            title="Eliminar card"
          />
        </div>
      </div>
    </div>

    <!-- Contenido de la card -->
    <div 
      class="card-content"
      :class="{ 
        'with-header': configMode,
        'config-overlay': configMode && showConfigOverlay
      }"
    >
      <!-- Overlay de configuración -->
      <div v-if="configMode && showConfigOverlay" class="config-overlay-content">
        <div class="text-center p-4">
          <i class="pi pi-cog text-2xl text-slate-400 mb-2"></i>
          <p class="text-sm text-slate-600">Haz click en ⚙️ para configurar</p>
        </div>
      </div>

      <!-- Contenido real de la card -->
      <div v-else class="h-full">
        <slot />
      </div>
    </div>

    <!-- Indicadores de redimensionamiento -->
    <div v-if="configMode" class="resize-indicators">
      <div class="resize-info">
        {{ currentSize.w }} × {{ currentSize.h }}
      </div>
    </div>

    <!-- Overlay de carga -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="flex items-center justify-center h-full">
        <i class="pi pi-spinner pi-spin text-xl text-blue-600"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  cardConfig: {
    type: Object,
    default: () => ({})
  },
  configMode: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  showConfigButton: {
    type: Boolean,
    default: true
  },
  showConfigOverlay: {
    type: Boolean,
    default: false
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove-card', 'configure-card'])

// Estado local
const isDragging = ref(false)
const isResizing = ref(false)
const currentSize = ref({ w: 4, h: 4 })

// Composables
const confirm = useConfirm()

// Computed
const cardTitle = computed(() => {
  return props.cardConfig?.title || props.cardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
})

// Métodos
const confirmRemove = () => {
  confirm.require({
    message: `¿Estás seguro de que quieres eliminar la card "${cardTitle.value}"?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('remove-card', props.cardId)
    }
  })
}

const handleDragStart = () => {
  isDragging.value = true
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleResizeStart = () => {
  isResizing.value = true
}

const handleResizeEnd = () => {
  isResizing.value = false
}

const updateSize = (newSize) => {
  currentSize.value = newSize
}

// Lifecycle
onMounted(() => {
  // Escuchar eventos del grid para actualizar estados
  const gridItem = document.querySelector(`[data-grid-item="${props.cardId}"]`)
  if (gridItem) {
    // Eventos de drag
    gridItem.addEventListener('dragstart', handleDragStart)
    gridItem.addEventListener('dragend', handleDragEnd)
    
    // Eventos de resize
    gridItem.addEventListener('resizestart', handleResizeStart)
    gridItem.addEventListener('resizeend', handleResizeEnd)
  }
})

onUnmounted(() => {
  const gridItem = document.querySelector(`[data-grid-item="${props.cardId}"]`)
  if (gridItem) {
    gridItem.removeEventListener('dragstart', handleDragStart)
    gridItem.removeEventListener('dragend', handleDragEnd)
    gridItem.removeEventListener('resizestart', handleResizeStart)
    gridItem.removeEventListener('resizeend', handleResizeEnd)
  }
})

// Exponer métodos
defineExpose({
  updateSize,
  cardTitle
})
</script>

<style scoped>
.grid-card {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
}

.grid-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.grid-card.config-mode {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.grid-card.is-dragging {
  opacity: 0.8;
  transform: rotate(2deg);
  z-index: 1000;
}

.grid-card.is-resizing {
  opacity: 0.9;
  border-color: #10b981;
}

/* Header de configuración */
.card-header {
  user-select: none;
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Contenido de la card */
.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card-content.with-header {
  height: calc(100% - 40px); /* Altura del header */
}

.card-content.config-overlay {
  background: rgba(248, 250, 252, 0.9);
}

.config-overlay-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 250, 252, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Indicadores de redimensionamiento */
.resize-indicators {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 20;
  pointer-events: none;
}

.resize-info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.grid-card.is-resizing .resize-info {
  opacity: 1;
}

/* Overlay de carga */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 30;
}

/* Animaciones */
@keyframes pulse-border {
  0%, 100% {
    border-color: #3b82f6;
  }
  50% {
    border-color: #1d4ed8;
  }
}

.grid-card.config-mode {
  animation: pulse-border 2s infinite;
}

/* Estados específicos */
.grid-card.config-mode:hover {
  border-color: #1d4ed8;
  animation: none;
}

.grid-card.config-mode .card-content {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(59, 130, 246, 0.05));
}

/* Responsive */
@media (max-width: 768px) {
  .grid-card {
    border-radius: 8px;
  }
  
  .card-header {
    padding: 0.5rem;
  }
  
  .resize-info {
    font-size: 9px;
    padding: 1px 4px;
  }
}

/* Efectos de transición suaves */
.grid-card * {
  transition: inherit;
}

/* Mejoras de accesibilidad */
.grid-card:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Dark mode support (preparado para futuro) */
@media (prefers-color-scheme: dark) {
  .grid-card {
    background: #1e293b;
    border-color: #374151;
  }
  
  .card-header {
    background: #374151;
    border-color: #4b5563;
  }
  
  .config-overlay-content {
    background: rgba(30, 41, 59, 0.95);
  }
}
</style>