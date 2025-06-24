<!-- src/components/dashboard/cards/StatsDashboard.vue -->
<template>
  <div class="stats-dashboard h-full flex flex-col">
    <!-- Header con configuración -->
    <div v-if="showHeader" class="stats-header p-3 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-800">{{ config?.title || 'Estadísticas' }}</h3>
        <Button
          v-if="configMode"
          icon="pi pi-cog"
          text
          size="small"
          @click="showConfigPanel = true"
          title="Configurar estadísticas"
        />
      </div>
    </div>

    <!-- Panel de configuración (solo en modo config) -->
    <div v-if="configMode && showConfigPanel" class="config-panel p-4 bg-blue-50 border-b border-blue-200">
      <h4 class="text-sm font-medium text-blue-800 mb-3">Configurar Estadísticas</h4>
      
      <!-- Selector de estadísticas -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <label 
          v-for="stat in availableStats" 
          :key="stat.id" 
          class="flex items-center text-xs cursor-pointer hover:bg-blue-100 p-2 rounded"
        >
          <Checkbox 
            v-model="localSelectedStats"
            :value="stat.id"
            class="mr-2"
          />
          <div class="flex items-center gap-2">
            <i :class="stat.icon" :style="{ color: stat.color }"></i>
            <span>{{ stat.label }}</span>
          </div>
        </label>
      </div>

      <!-- Layout del grid -->
      <div class="mb-3">
        <label class="block text-xs font-medium text-blue-800 mb-2">Disposición:</label>
        <div class="flex gap-2">
          <Button
            v-for="layout in layoutOptions"
            :key="layout.value"
            :label="layout.label"
            size="small"
            :outlined="localGridLayout !== layout.value"
            @click="localGridLayout = layout.value"
            class="text-xs"
          />
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex gap-2">
        <Button 
          label="Aplicar" 
          size="small"
          @click="applyConfig"
        />
        <Button 
          label="Cancelar" 
          size="small"
          outlined
          @click="cancelConfig"
        />
      </div>
    </div>

    <!-- Grid de estadísticas -->
    <div class="stats-grid flex-1 p-4">
      <div :class="getGridClasses()">
        <StatCard
          v-for="statId in selectedStats"
          :key="statId"
          :stat="getStatData(statId)"
          :compact="isCompactMode"
          :config-mode="configMode"
        />
      </div>

      <!-- Estado vacío -->
      <div v-if="selectedStats.length === 0" class="empty-stats text-center py-8">
        <i class="pi pi-chart-bar text-3xl text-slate-300 mb-3"></i>
        <p class="text-sm text-slate-500 mb-3">No hay estadísticas seleccionadas</p>
        <Button
          v-if="configMode"
          label="Configurar"
          size="small"
          @click="showConfigPanel = true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import StatCard from './StatCard.vue'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      title: 'Estadísticas',
      selectedStats: ['casos-activos', 'audiencias-proximas', 'casos-urgentes', 'total-clientes'],
      gridLayout: 'auto',
      showHeader: true
    })
  },
  data: {
    type: Object,
    default: () => ({})
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-config'])

// Estado local
const showConfigPanel = ref(false)
const localSelectedStats = ref([...props.config.selectedStats])
const localGridLayout = ref(props.config.gridLayout || 'auto')

// Computed
const selectedStats = computed(() => props.config.selectedStats || [])
const showHeader = computed(() => props.config.showHeader !== false)
const isCompactMode = computed(() => selectedStats.value.length > 4)

// Estadísticas disponibles
const availableStats = [
  {
    id: 'casos-activos',
    label: 'Casos Activos',
    icon: 'pi pi-folder',
    color: '#3b82f6'
  },
  {
    id: 'audiencias-proximas',
    label: 'Audiencias Próximas',
    icon: 'pi pi-calendar',
    color: '#10b981'
  },
  {
    id: 'casos-urgentes',
    label: 'Casos Urgentes',
    icon: 'pi pi-exclamation-triangle',
    color: '#f59e0b'
  },
  {
    id: 'total-clientes',
    label: 'Total Clientes',
    icon: 'pi pi-users',
    color: '#8b5cf6'
  },
  {
    id: 'documentos-pendientes',
    label: 'Documentos Pendientes',
    icon: 'pi pi-file',
    color: '#ef4444'
  },
  {
    id: 'ingresos-mes',
    label: 'Ingresos del Mes',
    icon: 'pi pi-euro',
    color: '#059669'
  }
]

// Opciones de layout
const layoutOptions = [
  { value: 'auto', label: 'Auto' },
  { value: '2x2', label: '2×2' },
  { value: '1x4', label: '1×4' },
  { value: '4x1', label: '4×1' }
]

// Métodos
const getStatData = (statId) => {
  // Datos mock - aquí conectarías con tu store real
  const statsData = {
    'casos-activos': { value: 147, label: 'Casos Activos', trend: '+12%', color: '#3b82f6' },
    'audiencias-proximas': { value: 12, label: 'Audiencias Próximas', trend: '+3', color: '#10b981' },
    'casos-urgentes': { value: 5, label: 'Casos Urgentes', trend: '-2', color: '#f59e0b' },
    'total-clientes': { value: 89, label: 'Total Clientes', trend: '+5', color: '#8b5cf6' },
    'documentos-pendientes': { value: 23, label: 'Documentos Pendientes', trend: '-8', color: '#ef4444' },
    'ingresos-mes': { value: '€45.2K', label: 'Ingresos del Mes', trend: '+15%', color: '#059669' }
  }
  
  return {
    ...statsData[statId],
    icon: availableStats.find(s => s.id === statId)?.icon || 'pi pi-chart-bar'
  }
}

const getGridClasses = () => {
  const count = selectedStats.value.length
  
  switch (localGridLayout.value) {
    case '2x2':
      return 'grid grid-cols-2 gap-4 h-full'
    case '1x4':
      return 'grid grid-cols-1 gap-2 h-full'
    case '4x1':
      return 'grid grid-cols-4 gap-2 h-full'
    default: // auto
      if (count <= 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4 h-full'
      if (count <= 4) return 'grid grid-cols-2 gap-3 h-full'
      return 'grid grid-cols-2 lg:grid-cols-3 gap-2 h-full'
  }
}

const applyConfig = () => {
  const newConfig = {
    ...props.config,
    selectedStats: [...localSelectedStats.value],
    gridLayout: localGridLayout.value
  }
  
  emit('update-config', props.cardId, newConfig)
  showConfigPanel.value = false
}

const cancelConfig = () => {
  localSelectedStats.value = [...props.config.selectedStats]
  localGridLayout.value = props.config.gridLayout || 'auto'
  showConfigPanel.value = false
}

// Watchers
watch(() => props.configMode, (newValue) => {
  if (!newValue) {
    showConfigPanel.value = false
  }
})

watch(() => props.config.selectedStats, (newStats) => {
  localSelectedStats.value = [...newStats]
}, { deep: true })
</script>

<style scoped>
.stats-dashboard {
  background: transparent;
}

.stats-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.config-panel {
  border-radius: 6px;
  margin: 0.5rem;
}

.stats-grid {
  overflow: hidden;
}

.empty-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .config-panel {
    margin: 0.25rem;
    padding: 0.75rem;
  }
  
  .config-panel .grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    padding: 0.75rem;
  }
}

/* Animaciones suaves */
.stats-grid > div {
  transition: all 0.3s ease;
}

/* Hover effects en modo configuración */
.config-mode .stats-grid {
  opacity: 0.8;
}

.config-mode .config-panel {
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}
</style>