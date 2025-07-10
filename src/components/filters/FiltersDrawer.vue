<template>
  <Drawer
    :visible="visible"
    @update:visible="updateVisible"
    :header="title"
    position="right"
    class="filters-drawer"
    :style="{ width: drawerWidth }"
  >
    <template #header>
      <div class="drawer-header">
        <h3 class="drawer-title">
          <i class="pi pi-filter drawer-title-icon"></i>
          {{ title }}
        </h3>
        <div class="drawer-actions">
          <Button
            :icon="isFullscreen ? 'pi pi-compress' : 'pi pi-expand'"
            :label="isFullscreen ? 'Ventana' : 'Pantalla Completa'"
            outlined
            size="small"
            class="fullscreen-btn"
            @click="toggleFullscreen"
          />
          <Button
            icon="pi pi-times"
            text
            rounded
            size="small"
            severity="secondary"
            v-tooltip="'Cerrar'"
            class="close-btn"
            @click="closeDrawer"
          />
        </div>
      </div>
    </template>

    <!-- Slot para el contenido del drawer (FilterPanel) -->
    <slot 
      :persistent-filters="persistentFilters"
      :persistent-expediente-search="persistentExpedienteSearch"
      :is-fullscreen="isFullscreen"
    />
  </Drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Filtros de Búsqueda de Expedientes'
  },
  persistentFilters: {
    type: Object,
    default: () => ({})
  },
  persistentExpedienteSearch: {
    type: String,
    default: ''
  },
  fullscreenByDefault: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:visible',
  'apply-filters',
  'clear-filters', 
  'filter-change',
  'search-expediente',
  'toggle-fullscreen',
  'close'
])

// Estado local
const isFullscreen = ref(props.fullscreenByDefault)

// Computed
const drawerWidth = computed(() => isFullscreen.value ? '100vw' : '50rem')

// Métodos
const updateVisible = (value) => {
  emit('update:visible', value)
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  emit('toggle-fullscreen', isFullscreen.value)
}

const closeDrawer = () => {
  emit('update:visible', false)
  emit('close')
}

// Watchers
watch(() => props.visible, (newValue) => {
  if (newValue && props.fullscreenByDefault) {
    isFullscreen.value = true
  }
})

// Exponer métodos y estado
defineExpose({
  isFullscreen,
  toggleFullscreen,
  closeDrawer
})
</script>

<style scoped>
/* ===== DRAWER DE FILTROS ===== */
:deep(.filters-drawer) {
  .p-drawer-header {
    background: linear-gradient(135deg, var(--iggsad-surface-50) 0%, var(--iggsad-surface-100) 100%);
    border-bottom: 2px solid var(--iggsad-surface-200);
    padding: 0; /* Removemos padding para usar el nuestro */
  }

  .p-drawer-content {
    padding: 0;
  }

  .p-drawer-header-content {
    padding: 0 !important; /* Forzar sin padding */
  }
}

/* ===== HEADER PERSONALIZADO ===== */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: var(--iggsad-spacing-lg);
  gap: var(--iggsad-spacing-md);
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: var(--iggsad-spacing-sm);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--iggsad-surface-800);
  margin: 0;
  flex: 1;
}

.drawer-title-icon {
  color: var(--iggsad-primary-600);
  font-size: 1rem;
}

.drawer-actions {
  display: flex;
  gap: var(--iggsad-spacing-xs);
  align-items: center;
}

.fullscreen-btn {
  transition: all var(--iggsad-transition-fast);
  font-size: 0.75rem;
}

.fullscreen-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-sm);
}

.close-btn {
  color: var(--iggsad-surface-500);
  transition: all var(--iggsad-transition-fast);
}

.close-btn:hover {
  color: var(--iggsad-surface-700);
  background: var(--iggsad-surface-100);
  transform: scale(1.1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .drawer-header {
    flex-direction: column;
    gap: var(--iggsad-spacing-sm);
    align-items: stretch;
    padding: var(--iggsad-spacing-md);
  }

  .drawer-title {
    justify-content: center;
    font-size: 1rem;
  }

  .drawer-actions {
    justify-content: center;
  }

  .fullscreen-btn {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .drawer-header {
    padding: var(--iggsad-spacing-sm);
  }

  .drawer-title {
    font-size: 0.9375rem;
  }

  .fullscreen-btn {
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
  }
}

/* ===== ACCESIBILIDAD ===== */
@media (prefers-reduced-motion: reduce) {
  .fullscreen-btn,
  .close-btn {
    transition: none !important;
  }
}

.fullscreen-btn:focus-visible,
.close-btn:focus-visible {
  outline: 2px solid var(--iggsad-primary-600);
  outline-offset: 2px;
  border-radius: var(--iggsad-radius-sm);
}

/* ===== ANIMACIONES ===== */
.drawer-header {
  animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.drawer-title-icon {
  animation: fadeIn 0.4s ease-out 0.1s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>