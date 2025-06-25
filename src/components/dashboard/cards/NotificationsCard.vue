<!-- src/components/dashboard/cards/NotificationsCard.vue -->
<template>
  <div class="notifications-card h-full flex flex-col">
    <!-- Header -->
    <div class="card-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center">
          <i class="pi pi-bell mr-2 "></i>
          {{ config?.title || 'Notificaciones' }}
          <Badge v-if="unreadCount > 0" :value="unreadCount" class="ml-2" />
        </h3>
        <Button 
          v-if="!configMode && notifications.length > 0"
          icon="pi pi-check-circle" 
          text 
          size="small"
          @click="markAllAsRead"
          title="Marcar todas como leídas"
        />
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-content flex-1 p-4 overflow-hidden">
      <!-- Lista de notificaciones -->
      <div v-if="notifications.length > 0" class="notifications-list h-full overflow-y-auto">
        <div class="space-y-2">
          <div 
            v-for="notification in visibleNotifications" 
            :key="notification.id"
            class="notification-item p-3 rounded-lg border-l-4 text-sm cursor-pointer transition-colors"
            :class="[
              getNotificationClass(notification),
              { 'pointer-events-none opacity-60': configMode }
            ]"
            @click="!configMode && markAsRead(notification.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <p class="font-medium text-slate-800 truncate">{{ notification.title }}</p>
                  <span v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                </div>
                <p class="text-slate-600 mb-2 line-clamp-2">{{ notification.message }}</p>
                <div class="flex items-center justify-between">
                  <p class="text-slate-500 text-xs">{{ notification.time }}</p>
                  <div v-if="notification.priority" class="priority-badge">
                    <span 
                      class="text-xs px-2 py-1 rounded-full"
                      :class="getPriorityClass(notification.priority)"
                    >
                      {{ getPriorityLabel(notification.priority) }}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                v-if="!notification.read && !configMode"
                icon="pi pi-times" 
                text 
                size="small"
                @click.stop="markAsRead(notification.id)"
                class="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        <!-- Mostrar más -->
        <div v-if="notifications.length > maxVisibleItems" class="mt-3 text-center">
          <Button 
            :label="`Ver ${notifications.length - maxVisibleItems} más`"
            text 
            size="small"
            @click="showAll = !showAll"
            :disabled="configMode"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state h-full flex flex-col items-center justify-center text-center py-8">
        <i class="pi pi-bell-slash text-4xl text-slate-300 mb-4"></i>
        <h4 class="text-lg font-medium text-slate-600 mb-2">No hay notificaciones</h4>
        <p class="text-sm text-slate-500">
          Las notificaciones aparecerán aquí cuando haya nuevas actualizaciones
        </p>
      </div>
    </div>

    <!-- Footer con estadísticas -->
    <div v-if="config?.showStats && notifications.length > 0" class="card-footer p-3 border-t border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between text-xs text-slate-600">
        <span>{{ unreadCount }} sin leer</span>
        <span>{{ notifications.length }} total</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
      title: 'Notificaciones',
      maxItems: 10,
      showMarkAllRead: true,
      showStats: false
    })
  },
  data: {
    type: Object,
    default: () => ({
      notifications: [],
      unreadCount: 0
    })
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-config', 'mark-read', 'mark-all-read'])

// Estado local
const showAll = ref(false)

// Computed
const notifications = computed(() => {
  if (props.data.notifications && props.data.notifications.length > 0) {
    return props.data.notifications
  }
  
  // Datos mock para desarrollo
  return [
    {
      id: 1,
      title: 'Audiencia programada',
      message: 'EXP-2024-001 tiene audiencia mañana a las 10:00 AM',
      time: 'Hace 1h',
      read: false,
      priority: 'high',
      type: 'court'
    },
    {
      id: 2,
      title: 'Documento subido',
      message: 'Se ha añadido un nuevo archivo al expediente EXP-2024-045',
      time: 'Hace 2h',
      read: false,
      priority: 'medium',
      type: 'document'
    },
    {
      id: 3,
      title: 'Plazo próximo a vencer',
      message: 'Las alegaciones para EXP-2024-023 vencen en 3 días',
      time: 'Ayer',
      read: true,
      priority: 'high',
      type: 'deadline'
    },
    {
      id: 4,
      title: 'Pago recibido',
      message: 'Se ha recibido un pago de €1,250 para EXP-2024-067',
      time: 'Hace 2 días',
      read: true,
      priority: 'low',
      type: 'payment'
    }
  ]
})

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const maxVisibleItems = computed(() => props.config?.maxItems || 10)

const visibleNotifications = computed(() => {
  if (showAll.value) {
    return notifications.value
  }
  return notifications.value.slice(0, maxVisibleItems.value)
})

// Métodos
const getNotificationClass = (notification) => {
  const baseClass = 'group hover:bg-slate-50'
  
  if (notification.read) {
    return `${baseClass} bg-gray-50 border-gray-200`
  }
  
  switch (notification.type) {
    case 'court':
      return `${baseClass} bg-blue-50 border-blue-400`
    case 'deadline':
      return `${baseClass} bg-red-50 border-red-400`
    case 'payment':
      return `${baseClass} bg-green-50 border-green-400`
    case 'document':
      return `${baseClass} bg-purple-50 border-purple-400`
    default:
      return `${baseClass} bg-blue-50 border-blue-400`
  }
}

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'Urgente'
    case 'medium':
      return 'Medio'
    case 'low':
      return 'Bajo'
    default:
      return 'Normal'
  }
}

const markAsRead = (notificationId) => {
  if (!props.configMode) {
    emit('mark-read', notificationId)
  }
}

const markAllAsRead = () => {
  if (!props.configMode) {
    emit('mark-all-read')
  }
}
</script>

<style scoped>
.notifications-card {
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

/* Lista de notificaciones */
.notifications-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Notification items */
.notification-item {
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.notification-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estado vacío */
.empty-state {
  min-height: 200px;
}

/* Priority badge */
.priority-badge {
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-item {
    padding: 0.75rem;
  }
  
  .card-header {
    padding: 0.75rem;
  }
  
  .card-content {
    padding: 0.75rem;
  }
  
  .card-footer {
    padding: 0.5rem 0.75rem;
  }
}

/* Animaciones */
.notification-item {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Estados especiales */
.notification-item.unread {
  position: relative;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
}

.notification-item:active {
  transform: scale(0.98);
}

/* Modo configuración */
.config-mode .notification-item {
  cursor: not-allowed;
}

.config-mode .empty-state {
  opacity: 0.6;
}
</style>