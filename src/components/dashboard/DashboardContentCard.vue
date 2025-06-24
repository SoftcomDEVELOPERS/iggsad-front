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
        </h3>
        <Button 
          v-if="!configMode && cardId === 'busquedas-recientes'"
          icon="pi pi-trash" 
          text 
          size="small"
          severity="secondary"
          @click="clearSearchHistory"
          title="Limpiar historial"
        />
      </div>
    </template>

    <template #content>
      <div :class="{ 'opacity-50': configMode }">
        <!-- Búsquedas Recientes -->
        <div v-if="cardId === 'busquedas-recientes'" class="space-y-2">
          <div v-if="data.searches?.length > 0">
            <div 
              v-for="search in data.searches" 
              :key="search.id"
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-sm"
              @click="selectRecentSearch(search)"
            >
              <div class="flex items-center space-x-3">
                <span class="font-mono text-blue-600 font-medium">{{ search.expediente }}</span>
                <span class="text-slate-700">{{ search.cliente }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="text-green-600 font-medium">{{ search.deuda }}</span>
                <Button 
                  icon="pi pi-times" 
                  text 
                  size="small"
                  @click.stop="removeRecentSearch(search.id)"
                />
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 text-slate-500">
            <i class="pi pi-search text-2xl mb-2 block"></i>
            <p>No hay búsquedas recientes</p>
          </div>
        </div>

        <!-- Placeholder para otros tipos de contenido -->
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

// Métodos específicos para búsquedas recientes
const selectRecentSearch = (search) => {
  if (!props.configMode) {
    console.log('Seleccionar búsqueda:', search)
    // Aquí iría la lógica para cargar la búsqueda
  }
}

const removeRecentSearch = (searchId) => {
  if (!props.configMode) {
    console.log('Eliminar búsqueda:', searchId)
    // Aquí iría la lógica para eliminar la búsqueda
  }
}

const clearSearchHistory = () => {
  if (!props.configMode) {
    console.log('Limpiar historial de búsquedas')
    // Aquí iría la lógica para limpiar el historial
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