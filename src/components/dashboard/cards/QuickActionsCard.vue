<!-- src/components/dashboard/cards/QuickActionsCard.vue -->
<template>
  <div class="quick-actions-card h-full flex flex-col">
    <!-- Header -->
    <div class="card-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center">
          <i class="pi pi-bolt mr-2"></i>
          {{ config?.title || 'Acciones Rápidas' }}
        </h3>
        <Button 
          v-if="configMode"
          icon="pi pi-cog"
          text 
          size="small"
          @click="$emit('configure-card', cardId)"
          title="Configurar acciones"
        />
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-content flex-1 p-4">
      <!-- Grid de acciones -->
      <div v-if="actions.length > 0" class="actions-grid h-full">
        <div :class="getGridClasses()">
          <div 
            v-for="action in visibleActions" 
            :key="action.id"
            class="action-item group"
            :class="{ 'pointer-events-none opacity-60': configMode }"
          >
            <Button 
              :icon="action.icon"
              :label="action.label" 
              :severity="action.severity || 'secondary'"
              :outlined="action.outlined !== false"
              size="small"
              class="w-full h-full action-button"
              @click="!configMode && handleQuickAction(action)"
              :loading="action.loading"
              :disabled="configMode || action.disabled"
            >
              <template v-if="action.badge" #badge>
                <Badge :value="action.badge" />
              </template>
            </Button>
          </div>
        </div>

        <!-- Mostrar más acciones -->
        <div v-if="actions.length > maxVisibleActions" class="mt-3 text-center">
          <Button 
            :label="showAll ? 'Mostrar menos' : `Ver ${actions.length - maxVisibleActions} más`"
            text 
            size="small"
            @click="showAll = !showAll"
            :disabled="configMode"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state h-full flex flex-col items-center justify-center text-center py-8">
        <i class="pi pi-bolt text-4xl text-slate-300 mb-4"></i>
        <h4 class="text-lg font-medium text-slate-600 mb-2">No hay acciones configuradas</h4>
        <p class="text-sm text-slate-500 mb-4">
          Configura acciones rápidas para mejorar tu flujo de trabajo
        </p>
        <Button 
          v-if="configMode"
          icon="pi pi-plus" 
          label="Configurar Acciones"
          outlined
          size="small"
          @click="$emit('configure-card', cardId)"
        />
      </div>
    </div>

    <!-- Footer con estadísticas de uso -->
    <div v-if="config?.showStats && actions.length > 0" class="card-footer p-3 border-t border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between text-xs text-slate-600">
        <span>{{ actions.length }} acciones</span>
        <span>Más usada: {{ getMostUsedAction() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      title: 'Acciones Rápidas',
      layout: 'grid', // 'grid', 'list', 'compact'
      maxActions: 6,
      showStats: false
    })
  },
  data: {
    type: Object,
    default: () => ({
      actions: []
    })
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-config', 'configure-card', 'action-executed'])

const router = useRouter()

// Estado local
const showAll = ref(false)

// Computed
const actions = computed(() => {
  if (props.data.actions && props.data.actions.length > 0) {
    return props.data.actions
  }
  
  // Acciones por defecto
  return [
    {
      id: 'nuevo-caso',
      label: 'Nuevo Caso',
      icon: 'pi pi-plus',
      severity: 'primary',
      outlined: false,
      route: '/casos/nuevo',
      usage: 15
    },
    {
      id: 'subir-documento',
      label: 'Subir Documento',
      icon: 'pi pi-upload',
      severity: 'secondary',
      route: '/documentos/upload',
      usage: 8
    },
    {
      id: 'nuevo-cliente',
      label: 'Nuevo Cliente',
      icon: 'pi pi-user-plus',
      severity: 'secondary',
      route: '/clientes/nuevo',
      usage: 12
    },
    {
      id: 'calendario',
      label: 'Ver Calendario',
      icon: 'pi pi-calendar',
      severity: 'secondary',
      route: '/audiencias',
      badge: '3',
      usage: 7
    },
    {
      id: 'exportar-datos',
      label: 'Exportar Datos',
      icon: 'pi pi-download',
      severity: 'secondary',
      action: 'export',
      usage: 3
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'pi pi-cog',
      severity: 'secondary',
      route: '/configuracion',
      usage: 2
    }
  ]
})

const maxVisibleActions = computed(() => props.config?.maxActions || 6)

const visibleActions = computed(() => {
  if (showAll.value) {
    return actions.value
  }
  return actions.value.slice(0, maxVisibleActions.value)
})

// Métodos
const getGridClasses = () => {
  const layout = props.config?.layout || 'grid'
  const count = visibleActions.value.length
  
  switch (layout) {
    case 'list':
      return 'flex flex-col gap-2'
    case 'compact':
      return 'grid grid-cols-3 gap-1'
    default: // grid
      if (count <= 2) return 'grid grid-cols-1 gap-3'
      if (count <= 4) return 'grid grid-cols-2 gap-3'
      return 'grid grid-cols-2 lg:grid-cols-3 gap-2'
  }
}

const handleQuickAction = async (action) => {
  if (props.configMode) return
  
  try {
    // Incrementar contador de uso
    action.usage = (action.usage || 0) + 1
    
    // Ejecutar acción
    if (action.route) {
      router.push(action.route)
    } else if (action.action) {
      await executeCustomAction(action.action, action)
    } else if (action.command && typeof action.command === 'function') {
      action.command()
    }
    
    emit('action-executed', action)
    
  } catch (error) {
    console.error('Error ejecutando acción:', error)
  }
}

const executeCustomAction = async (actionType, action) => {
  switch (actionType) {
    case 'export':
      // Lógica de exportación
      console.log('Exportando datos...')
      action.loading = true
      setTimeout(() => {
        action.loading = false
        console.log('Exportación completada')
      }, 2000)
      break
      
    case 'backup':
      console.log('Creando backup...')
      break
      
    case 'sync':
      console.log('Sincronizando datos...')
      break
      
    default:
      console.log('Acción personalizada:', actionType)
  }
}

const getMostUsedAction = () => {
  if (actions.value.length === 0) return 'N/A'
  
  const mostUsed = actions.value.reduce((prev, current) => {
    return (prev.usage || 0) > (current.usage || 0) ? prev : current
  })
  
  return mostUsed.label
}
</script>

<style scoped>
.quick-actions-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #fef3c7, #fef7cd);
}

.card-content {
  background: white;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
}

/* Actions grid */
.actions-grid {
  display: flex;
  flex-direction: column;
}

.action-item {
  display: flex;
  min-height: 44px;
}

.action-button {
  justify-content: flex-start;
  text-align: left;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button:active {
  transform: translateY(0);
}

/* Layout específico para compact */
.grid.grid-cols-3 .action-button {
  font-size: 0.75rem;
  padding: 0.5rem;
  min-height: 40px;
}

.grid.grid-cols-3 .action-button .p-button-icon {
  font-size: 0.875rem;
}

/* Layout específico para list */
.flex.flex-col .action-button {
  justify-content: flex-start;
  padding: 0.75rem 1rem;
}

/* Estados especiales */
.action-item.primary .action-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: white;
}

.action-item.primary .action-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

/* Badge en actions */
.action-button :deep(.p-badge) {
  margin-left: auto;
}

/* Estado vacío */
.empty-state {
  min-height: 150px;
}

/* Responsive */
@media (max-width: 768px) {
  .grid.grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-button {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .card-content {
    padding: 0.75rem;
  }
}

@media (max-width: 576px) {
  .grid.grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .action-item {
    min-height: 40px;
  }
}

/* Animaciones */
.action-item {
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

/* Loading state */
.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-button.p-button-loading {
  opacity: 0.8;
}

/* Modo configuración */
.config-mode .action-item {
  cursor: not-allowed;
}

.config-mode .empty-state {
  opacity: 0.6;
}

/* Hover effects especiales */
.action-item:hover .action-button {
  border-color: #3b82f6;
}

.action-item.group:hover .action-button {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* Variantes de color para diferentes tipos de acciones */
.action-button[data-type="create"] {
  border-color: #10b981;
  color: #047857;
}

.action-button[data-type="create"]:hover {
  background: #ecfdf5;
  border-color: #059669;
}

.action-button[data-type="navigate"] {
  border-color: #8b5cf6;
  color: #7c3aed;
}

.action-button[data-type="navigate"]:hover {
  background: #f5f3ff;
  border-color: #7c3aed;
}

.action-button[data-type="export"] {
  border-color: #f59e0b;
  color: #d97706;
}

.action-button[data-type="export"]:hover {
  background: #fffbeb;
  border-color: #f59e0b;
}
</style>