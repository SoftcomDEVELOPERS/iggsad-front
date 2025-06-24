<template>
  <Card 
    class="border border-slate-200 hover:shadow-lg transition-shadow relative"
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
        :icon="definition ? 'pi pi-eye-slash' : 'pi pi-eye'"
        :severity="definition ? 'danger' : 'success'"
        size="small"
        text
        class="w-6 h-6 text-xs"
        @click="$emit('toggle', cardId)"
        title="Ocultar/Mostrar tarjeta"
      />
    </div>

    <template #content>
      <div class="flex items-center" :class="{ 'opacity-50': configMode }">
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
          :class="getIconBackgroundClass()"
        >
          <i class="text-xl" :class="[getIconColorClass(), definition?.icon]"></i>
        </div>
        <div>
          <p class="text-2xl font-bold text-slate-800">{{ data?.value || 0 }}</p>
          <p class="text-sm text-slate-600">{{ data?.label || definition?.title }}</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'

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

// Colores por tipo de tarjeta
const getIconBackgroundClass = () => {
  switch (props.definition?.color) {
    case 'blue': return 'bg-blue-100'
    case 'green': return 'bg-green-100'
    case 'amber': return 'bg-amber-100'
    case 'purple': return 'bg-purple-100'
    case 'slate': return 'bg-slate-100'
    case 'orange': return 'bg-orange-100'
    default: return 'bg-gray-100'
  }
}

const getIconColorClass = () => {
  switch (props.definition?.color) {
    case 'blue': return 'text-blue-600'
    case 'green': return 'text-green-600'
    case 'amber': return 'text-amber-600'
    case 'purple': return 'text-purple-600'
    case 'slate': return 'text-slate-600'
    case 'orange': return 'text-orange-600'
    default: return 'text-gray-600'
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