<!-- src/components/dashboard/cards/ChatCard.vue -->
<template>
  <div class="chat-card h-full flex flex-col">
    <!-- Header -->
    <div class="card-header p-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center">
          <i class="pi pi-comments mr-2"></i>
          {{ config?.title || 'Chat' }}
          <Badge v-if="unreadCount > 0" :value="unreadCount" class="ml-2" severity="success" />
        </h3>
        <Button 
          v-if="!configMode"
          icon="pi pi-external-link" 
          text 
          size="small"
          @click="openChat"
          title="Abrir chat completo"
        />
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-content flex-1 p-4 overflow-hidden">
      <!-- Lista de mensajes -->
      <div v-if="messages.length > 0" class="messages-list h-full overflow-y-auto">
        <div class="space-y-3">
          <div 
            v-for="message in visibleMessages" 
            :key="message.id"
            class="message-item p-3 bg-green-50 rounded-lg border-l-4 border-green-400 cursor-pointer hover:bg-green-100 transition-colors"
            :class="{ 'pointer-events-none opacity-60': configMode }"
            @click="!configMode && openMessage(message)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="avatar">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {{ getInitials(message.sender) }}
                  </div>
                </div>
                <div>
                  <p class="font-medium text-slate-800 text-sm">{{ message.sender }}</p>
                  <p class="text-xs text-slate-500">{{ message.time }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div v-if="message.unread" class="unread-indicator">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div v-if="message.attachments" class="attachment-indicator">
                  <i class="pi pi-paperclip text-slate-400 text-xs"></i>
                </div>
                <div v-if="message.priority === 'high'" class="priority-indicator">
                  <i class="pi pi-exclamation-circle text-red-500 text-xs"></i>
                </div>
              </div>
            </div>
            
            <p class="text-slate-600 text-sm line-clamp-2 mb-2">{{ message.preview }}</p>
            
            <!-- Quick actions -->
            <div v-if="!configMode && message.unread" class="quick-actions flex gap-2">
              <Button 
                label="Responder"
                size="small" 
                text
                icon="pi pi-reply"
                @click.stop="quickReply(message)"
                class="text-xs"
              />
              <Button 
                label="Marcar leído"
                size="small" 
                text
                icon="pi pi-check"
                @click.stop="markAsRead(message.id)"
                class="text-xs"
              />
            </div>
          </div>
        </div>

        <!-- Mostrar más -->
        <div v-if="messages.length > maxVisibleItems" class="mt-3 text-center">
          <Button 
            :label="`Ver ${messages.length - maxVisibleItems} más`"
            text 
            size="small"
            @click="showAll = !showAll"
            :disabled="configMode"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state h-full flex flex-col items-center justify-center text-center py-8">
        <i class="pi pi-comment text-4xl text-slate-300 mb-4"></i>
        <h4 class="text-lg font-medium text-slate-600 mb-2">No hay mensajes</h4>
        <p class="text-sm text-slate-500 mb-4">
          Los mensajes y conversaciones aparecerán aquí
        </p>
        <Button 
          v-if="!configMode"
          icon="pi pi-plus" 
          label="Nuevo Chat"
          outlined
          size="small"
          @click="startNewChat"
        />
      </div>
    </div>

    <!-- Quick compose (opcional) -->
    <div v-if="config?.showQuickCompose && !configMode" class="card-footer p-3 border-t border-slate-200">
      <div class="flex gap-2">
        <InputText
          v-model="quickMessage"
          placeholder="Escribir mensaje rápido..."
          size="small"
          class="flex-1"
          @keyup.enter="sendQuickMessage"
        />
        <Button 
          icon="pi pi-send"
          size="small"
          @click="sendQuickMessage"
          :disabled="!quickMessage.trim()"
        />
      </div>
    </div>

    <!-- Footer con estadísticas -->
    <div v-if="config?.showStats && messages.length > 0" class="card-footer p-3 border-t border-slate-200 bg-slate-50">
      <div class="flex items-center justify-between text-xs text-slate-600">
        <span>{{ unreadCount }} sin leer</span>
        <span>{{ messages.length }} conversaciones</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'
import { useRouter } from 'vue-router'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({
      title: 'Chat',
      maxMessages: 5,
      showOpenChat: true,
      showQuickCompose: false,
      showStats: false
    })
  },
  data: {
    type: Object,
    default: () => ({
      messages: [],
      unreadCount: 0
    })
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update-config', 
  'open-message', 
  'mark-read', 
  'quick-reply', 
  'send-message',
  'start-new-chat'
])

const router = useRouter()

// Estado local
const showAll = ref(false)
const quickMessage = ref('')

// Computed
const messages = computed(() => {
  if (props.data.messages && props.data.messages.length > 0) {
    return props.data.messages
  }
  
  // Datos mock para desarrollo
  return [
    {
      id: 1,
      sender: 'María García López',
      preview: '¿Podríamos revisar el contrato de arrendamiento mañana por la mañana? Tengo algunas dudas sobre las cláusulas.',
      time: 'Hace 30 min',
      unread: true,
      priority: 'medium',
      attachments: false
    },
    {
      id: 2,
      sender: 'Juan Martín Silva',
      preview: 'Adjunto la documentación solicitada para el expediente. Por favor confirmen recepción.',
      time: 'Hace 1h',
      unread: true,
      priority: 'normal',
      attachments: true
    },
    {
      id: 3,
      sender: 'Ana Rodríguez Díaz',
      preview: 'Gracias por la gestión. Todo ha quedado perfecto. Un saludo.',
      time: 'Hace 3h',
      unread: false,
      priority: 'low',
      attachments: false
    },
    {
      id: 4,
      sender: 'Carlos López Méndez',
      preview: 'URGENTE: Necesito información sobre el estado del procedimiento antes de las 17:00.',
      time: 'Ayer',
      unread: false,
      priority: 'high',
      attachments: false
    }
  ]
})

const unreadCount = computed(() => {
  return messages.value.filter(m => m.unread).length
})

const maxVisibleItems = computed(() => props.config?.maxMessages || 5)

const visibleMessages = computed(() => {
  if (showAll.value) {
    return messages.value
  }
  return messages.value.slice(0, maxVisibleItems.value)
})

// Métodos
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const openMessage = (message) => {
  if (!props.configMode) {
    emit('open-message', message)
  }
}

const openChat = () => {
  if (!props.configMode) {
    router.push('/chat')
  }
}

const markAsRead = (messageId) => {
  if (!props.configMode) {
    emit('mark-read', messageId)
  }
}

const quickReply = (message) => {
  if (!props.configMode) {
    emit('quick-reply', message)
  }
}

const sendQuickMessage = () => {
  if (!props.configMode && quickMessage.value.trim()) {
    emit('send-message', quickMessage.value.trim())
    quickMessage.value = ''
  }
}

const startNewChat = () => {
  if (!props.configMode) {
    emit('start-new-chat')
  }
}
</script>

<style scoped>
.chat-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
}

.card-content {
  background: white;
}

.card-footer {
  border-top: 1px solid #e2e8f0;
}

/* Lista de mensajes */
.messages-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.messages-list::-webkit-scrollbar {
  width: 4px;
}

.messages-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.messages-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.messages-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Message items */
.message-item {
  transition: all 0.2s ease;
}

.message-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.avatar {
  flex-shrink: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Indicadores */
.unread-indicator,
.attachment-indicator,
.priority-indicator {
  flex-shrink: 0;
}

/* Quick actions */
.quick-actions {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #d1fae5;
}

/* Estado vacío */
.empty-state {
  min-height: 200px;
}

/* Responsive */
@media (max-width: 768px) {
  .message-item {
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
  
  .quick-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Animaciones */
.message-item {
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
.message-item.high-priority {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.message-item.high-priority:hover {
  background: #fee2e2;
}

.message-item:active {
  transform: scale(0.98);
}

/* Modo configuración */
.config-mode .message-item {
  cursor: not-allowed;
}

.config-mode .empty-state {
  opacity: 0.6;
}

/* Quick compose styling */
.card-footer .flex {
  align-items: center;
}

.card-footer input {
  height: 32px;
}
</style>