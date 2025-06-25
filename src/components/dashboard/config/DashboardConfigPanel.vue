<!-- src/components/dashboard/DashboardConfigPanel.vue -->
<template>
  <Dialog 
    :visible="visible" 
    modal 
    :draggable="false"
    :closable="true"
    class="dashboard-config-dialog"
    style="width: 90vw; max-width: 800px; height: 70vh;"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <i class="pi pi-cog text-xl text-blue-600"></i>
        <div>
          <h2 class="text-xl font-bold text-slate-800">Configuración del Dashboard</h2>
          <p class="text-sm text-slate-600">Personaliza tu experiencia de trabajo</p>
        </div>
      </div>
    </template>

    <div class="h-full flex flex-col overflow-hidden">
      <!-- Vista previa del grid -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Vista Previa del Layout</h3>
        <div class="border border-slate-200 rounded-lg p-4 bg-slate-50 min-h-32">
          <div class="grid gap-2" :class="getPreviewGridClasses()">
            <div 
              v-for="item in dashboardLayout" 
              :key="item.i"
              class="bg-white border border-slate-200 rounded p-2 text-xs text-center flex items-center justify-center"
              :class="getCardPreviewClasses(item)"
              :style="getCardPreviewStyle(item)"
            >
              <div>
                <i :class="getCardIcon(item.i)" class="block mb-1"></i>
                <span>{{ getCardTitle(item.i) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cards disponibles -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-3">Cards Disponibles</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            v-for="card in availableCards" 
            :key="card.id"
            class="border border-slate-200 rounded-lg p-3 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            :class="{ 
              'bg-blue-50 border-blue-300': isCardInLayout(card.id),
              'opacity-50': isCardInLayout(card.id)
            }"
            @click="toggleCard(card.id)"
          >
            <i :class="card.icon" class="text-2xl mb-2 block" :style="{ color: isCardInLayout(card.id) ? '#3b82f6' : '#64748b' }"></i>
            <h4 class="font-medium text-sm">{{ card.title }}</h4>
            <p class="text-xs text-slate-500 mt-1">{{ card.type }}</p>
            <div class="mt-2">
              <Badge 
                v-if="isCardInLayout(card.id)" 
                value="Activa" 
                severity="success" 
                class="text-xs"
              />
              <Button
                v-else
                label="Añadir"
                size="small"
                outlined
                class="text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="flex gap-3">
        <Button 
        icon="pi pi-th-large" 
        label="Librería de Cards"
        outlined
        @click="showCardLibrary = true"
      />
      <Button 
        icon="pi pi-chart-bar" 
        label="Configurar Estadísticas"
        outlined
        @click="showStatsSelector = true"
      />
        <Button 
          icon="pi pi-refresh" 
          label="Restablecer Layout"
          severity="secondary"
          outlined
          @click="resetLayout"
        />
        <Button 
          icon="pi pi-download" 
          label="Exportar Configuración"
          outlined
          @click="exportConfig"
        />
      </div>
    </div>
    

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="text-sm text-slate-500">
          {{ dashboardLayout.length }} cards configuradas
        </div>
        <div class="flex gap-2">
          <Button 
            label="Cancelar" 
            severity="secondary" 
            outlined 
            @click="handleCancel"
          />
          <Button 
            label="Guardar Cambios" 
            @click="handleSave"
            :loading="saving"
          />
        </div>
      </div>
    </template>

    <CardLibrary
      v-model:visible="showCardLibrary"
      :dashboard-layout="dashboardLayout"
      :available-cards="availableCards"
      @card-added="$emit('card-added', $event)"
      @card-removed="$emit('card-removed', $event)"
    />

    <StatsSelector
      v-model:visible="showStatsSelector"
      :current-selected-stats="currentStatsConfig?.selectedStats || []"
      :current-layout="currentStatsConfig?.gridLayout || 'auto'"
      @apply="handleStatsConfig"
    />
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import CardLibrary from './CardLibrary.vue'
import StatsSelector from './StatsSelector.vue'
import { useToast } from '@/composables/useToast'


const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  dashboardLayout: {
    type: Array,
    required: true
  },
  cardsConfig: {
    type: Object,
    required: true
  },
  availableCards: {
    type: Array,
    required: true
  }
})

const emit = defineEmits([
  'update:visible',
  'save',
  'cancel',
  'layout-updated',
  'card-added',
  'card-removed',
  'reset-config'
])

const { showSuccess, showError, showWarn } = useToast()
const showCardLibrary = ref(false)
const showStatsSelector = ref(false)

// Estado local
const saving = ref(false)

// Computed
const getPreviewGridClasses = () => {
  return 'grid-cols-12 auto-rows-min'
}

// Métodos
const getCardPreviewClasses = (item) => {
  return `col-span-${item.w} row-span-${item.h}`
}

const getCardPreviewStyle = (item) => {
  return {
    gridColumnStart: item.x + 1,
    gridColumnEnd: item.x + item.w + 1,
    gridRowStart: item.y + 1,
    gridRowEnd: item.y + item.h + 1,
    minHeight: `${item.h * 20}px`
  }
}

const getCardIcon = (cardId) => {
  const card = props.availableCards.find(c => c.id === cardId)
  return card?.icon || 'pi pi-square'
}

const getCardTitle = (cardId) => {
  const card = props.availableCards.find(c => c.id === cardId)
  return card?.title || cardId
}

const isCardInLayout = (cardId) => {
  return props.dashboardLayout.some(item => item.i === cardId)
}

const toggleCard = (cardId) => {
  if (isCardInLayout(cardId)) {
    // Remover card
    emit('card-removed', cardId)
    showWarn('Card eliminada', `${getCardTitle(cardId)} ha sido eliminada del dashboard`)
  } else {
    // Añadir card
    const newItem = {
      i: cardId,
      x: 0,
      y: 0,
      w: 4,
      h: 4
    }
    emit('card-added', cardId)
    showSuccess('Card añadida', `${getCardTitle(cardId)} ha sido añadida al dashboard`)
  }
}

const resetLayout = () => {
  if (confirm('¿Estás seguro de que quieres restablecer el layout a la configuración por defecto?')) {
    emit('reset-config')
    showWarn('Layout restablecido', 'Se ha restaurado la configuración por defecto')
  }
}

const exportConfig = () => {
  const config = {
    layout: props.dashboardLayout,
    cardsConfig: props.cardsConfig,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `dashboard-config-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
  showSuccess('Configuración exportada', 'El archivo se ha descargado correctamente')
}

const handleSave = async () => {
  try {
    saving.value = true
    emit('save')
    showSuccess('Configuración guardada', 'Los cambios se han aplicado correctamente')
    emit('update:visible', false)
  } catch (error) {
    showError('Error al guardar', 'No se pudieron aplicar los cambios')
  } finally {
    saving.value = false
  }
}

const handleStatsConfig = (config) => {
  // Actualizar configuración de stats-dashboard
  emit('card-config-updated', 'stats-dashboard', config)
  showStatsSelector.value = false
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}
</script>

<style scoped>
.dashboard-config-dialog :deep(.p-dialog-content) {
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dashboard-config-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Grid preview */
.grid {
  min-height: 200px;
  gap: 8px;
}

/* Cards preview */
.grid .bg-white {
  transition: all 0.2s ease;
  border: 2px solid #e2e8f0;
}

.grid .bg-white:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

/* Available cards */
.cursor-pointer {
  transition: all 0.2s ease;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cursor-pointer:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-config-dialog {
    width: 95vw !important;
    height: 80vh !important;
  }
  
  .grid.grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Animaciones */
.cursor-pointer {
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