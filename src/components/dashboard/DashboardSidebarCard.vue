<template>
  <Card 
    class="relative"
    :class="{ 'border-blue-300 ring-2 ring-blue-100': configMode }"
  >
    <!-- Controles de configuración -->
    <div v-if="configMode" class="absolute top-2 right-2 flex gap-1 z-10">
      <Button
        icon="pi pi-cog"
        size="small"
        text
        class="w-6 h-6 text-xs"
        @click="$emit('resize', cardId, getNextSize())"
        :title="`Cambiar tamaño (actual: ${size})`"
      />
      <Button
        icon="pi pi-eye-slash"
        severity="danger"
        size="small"
        text
        class="w-6 h-6 text-xs"
        @click="$emit('toggle', cardId)"
        title="Ocultar tarjeta"
      />
    </div>

    <template #header>
      <div class="flex items-center justify-between p-6 pb-0" :class="{ 'opacity-50': configMode }">
        <h3 class="text-lg font-semibold text-slate-800 flex items-center">
          <i :class="definition?.icon" class="mr-2"></i>
          {{ definition?.title }}
          <Badge 
            v-if="getBadgeCount() > 0" 
            :value="getBadgeCount()" 
            class="ml-2" 
            :severity="getBadgeSeverity()"
          />
        </h3>
        <Button 
          v-if="!configMode && hasActionButton()"
          :icon="getActionIcon()" 
          text 
          size="small"
          @click="handleAction"
          :title="getActionTitle()"
        />
      </div>
    </template>

    <template #content>
      <div :class="{ 'opacity-50': configMode }">
        
        <!-- Notificaciones -->
        <div v-if="cardId === 'notificaciones'" class="space-y-2 max-h-64 overflow-y-auto">
          <div v-if="data.notifications?.length > 0">
            <div 
              v-for="notification in data.notifications" 
              :key="notification.id"
              class="p-3 rounded-lg border-l-4 text-xs"
              :class="getNotificationClass(notification)"
              @click="!configMode && markAsRead(notification.id)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="font-medium text-slate-800 mb-1">{{ notification.title }}</p>
                  <p class="text-slate-600 mb-2">{{ notification.message }}</p>
                  <p class="text-slate-500">{{ notification.time }}</p>
                </div>
                <Button 
                  v-if="!notification.read && !configMode"
                  icon="pi pi-times" 
                  text 
                  size="small"
                  @click.stop="markAsRead(notification.id)"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-slate-500">
            <i class="pi pi-bell-slash text-2xl mb-2 block"></i>
            <p class="text-sm">No hay notificaciones</p>
          </div>
        </div>

        <!-- Chat -->
        <div v-else-if="cardId === 'chat'" class="space-y-2 max-h-48 overflow-y-auto">
          <div v-if="data.messages?.length > 0">
            <div 
              v-for="message in data.messages" 
              :key="message.id"
              class="p-3 bg-green-50 rounded-lg border-l-4 border-green-400 cursor-pointer hover:bg-green-100 text-xs"
              @click="!configMode && openMessage(message)"
            >
              <div class="flex items-center justify-between mb-1">
                <p class="font-medium text-slate-800">{{ message.sender }}</p>
                <div v-if="message.unread" class="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <p class="text-slate-600 mb-2 line-clamp-2">{{ message.preview }}</p>
              <p class="text-slate-500">{{ message.time }}</p>
            </div>
          </div>
          <div v-else class="text-center py-4 text-slate-500">
            <i class="pi pi-comment text-2xl mb-2 block"></i>
            <p class="text-sm">No hay mensajes</p>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div v-else-if="cardId === 'acciones-rapidas'" class="space-y-2">
          <div v-if="data.actions?.length > 0">
            <Button 
              v-for="action in data.actions"
              :key="action.id"
              :label="action.label" 
              :icon="action.icon" 
              fluid 
              size="small"
              :outlined="action.id !== 'nuevo-caso'"
              @click="!configMode && handleQuickAction(action.id)"
              class="mb-2"
            />
          </div>
          <div v-else>
            <Button label="Nuevo Caso" icon="pi pi-plus" fluid size="small" />
            <Button label="Subir Documento" icon="pi pi-upload" fluid outlined size="small" class="mt-2" />
            <Button label="Nuevo Cliente" icon="pi pi-user-plus" fluid outlined size="small" class="mt-2" />
          </div>
        </div>

        <!-- Placeholder para otros tipos -->
        <div v-else class="text-center py-8 text-slate-500">
          <i :class="definition?.icon" class="text-3xl mb-2 block"></i>
          <p>{{ definition?.title }}</p>
          <p class="text-sm">Contenido próximamente</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'

const router = useRouter()

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  definition: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    default: () => ({})
  },
  size: {
    type: String,
    default: 'normal'
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'resize'])

// Helpers para badges
const getBadgeCount = () => {
  switch (props.cardId) {
    case 'notificaciones':
      return props.data.unreadCount || 0
    case 'chat':
      return props.data.unreadCount || 0
    default:
      return 0
  }
}

const getBadgeSeverity = () => {
  switch (props.cardId) {
    case 'chat':
      return 'success'
    default:
      return 'info'
  }
}

// Helpers para botones de acción
const hasActionButton = () => {
  return ['notificaciones', 'chat'].includes(props.cardId)
}

const getActionIcon = () => {
  switch (props.cardId) {
    case 'notificaciones':
      return 'pi pi-check-circle'
    case 'chat':
      return 'pi pi-external-link'
    default:
      return 'pi pi-cog'
  }
}

const getActionTitle = () => {
  switch (props.cardId) {
    case 'notificaciones':
      return 'Marcar todas como leídas'
    case 'chat':
      return 'Abrir chat'
    default:
      return 'Configurar'
  }
}

const handleAction = () => {
  if (props.configMode) return
  
  switch (props.cardId) {
    case 'notificaciones':
      markAllAsRead()
      break
    case 'chat':
      openChat()
      break
  }
}

// Métodos específicos por tipo de card
const getNotificationClass = (notification) => {
  return notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-400'
}

const markAsRead = (notificationId) => {
  if (!props.configMode) {
    console.log('Marcar como leída:', notificationId)
    // Aquí iría la lógica para marcar como leída
  }
}

const markAllAsRead = () => {
  console.log('Marcar todas como leídas')
  // Aquí iría la lógica para marcar todas como leídas
}

const openMessage = (message) => {
  console.log('Abrir mensaje:', message)
  // Aquí iría la lógica para abrir el mensaje
}

const openChat = () => {
  router.push('/chat')
}

const handleQuickAction = (actionId) => {
  switch (actionId) {
    case 'nuevo-caso':
      router.push('/casos/nuevo')
      break
    case 'subir-doc':
      router.push('/documentos/upload')
      break
    case 'nuevo-cliente':
      router.push('/clientes/nuevo')
      break
    default:
      console.log('Acción rápida:', actionId)
  }
}

// Rotación de tamaños para configuración
const getNextSize = () => {
  const sizes = ['small', 'normal', 'large', 'xl']
  const currentIndex = sizes.indexOf(props.size)
  const nextIndex = (currentIndex + 1) % sizes.length
  return sizes[nextIndex]
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>