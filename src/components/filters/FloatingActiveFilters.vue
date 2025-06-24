<template>
  <!-- Panel flotante de filtros activos -->
  <div 
    v-if="Object.keys(activeFilters).length > 0"
    class="floating-filters-panel fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
    :class="{ 'mobile-floating': isMobile }"
  >
    <div class="bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-slate-200 p-3 min-w-80 max-w-96 max-h-96">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-filter text-blue-600"></i>
          <h4 class="text-sm font-semibold text-slate-800">Filtros Activos</h4>
        </div>
        <div class="flex items-center gap-1">
          <span class="filter-counter text-xs text-white px-2 py-1 rounded-full">
            {{ Object.keys(activeFilters).length }}
          </span>
          <button 
            @click="$emit('clear-all')"
            class="text-xs text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            title="Limpiar todos los filtros"
          >
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
      
      <!-- Lista de filtros -->
      <div class="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
        <TransitionGroup
          name="filter-active"
          tag="div"
          class="space-y-2"
        >
          <div 
            v-for="(filter, key) in activeFilters" 
            :key="key"
            class="flex items-start justify-between bg-slate-50 p-2 rounded border-l-4 border-blue-400 hover:bg-slate-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <span class="text-xs font-medium text-slate-700 block">
                {{ getFilterLabel(key) }}
              </span>
              <span 
                class="text-xs text-slate-600 block mt-1 truncate" 
                :title="getFilterValue(filter)"
              >
                {{ getFilterValue(filter) }}
              </span>
            </div>
            <button 
              @click="$emit('clear-filter', key)"
              class="text-red-500 hover:text-red-700 ml-2 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
              title="Eliminar filtro"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </TransitionGroup>
      </div>
      
      <!-- Botones de acción -->
      <div class="flex gap-2 mt-3 pt-3 border-t border-slate-200">
        <button 
          @click="$emit('apply-filters')"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded font-medium transition-colors"
        >
          <i class="pi pi-search mr-1"></i>
          Aplicar y Buscar
        </button>
        <button 
          @click="$emit('clear-all')"
          class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs py-2 px-3 rounded font-medium transition-colors"
        >
          <i class="pi pi-refresh mr-1"></i>
          Limpiar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { TransitionGroup } from 'vue'

defineProps({
  activeFilters: {
    type: Object,
    required: true
  },
  getFilterLabel: {
    type: Function,
    required: true
  },
  getFilterValue: {
    type: Function,
    required: true
  }
})

defineEmits(['clear-filter', 'clear-all', 'apply-filters'])

// Detectar si es móvil
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
/* Panel flotante */
.floating-filters-panel {
  max-height: 80vh;
  animation: slideInRight 0.3s ease-out;
}

/* En móvil, posicionar diferente */
.mobile-floating {
  position: fixed !important;
  right: 8px !important;
  bottom: 80px !important;
  top: auto !important;
  transform: none !important;
  max-width: calc(100vw - 16px) !important;
  min-width: auto !important;
}

/* Animaciones */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%) translateY(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(-50%);
  }
}

.mobile-floating {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar personalizado */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Contador de filtros */
.filter-counter {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animaciones para filtros */
.filter-active-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.filter-active-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.filter-active-enter-active {
  transition: all 0.3s ease;
}

.filter-active-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.filter-active-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.filter-active-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  right: 0;
  left: 0;
}

/* Glassmorphism effect */
.floating-filters-panel .bg-white\/95 {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Sombra más dramática */
.floating-filters-panel {
  filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15));
}
</style>