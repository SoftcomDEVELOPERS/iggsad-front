<!-- src/components/dashboard/cards/RecentSearchesCard.vue -->
<template>
  <div class="recent-searches-card h-full flex flex-col">
    <!-- Header -->
    <div class="card-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center">
          <i class="pi pi-search mr-2"></i>
          {{ config?.title || 'Búsquedas Recientes' }}
        </h3>
        <div class="flex items-center gap-2">
          <Badge 
            v-if="searches.length > 0" 
            :value="searches.length" 
            class="ml-2" 
          />
          <Button 
            v-if="!configMode && searches.length > 0"
            icon="pi pi-trash" 
            text 
            size="small"
            severity="secondary"
            @click="clearSearchHistory"
            title="Limpiar historial"
          />
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-content flex-1 p-4 overflow-hidden">
      <!-- Lista de búsquedas -->
      <div v-if="searches.length > 0" class="searches-list h-full overflow-y-auto">
        <div class="space-y-2">
          <div 
            v-for="search in visibleSearches" 
            :key="search.id"
            class="search-item flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-sm"
            :class="{ 'pointer-events-none opacity-60': configMode }"
            @click="!configMode && selectRecentSearch(search)"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <div class="search-icon flex-shrink-0">
                <i class="pi pi-file-o text-blue-600"></i>
              </div>
              <div class="search-info flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-blue-600 font-medium">{{ search.expediente }}</span>
                  <span class="text-xs text-slate-500">{{ search.fecha }}</span>
                </div>
                <span class="text-slate-700 truncate block">{{ search.cliente }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-3 flex-shrink-0">
              <span class="text-green-600 font-medium">{{ search.deuda }}</span>
              <Button 
                v-if="!configMode"
                icon="pi pi-times" 
                text 
                size="small"
                @click.stop="removeRecentSearch(search.id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        <!-- Mostrar más -->
        <div v-if="searches.length > maxVisibleItems" class="mt-3 text-center">
          <Button 
            :label="`Ver ${searches.length - maxVisibleItems} más`"
            text 
            size="small"
            @click="showAll = !showAll"
            :disabled="configMode"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state h-full flex flex-col items-center justify-center text-center py-8">
        <i class="pi pi-search text-4xl text-slate-300 mb-4"></i>
        <h4 class="text-lg font-medium text-slate-600 mb-2">No hay búsquedas recientes</h4>
        <p class="text-sm text-slate-500 mb-4">
          Tus últimas búsquedas aparecerán aquí para acceso rápido
        </p>
        <Button 
          v-if="!configMode"
          icon="pi pi-search" 
          label="Realizar Búsqueda"
          outlined
          size="small"
          @click="$emit('start-search')"
        />
      </div>
    </div>

    <!-- Footer con estadísticas (opcional) -->
    <div v-if="config?.showStats && searches.length > 0" class="card-footer p-3 border-t border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between text-xs text-slate-600">
        <span>Total búsquedas: {{ searches.length }}</span>
        <span>Última: {{ getLastSearchTime() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      title: 'Búsquedas Recientes',
      maxItems: 5,
      showActions: true,
      showStats: false
    })
  },
  data: {
    type: Object,
    default: () => ({
      searches: []
    })
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-config', 'select-search', 'remove-search', 'clear-history', 'start-search'])

// Estado local
const showAll = ref(false)

// Composables
const confirm = useConfirm()

// Computed
const searches = computed(() => {
  // Si no hay datos del prop, usar datos mock para desarrollo
  if (props.data.searches && props.data.searches.length > 0) {
    return props.data.searches
  }
  
  // Datos mock para desarrollo
  return [
    { 
      id: 1, 
      expediente: 'EXP-2024-001', 
      cliente: 'García López, María Carmen',
      deuda: '€25,450',
      fecha: 'Hace 2h'
    },
    { 
      id: 2, 
      expediente: 'EXP-2024-045', 
      cliente: 'Empresas del Norte S.L.',
      deuda: '€87,230',
      fecha: 'Hace 4h'
    },
    { 
      id: 3, 
      expediente: 'EXP-2024-023', 
      cliente: 'Martín Rodríguez, Juan Antonio',
      deuda: '€12,800',
      fecha: 'Ayer'
    },
    { 
      id: 4, 
      expediente: 'EXP-2024-078', 
      cliente: 'Construcciones Beta S.A.',
      deuda: '€156,900',
      fecha: 'Hace 2 días'
    },
    { 
      id: 5, 
      expediente: 'EXP-2024-012', 
      cliente: 'Fernández Silva, Ana',
      deuda: '€8,750',
      fecha: 'Hace 3 días'
    }
  ]
})

const maxVisibleItems = computed(() => props.config?.maxItems || 5)

const visibleSearches = computed(() => {
  if (showAll.value) {
    return searches.value
  }
  return searches.value.slice(0, maxVisibleItems.value)
})

// Métodos
const selectRecentSearch = (search) => {
  if (!props.configMode) {
    emit('select-search', search)
  }
}

const removeRecentSearch = (searchId) => {
  if (!props.configMode) {
    emit('remove-search', searchId)
  }
}

const clearSearchHistory = () => {
  if (props.configMode) return
  
  confirm.require({
    message: '¿Estás seguro de que quieres eliminar todo el historial de búsquedas?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar Todo',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('clear-history')
    }
  })
}

const getLastSearchTime = () => {
  if (searches.value.length === 0) return 'Nunca'
  return searches.value[0]?.fecha || 'Desconocido'
}
</script>

<style scoped>
.recent-searches-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.card-content {
  background: white;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
}

/* Lista de búsquedas */
.searches-list {
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.searches-list::-webkit-scrollbar {
  width: 4px;
}

.searches-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.searches-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.searches-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Search items */
.search-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.search-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-icon {
  width: 32px;
  height: 32px;
  background: #dbeafe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-info {
  line-height: 1.4;
}

/* Estado vacío */
.empty-state {
  min-height: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .search-item {
    padding: 0.75rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .search-item .flex {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .search-info {
    text-align: center;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .card-content {
    padding: 0.75rem;
  }
}

/* Animaciones */
.search-item {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Estados especiales */
.search-item.active {
  background: #dbeafe;
  border-color: #3b82f6;
}

.search-item:active {
  transform: scale(0.98);
}

/* Modo configuración */
.config-mode .search-item {
  cursor: not-allowed;
}

.config-mode .empty-state {
  opacity: 0.6;
}
</style>