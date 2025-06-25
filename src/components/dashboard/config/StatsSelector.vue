<!-- src/components/dashboard/config/StatsSelector.vue -->
<template>
  <div class="stats-selector">
    <!-- Header -->
    <div class="stats-selector-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800">
          <i class="pi pi-chart-bar mr-2"></i>
          Configurar Estadísticas
        </h3>
        <Button
          icon="pi pi-times"
          text
          size="small"
          @click="$emit('close')"
          title="Cerrar configurador"
        />
      </div>
      <p class="text-sm text-slate-600 mt-2">
        Selecciona qué estadísticas mostrar y cómo organizarlas en el dashboard
      </p>
    </div>

    <!-- Configuración del layout -->
    <div class="stats-layout-config p-4 border-b border-slate-200 bg-slate-50">
      <h4 class="text-sm font-semibold text-slate-700 mb-3">Disposición del Grid</h4>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="layout in layoutOptions"
          :key="layout.value"
          class="layout-option p-3 border rounded-lg cursor-pointer transition-all"
          :class="{
            'border-blue-500 bg-blue-50': selectedLayout === layout.value,
            'border-slate-200 bg-white hover:border-slate-300': selectedLayout !== layout.value
          }"
          @click="selectedLayout = layout.value"
        >
          <div class="layout-preview mb-2">
            <div 
              class="grid gap-1 h-8"
              :class="layout.previewClass"
            >
              <div 
                v-for="n in layout.previewItems" 
                :key="n" 
                class="bg-blue-200 rounded-sm"
              ></div>
            </div>
          </div>
          <div class="text-xs text-center font-medium">{{ layout.label }}</div>
          <div class="text-xs text-center text-slate-500">{{ layout.description }}</div>
        </div>
      </div>
    </div>

    <!-- Selector de estadísticas -->
    <div class="stats-selection p-4">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-semibold text-slate-700">Estadísticas Disponibles</h4>
        <div class="flex gap-2">
          <Button
            label="Seleccionar todas"
            text
            size="small"
            @click="selectAll"
          />
          <Button
            label="Limpiar selección"
            text
            size="small"
            @click="clearSelection"
          />
        </div>
      </div>

      <!-- Lista de estadísticas -->
      <div class="stats-list space-y-3 max-h-60 overflow-y-auto">
        <div
          v-for="stat in availableStats"
          :key="stat.id"
          class="stat-item p-3 border border-slate-200 rounded-lg"
          :class="{
            'border-blue-300 bg-blue-50': selectedStats.includes(stat.id),
            'bg-white': !selectedStats.includes(stat.id)
          }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="selectedStats"
                :value="stat.id"
                class="flex-shrink-0"
              />
              
              <div class="stat-info">
                <div class="flex items-center gap-2 mb-1">
                  <i 
                    :class="stat.icon" 
                    :style="{ color: stat.color }"
                    class="text-lg"
                  ></i>
                  <span class="font-medium text-sm">{{ stat.title }}</span>
                  <Badge
                    v-if="stat.priority === 'high'"
                    value="Importante"
                    severity="warning"
                    size="small"
                  />
                </div>
                <p class="text-xs text-slate-600">{{ stat.description }}</p>
                <div v-if="stat.tags" class="flex gap-1 mt-2">
                  <Tag
                    v-for="tag in stat.tags.slice(0, 3)"
                    :key="tag"
                    :value="tag"
                    severity="info"
                    size="small"
                    class="text-xs"
                  />
                </div>
              </div>
            </div>

            <!-- Preview del valor -->
            <div class="stat-preview text-right">
              <div class="text-lg font-bold" :style="{ color: stat.color }">
                {{ formatStatValue(stat.sampleValue, stat.format) }}
              </div>
              <div class="text-xs text-slate-500">{{ stat.unit || '' }}</div>
            </div>
          </div>

          <!-- Configuraciones específicas -->
          <div v-if="selectedStats.includes(stat.id) && stat.options" class="stat-options mt-3 pt-3 border-t border-slate-200">
            <h5 class="text-xs font-medium text-slate-600 mb-2">Opciones de {{ stat.title }}:</h5>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="option in stat.options" :key="option.key" class="flex items-center gap-2">
                <Checkbox
                  v-model="statConfigs[stat.id]"
                  :value="option.key"
                  class="text-xs"
                />
                <label class="text-xs">{{ option.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista previa -->
    <div v-if="selectedStats.length > 0" class="stats-preview p-4 border-t border-slate-200 bg-slate-50">
      <h4 class="text-sm font-semibold text-slate-700 mb-3">Vista Previa</h4>
      
      <div 
        class="preview-grid gap-2 p-3 bg-white rounded-lg border border-slate-200"
        :class="getPreviewGridClass()"
      >
        <div
          v-for="statId in selectedStats"
          :key="statId"
          class="preview-stat p-2 bg-slate-50 rounded border text-center"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <i 
              :class="getStatById(statId)?.icon" 
              :style="{ color: getStatById(statId)?.color }"
              class="text-sm"
            ></i>
            <span class="text-xs font-medium">{{ getStatById(statId)?.title }}</span>
          </div>
          <div class="text-sm font-bold" :style="{ color: getStatById(statId)?.color }">
            {{ formatStatValue(getStatById(statId)?.sampleValue, getStatById(statId)?.format) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con acciones -->
    <div class="stats-selector-footer p-4 border-t border-slate-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-slate-600">
          {{ selectedStats.length }} de {{ availableStats.length }} estadísticas seleccionadas
        </div>
        
        <div class="flex gap-2">
          <Button
            label="Cancelar"
            outlined
            @click="handleCancel"
          />
          <Button
            label="Aplicar"
            :disabled="selectedStats.length === 0"
            @click="handleApply"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Badge from 'primevue/badge'
import Tag from 'primevue/tag'

const props = defineProps({
  currentSelectedStats: {
    type: Array,
    default: () => []
  },
  currentLayout: {
    type: String,
    default: 'auto'
  },
  currentStatConfigs: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'apply', 'cancel'])

// Estado reactivo
const selectedStats = ref([...props.currentSelectedStats])
const selectedLayout = ref(props.currentLayout)
const statConfigs = ref({ ...props.currentStatConfigs })

// Opciones de layout disponibles
const layoutOptions = ref([
  {
    value: 'auto',
    label: 'Automático',
    description: 'Adapta según cantidad',
    previewClass: 'grid-cols-2',
    previewItems: 4
  },
  {
    value: '2x2',
    label: '2x2',
    description: 'Grid cuadrado',
    previewClass: 'grid-cols-2',
    previewItems: 4
  },
  {
    value: '1x4',
    label: '1x4',
    description: 'Columna vertical',
    previewClass: 'grid-cols-1',
    previewItems: 4
  },
  {
    value: '4x1',
    label: '4x1',
    description: 'Fila horizontal',
    previewClass: 'grid-cols-4',
    previewItems: 4
  }
])

// Estadísticas disponibles (normalmente vendrían del store)
const availableStats = ref([
  {
    id: 'casos-activos',
    title: 'Casos Activos',
    description: 'Número total de casos en proceso actualmente',
    icon: 'pi pi-folder-open',
    color: '#3b82f6',
    sampleValue: 147,
    format: 'number',
    unit: 'casos',
    priority: 'high',
    tags: ['Principal', 'Tiempo real'],
    options: [
      { key: 'show-progress', label: 'Mostrar progreso' },
      { key: 'show-trend', label: 'Mostrar tendencia' }
    ]
  },
  {
    id: 'audiencias-proximas',
    title: 'Audiencias Próximas',
    description: 'Audiencias programadas para los próximos 7 días',
    icon: 'pi pi-calendar',
    color: '#f59e0b',
    sampleValue: 12,
    format: 'number',
    unit: 'audiencias',
    priority: 'high',
    tags: ['Calendario', 'Próximas'],
    options: [
      { key: 'show-dates', label: 'Mostrar fechas' },
      { key: 'show-time', label: 'Mostrar hora' }
    ]
  },
  {
    id: 'casos-urgentes',
    title: 'Casos Urgentes',
    description: 'Casos marcados como urgentes o de alta prioridad',
    icon: 'pi pi-exclamation-triangle',
    color: '#ef4444',
    sampleValue: 8,
    format: 'number',
    unit: 'casos',
    priority: 'high',
    tags: ['Urgente', 'Prioritario'],
    options: [
      { key: 'show-deadline', label: 'Mostrar vencimiento' },
      { key: 'alert-sound', label: 'Alerta sonora' }
    ]
  },
  {
    id: 'total-clientes',
    title: 'Total Clientes',
    description: 'Número total de clientes registrados',
    icon: 'pi pi-users',
    color: '#10b981',
    sampleValue: 2847,
    format: 'number',
    unit: 'clientes',
    priority: 'medium',
    tags: ['General', 'Acumulado'],
    options: [
      { key: 'show-active', label: 'Solo activos' },
      { key: 'show-growth', label: 'Mostrar crecimiento' }
    ]
  },
  {
    id: 'documentos-pendientes',
    title: 'Documentos Pendientes',
    description: 'Documentos que requieren revisión o firma',
    icon: 'pi pi-file-edit',
    color: '#8b5cf6',
    sampleValue: 23,
    format: 'number',
    unit: 'documentos',
    priority: 'medium',
    tags: ['Documentos', 'Pendiente'],
    options: [
      { key: 'show-type', label: 'Mostrar tipo' },
      { key: 'show-priority', label: 'Mostrar prioridad' }
    ]
  },
  {
    id: 'ingresos-mes',
    title: 'Ingresos del Mes',
    description: 'Total de ingresos generados en el mes actual',
    icon: 'pi pi-dollar',
    color: '#059669',
    sampleValue: 125000,
    format: 'currency',
    unit: '€',
    priority: 'high',
    tags: ['Financiero', 'Mensual'],
    options: [
      { key: 'show-comparison', label: 'Comparar mes anterior' },
      { key: 'show-projection', label: 'Proyección fin de mes' }
    ]
  },
  {
    id: 'tareas-completadas',
    title: 'Tareas Completadas',
    description: 'Porcentaje de tareas completadas hoy',
    icon: 'pi pi-check-circle',
    color: '#06b6d4',
    sampleValue: 78,
    format: 'percentage',
    unit: '%',
    priority: 'medium',
    tags: ['Productividad', 'Diario'],
    options: [
      { key: 'show-details', label: 'Mostrar detalles' },
      { key: 'show-team', label: 'Ver por equipo' }
    ]
  },
  {
    id: 'tiempo-respuesta',
    title: 'Tiempo de Respuesta',
    description: 'Tiempo promedio de respuesta a consultas',
    icon: 'pi pi-clock',
    color: '#f97316',
    sampleValue: 2.5,
    format: 'decimal',
    unit: 'horas',
    priority: 'low',
    tags: ['Servicio', 'Promedio'],
    options: [
      { key: 'show-benchmark', label: 'Mostrar objetivo' },
      { key: 'show-trend', label: 'Tendencia semanal' }
    ]
  }
])

// Computed
const getPreviewGridClass = () => {
  const count = selectedStats.value.length
  
  switch (selectedLayout.value) {
    case '2x2':
      return 'grid grid-cols-2'
    case '1x4':
      return 'grid grid-cols-1'
    case '4x1':
      return 'grid grid-cols-4'
    default: // auto
      if (count <= 2) return 'grid grid-cols-1 md:grid-cols-2'
      if (count <= 4) return 'grid grid-cols-2'
      return 'grid grid-cols-2 lg:grid-cols-3'
  }
}

// Métodos
const getStatById = (statId) => {
  return availableStats.value.find(stat => stat.id === statId)
}

const formatStatValue = (value, format) => {
  if (!value && value !== 0) return '--'
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
      }).format(value)
    case 'percentage':
      return `${value}%`
    case 'decimal':
      return value.toFixed(1)
    case 'number':
    default:
      return new Intl.NumberFormat('es-ES').format(value)
  }
}

const selectAll = () => {
  selectedStats.value = [...availableStats.value.map(stat => stat.id)]
}

const clearSelection = () => {
  selectedStats.value = []
}

const handleApply = () => {
  const config = {
    selectedStats: [...selectedStats.value],
    gridLayout: selectedLayout.value,
    statConfigs: { ...statConfigs.value }
  }
  
  emit('apply', config)
}

const handleCancel = () => {
  // Restaurar valores originales
  selectedStats.value = [...props.currentSelectedStats]
  selectedLayout.value = props.currentLayout
  statConfigs.value = { ...props.currentStatConfigs }
  
  emit('cancel')
}

// Watchers
watch(selectedStats, (newStats) => {
  // Limpiar configuraciones de stats que ya no están seleccionadas
  Object.keys(statConfigs.value).forEach(statId => {
    if (!newStats.includes(statId)) {
      delete statConfigs.value[statId]
    }
  })
  
  // Inicializar configuraciones para nuevas stats
  newStats.forEach(statId => {
    if (!statConfigs.value[statId]) {
      statConfigs.value[statId] = []
    }
  })
}, { deep: true })

// Lifecycle
onMounted(() => {
  console.log('StatsSelector montado con', selectedStats.value.length, 'estadísticas seleccionadas')
})
</script>

<style scoped>
.stats-selector {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.stats-selector-header {
  flex-shrink: 0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.stats-layout-config {
  flex-shrink: 0;
}

.stats-selection {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.stats-list {
  flex: 1;
  overflow-y: auto;
}

.stats-preview {
  flex-shrink: 0;
  max-height: 200px;
  overflow-y: auto;
}

.stats-selector-footer {
  flex-shrink: 0;
}

/* Layout options */
.layout-option {
  transition: all 0.2s ease;
}

.layout-option:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.layout-preview {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Stat items */
.stat-item {
  transition: all 0.2s ease;
}

.stat-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-preview {
  min-width: 80px;
}

.preview-stat {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-stat:hover {
  background: #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-selector {
    max-width: 95vw;
    max-height: 90vh;
  }
  
  .stats-layout-config .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-selector-footer .flex {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  
  .stat-item .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .stat-preview {
    min-width: auto;
    text-align: left;
  }
}

/* Scrollbar personalizado */
.stats-list::-webkit-scrollbar,
.stats-preview::-webkit-scrollbar {
  width: 6px;
}

.stats-list::-webkit-scrollbar-track,
.stats-preview::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.stats-list::-webkit-scrollbar-thumb,
.stats-preview::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.stats-list::-webkit-scrollbar-thumb:hover,
.stats-preview::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones */
.stat-item {
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

/* Estados de checkboxes */
.p-checkbox.p-component {
  margin-right: 0.5rem;
}

/* Grid de preview responsive */
.preview-grid {
  min-height: 100px;
}

@media (max-width: 640px) {
  .preview-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>