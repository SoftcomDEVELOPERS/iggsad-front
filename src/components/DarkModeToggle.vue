<template>
  <div class="dark-mode-toggle">
    <Button
      :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
      :aria-label="isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      text
      rounded
      size="large"
      class="iggsad-user-button"
      :class="{ 'active': isDarkMode }"
      @click="toggleDarkMode"
      v-tooltip.bottom="tooltipText"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppLayout } from '@/composables/useAppLayout'
import Button from 'primevue/button'

const { isDarkMode, toggleDarkMode } = useAppLayout()

const tooltipText = computed(() => {
  return isDarkMode.value 
    ? 'Cambiar a modo claro' 
    : 'Cambiar a modo oscuro'
})
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>