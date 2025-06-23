<template>
  <div>
    <!-- Dock principal -->
    <div 
      ref="dockContainer"
      class="fixed z-50" 
      :class="[
        'dock-position',
        { 'dock-hidden': isHidden },
        positionClasses
      ]"
      :style="dockStyles"
      @mouseenter="showHideButton = true"
      @mouseleave="showHideButton = false"
    >
      <div class="dock-container" :class="orientationClasses">
        <!-- Botón de ocultar -->
        <div 
          v-show="showHideButton" 
          v-tooltip="hideTooltip"
          class="hide-button"
          :class="hideButtonClasses"
          @click="toggleDock"
        >
          <i :class="hideButtonIcon" class="text-white text-sm"></i>
        </div>
        
        <!-- Botón de posición -->
        <div 
          v-show="showHideButton" 
          v-tooltip="'Cambiar posición'"
          class="position-button"
          :class="positionButtonClasses"
          @click="togglePositionSelector"
        >
          <i class="pi pi-arrows-alt text-white text-sm"></i>
        </div>
        
        <!-- Selector de posición -->
        <div 
          v-if="showPositionSelector"
          class="position-selector"
          :class="positionSelectorClasses"
          @mouseleave="closePositionSelector"
        >
          <div class="position-grid">
            <div class="position-option empty"></div>
            <div 
              class="position-option" 
              :class="{ active: edge === 'top' }"
              @click="changePosition('top')"
            >
              <i class="pi pi-angle-up"></i>
            </div>
            <div class="position-option empty"></div>
            
            <div 
              class="position-option" 
              :class="{ active: edge === 'left' }"
              @click="changePosition('left')"
            >
              <i class="pi pi-angle-left"></i>
            </div>
            <div class="position-option center">
              <i class="pi pi-desktop text-blue-400"></i>
            </div>
            <div 
              class="position-option" 
              :class="{ active: edge === 'right' }"
              @click="changePosition('right')"
            >
              <i class="pi pi-angle-right"></i>
            </div>
            
            <div class="position-option empty"></div>
            <div 
              class="position-option" 
              :class="{ active: edge === 'bottom' }"
              @click="changePosition('bottom')"
            >
              <i class="pi pi-angle-down"></i>
            </div>
            <div class="position-option empty"></div>
          </div>
        </div>
        
        <!-- Contenedor de iconos -->
        <div class="dock-items-container" :class="itemsOrientationClasses">
          <div 
            v-for="item in items" 
            :key="item.id || item.label"
            v-tooltip="item.label"
            class="dock-item-custom"
            :class="{ 'active': item.active }"
            @click="handleItemClick(item)"
          >
            <i :class="item.icon" class="dock-icon"></i>
            <div v-if="item.badge" class="dock-badge">{{ item.badge }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón para mostrar el dock cuando está oculto -->
    <div 
      v-if="isHidden"
      v-tooltip="showTooltip"
      class="show-dock-button"
      :class="showButtonClasses"
      :style="showButtonStyles"
      @click="toggleDock"
    >
      <i class="pi pi-th-large text-white text-lg"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, nextTick } from 'vue'

// Props
const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 
        item.hasOwnProperty('label') && 
        item.hasOwnProperty('icon')
      )
    }
  },
  hideTooltip: {
    type: String,
    default: 'Ocultar panel'
  },
  showTooltip: {
    type: String,
    default: 'Mostrar panel de navegación'
  },
  autoHide: {
    type: Boolean,
    default: false
  },
  autoHideDelay: {
    type: Number,
    default: 3000
  },
  initialEdge: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  }
})

// Emits
const emit = defineEmits(['item-click', 'dock-hidden', 'dock-shown', 'position-changed'])

// Estado reactivo
const isHidden = ref(false)
const showHideButton = ref(false)
const showPositionSelector = ref(false)
const dockContainer = ref(null)
const edge = ref(props.initialEdge)

let autoHideTimer = null

// Computed properties para posicionamiento
const dockStyles = computed(() => {
  const margin = 20
  const screenWidth = window.innerWidth || 1920
  const screenHeight = window.innerHeight || 1080
  
  switch (edge.value) {
    case 'top':
      return {
        top: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    case 'bottom':
      return {
        bottom: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    case 'left':
      return {
        left: `${margin}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }
    case 'right':
      return {
        right: `${margin}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }
    default:
      return {
        bottom: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
  }
})

const positionClasses = computed(() => `dock-${edge.value}`)

const orientationClasses = computed(() => {
  return edge.value === 'left' || edge.value === 'right' ? 'dock-vertical' : 'dock-horizontal'
})

const itemsOrientationClasses = computed(() => {
  return edge.value === 'left' || edge.value === 'right' ? 'flex-col' : 'flex-row'
})

const hideButtonClasses = computed(() => {
  const classes = {
    'top': 'hide-button-bottom',
    'right': 'hide-button-left', 
    'bottom': 'hide-button-top',
    'left': 'hide-button-right'
  }
  return classes[edge.value]
})

const positionButtonClasses = computed(() => {
  const classes = {
    'top': 'position-button-bottom',
    'right': 'position-button-left', 
    'bottom': 'position-button-top',
    'left': 'position-button-right'
  }
  return classes[edge.value]
})

const positionSelectorClasses = computed(() => {
  // Detectar límites de pantalla para evitar que se salga
  const screenWidth = window.innerWidth || 1920
  const screenHeight = window.innerHeight || 1080
  const selectorWidth = 114 // 90px grid + 24px padding
  const selectorHeight = 114
  const margin = 20
  
  switch (edge.value) {
    case 'top':
      // Si está muy arriba, mostrar abajo del dock
      return 'position-selector-below'
    case 'bottom':
      // Si está muy abajo, mostrar arriba del dock
      return 'position-selector-above'
    case 'left':
      // Si está muy a la izquierda, mostrar a la derecha
      return 'position-selector-right-side'
    case 'right':
      // Si está muy a la derecha, mostrar a la izquierda
      return 'position-selector-left-side'
    default:
      return 'position-selector-above'
  }
})

const hideButtonIcon = computed(() => {
  const icons = {
    'top': 'pi pi-chevron-up',
    'right': 'pi pi-chevron-right',
    'bottom': 'pi pi-chevron-down',
    'left': 'pi pi-chevron-left'
  }
  return icons[edge.value]
})

const showButtonClasses = computed(() => `show-dock-${edge.value}`)

const showButtonStyles = computed(() => {
  const margin = 12
  
  switch (edge.value) {
    case 'top':
      return {
        top: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    case 'bottom':
      return {
        bottom: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    case 'left':
      return {
        left: `${margin}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }
    case 'right':
      return {
        right: `${margin}px`,
        top: '50%',
        transform: 'translateY(-50%)'
      }
    default:
      return {
        bottom: `${margin}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
  }
})

// Métodos
const toggleDock = () => {
  isHidden.value = !isHidden.value
  showHideButton.value = false
  showPositionSelector.value = false
  
  if (isHidden.value) {
    emit('dock-hidden')
  } else {
    emit('dock-shown')
  }
  
  if (props.autoHide && !isHidden.value) {
    startAutoHideTimer()
  }
}

const togglePositionSelector = () => {
  showPositionSelector.value = !showPositionSelector.value
}

const closePositionSelector = () => {
  setTimeout(() => {
    showPositionSelector.value = false
  }, 200)
}

const changePosition = (newEdge) => {
  if (newEdge !== edge.value) {
    edge.value = newEdge
    showPositionSelector.value = false
    
    nextTick(() => {
      emit('position-changed', { edge: edge.value })
    })
  }
}

const handleItemClick = (item) => {
  emit('item-click', item)
  
  if (item.command && typeof item.command === 'function') {
    item.command()
  }
  
  if (props.autoHide) {
    startAutoHideTimer()
  }
}

const startAutoHideTimer = () => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
  }
  
  autoHideTimer = setTimeout(() => {
    if (!isHidden.value) {
      toggleDock()
    }
  }, props.autoHideDelay)
}

const clearAutoHideTimer = () => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }
}

// Lifecycle
onMounted(() => {
  if (props.autoHide) {
    startAutoHideTimer()
  }
})

// Exponer métodos públicos
defineExpose({
  show: () => {
    if (isHidden.value) toggleDock()
  },
  hide: () => {
    if (!isHidden.value) toggleDock()
  },
  toggle: toggleDock,
  isVisible: () => !isHidden.value,
  setPosition: (newEdge) => {
    if (['top', 'right', 'bottom', 'left'].includes(newEdge)) {
      changePosition(newEdge)
    }
  }
})
</script>

<style scoped>
/* Contenedor base del dock */
.dock-container {
  position: relative;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.2);
  min-width: 320px;
  transition: all 0.3s ease;
}

/* Orientaciones del dock */
.dock-vertical {
  min-width: 80px;
  min-height: 320px;
  padding: 20px 16px;
}

.dock-horizontal {
  min-width: 320px;
  min-height: 80px;
  padding: 16px 20px;
}

/* Gradiente superior */
.dock-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.dock-vertical::before {
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  height: auto;
  background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

/* Botones base */
.hide-button,
.position-button {
  position: absolute;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid rgba(59, 130, 246, 0.3);
  z-index: 10;
}

.position-button {
  background: linear-gradient(135deg, #10b981, #059669);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.hide-button i,
.position-button i {
  font-size: 16px;
}

/* Posiciones de botones para cada borde */
.hide-button-top,
.position-button-top {
  top: -16px;
}

.hide-button-top {
  left: 50%;
  transform: translateX(-50%);
}

.position-button-top {
  left: 50%;
  transform: translateX(-180%);
}

.hide-button-bottom,
.position-button-bottom {
  bottom: -16px;
}

.hide-button-bottom {
  left: 50%;
  transform: translateX(-50%);
}

.position-button-bottom {
  left: 50%;
  transform: translateX(-180%);
}

.hide-button-left,
.position-button-left {
  left: -16px;
}

.hide-button-left {
  top: 50%;
  transform: translateY(-50%);
}

.position-button-left {
  top: 50%;
  transform: translateY(-180%);
}

.hide-button-right,
.position-button-right {
  right: -16px;
}

.hide-button-right {
  top: 50%;
  transform: translateY(-50%);
}

.position-button-right {
  top: 50%;
  transform: translateY(-180%);
}

.hide-button:hover,
.position-button:hover {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 6px 8px -1px rgba(0, 0, 0, 0.15);
}

.position-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.hide-button-left:hover,
.position-button-left:hover,
.hide-button-right:hover,
.position-button-right:hover {
  transform: translateY(-50%) scale(1.1);
}

.position-button-top:hover {
  transform: translateX(-180%) scale(1.1);
}

.position-button-bottom:hover {
  transform: translateX(-180%) scale(1.1);
}

.position-button-left:hover {
  transform: translateY(-180%) scale(1.1);
}

.position-button-right:hover {
  transform: translateY(-180%) scale(1.1);
}

/* Selector de posición */
.position-selector {
  position: absolute;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.3);
  z-index: 20;
}

/* Posiciones inteligentes del selector */
.position-selector-above {
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.position-selector-below {
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.position-selector-left-side {
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
}

.position-selector-right-side {
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  width: 90px;
  height: 90px;
}

.position-option {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #94a3b8;
}

.position-option:not(.empty):not(.center) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.position-option:not(.empty):not(.center):hover {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.position-option.active {
  background: rgba(59, 130, 246, 0.3) !important;
  color: #60a5fa !important;
  border-color: rgba(59, 130, 246, 0.6) !important;
  transform: scale(1.05);
}

.position-option.center {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.3);
  cursor: default;
  font-size: 12px;
}

.position-option.empty {
  background: none;
  border: none;
  cursor: default;
}

/* Contenedor de items */
.dock-items-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dock-items-container.flex-col {
  flex-direction: column;
}

.dock-items-container.flex-row {
  flex-direction: row;
}

/* Items del dock */
.dock-item-custom {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(226, 232, 240, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.dock-item-custom::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.3s ease;
}

.dock-item-custom:hover::before {
  left: 100%;
}

.dock-item-custom:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}

.dock-item-custom.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.dock-item-custom:active {
  transform: translateY(-1px) scale(1.02);
}

.dock-icon {
  font-size: 20px;
  color: #374151;
  transition: color 0.2s ease;
  z-index: 1;
  position: relative;
}

.dock-item-custom:hover .dock-icon,
.dock-item-custom.active .dock-icon {
  color: #2563eb;
}

.dock-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(15, 23, 42, 0.85);
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Botones de mostrar según posición */
.show-dock-button {
  position: fixed;
  z-index: 50;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}

.show-dock-button:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: scale(1.1);
  box-shadow: 0 15px 20px -3px rgba(0, 0, 0, 0.15);
}

/* Animaciones para mostrar/ocultar */
.dock-hidden {
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-bottom.dock-hidden {
  transform: translateX(-50%) translateY(100%);
}

.dock-top.dock-hidden {
  transform: translateX(-50%) translateY(-100%);
}

.dock-left.dock-hidden {
  transform: translateY(-50%) translateX(-100%);
}

.dock-right.dock-hidden {
  transform: translateY(-50%) translateX(100%);
}

/* Animación de entrada */
.dock-container {
  animation: dockSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes dockSlideUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .dock-horizontal {
    min-width: 280px;
    padding: 12px 16px;
  }
  
  .dock-vertical {
    min-width: 60px;
    min-height: 280px;
    padding: 16px 12px;
  }
  
  .dock-items-container {
    gap: 6px;
  }
  
  .dock-item-custom {
    width: 44px;
    height: 44px;
  }
  
  .dock-icon {
    font-size: 18px;
  }
}
</style>