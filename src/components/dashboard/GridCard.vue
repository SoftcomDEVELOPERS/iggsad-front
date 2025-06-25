<!-- src/components/dashboard/GridCard.vue - VERSIÓN SIMPLIFICADA -->
<template>
  <div 
    class="grid-card"
    :class="{ 
      'config-mode': configMode,
      'with-overlay': configMode
    }"
  >
    <!-- Contenido de la card -->
    <div class="card-content">
      <slot />
    </div>
    
    <!-- Indicador de resize (solo visible en hover cuando está en config mode) -->
    <div v-if="configMode" class="resize-indicator">
      <i class="pi pi-expand"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

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
  }
})

const emit = defineEmits([
  'remove-card',
  'configure-card'
])

// Estado reactivo
const isHovered = ref(false)

// Computed
const cardTitle = computed(() => {
  const cardTitles = {
    'stats-dashboard': 'Estadísticas del Dashboard',
    'recent-searches': 'Búsquedas Recientes',
    'notifications': 'Notificaciones',
    'chat': 'Chat y Mensajes',
    'quick-actions': 'Acciones Rápidas'
  }
  return cardTitles[props.cardId] || props.cardId
})

// Eventos del mouse
const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}

// Lifecycle
onMounted(() => {
  // Si necesitas hacer algo específico cuando se monta la card
})

onUnmounted(() => {
  // Cleanup si es necesario
})

// Exponer propiedades útiles
defineExpose({
  cardTitle,
  isHovered
})
</script>

<style scoped>
.grid-card {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease;
}

.grid-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Estado en modo configuración */
.grid-card.config-mode {
  cursor: move;
}

.grid-card.with-overlay {
  /* El overlay se maneja desde el componente padre */
  border: none;
  box-shadow: none;
}

/* Contenido de la card */
.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

/* Indicador de resize */
.resize-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 4px;
  border-radius: 4px;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 2;
}

.grid-card.config-mode:hover .resize-indicator {
  opacity: 1;
}

/* Estilos para diferentes tamaños de card */
.grid-card.small {
  min-height: 120px;
}

.grid-card.medium {
  min-height: 200px;
}

.grid-card.large {
  min-height: 300px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-card {
    border-radius: 8px;
  }
  
  .resize-indicator {
    font-size: 8px;
    padding: 2px;
  }
}

/* Estados especiales */
.grid-card.is-dragging {
  cursor: grabbing;
  opacity: 0.8;
  transform: scale(1.02);
  z-index: 1000;
}

.grid-card.is-resizing {
  opacity: 0.9;
  border: 2px solid #10b981;
}

/* Animaciones sutiles */
@keyframes cardPulse {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.01); 
  }
}

.grid-card.config-mode:hover {
  animation: cardPulse 2s infinite;
}

/* Para contenido que se desborda */
.card-content > * {
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
}

/* Scroll personalizado si es necesario */
.card-content::-webkit-scrollbar {
  width: 4px;
}

.card-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.card-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.card-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Efectos de entrada */
.grid-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estados de focus para accesibilidad */
.grid-card:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Mejoras para dark mode (si lo implementas más tarde) */
@media (prefers-color-scheme: dark) {
  .grid-card {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .resize-indicator {
    background: rgba(59, 130, 246, 0.2);
  }
}
</style>