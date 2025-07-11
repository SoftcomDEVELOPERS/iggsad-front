<!-- src/components/BreadcrumbWrapper.vue - VERSIÓN INTEGRADA -->
<template>
  <div class="breadcrumb-wrapper">
    <!-- Breadcrumb integrado en la zona del header -->
    <div class="integrated-breadcrumb-section" v-if="!isPublicPage">
      <div class="breadcrumb-container">
        <Breadcrumb 
          :model="breadcrumbItems" 
          class="integrated-breadcrumb"
        />
      </div>
    </div>
    
    <!-- Contenido de la página -->
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'

const route = useRoute()

// Detectar si estamos en página pública
const isPublicPage = computed(() => route.meta.public === true)

// Breadcrumb dinámico
const breadcrumbItems = computed(() => {
  if (isPublicPage.value) return []
  
  const items = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' }
  ]
  
  const routeMap = {
    '/dashboard': [],
    '/expedientes': [
      { label: 'Expedientes', route: '/expedientes' }
    ],
    '/clientes': [
      { label: 'Clientes', route: '/clientes' }
    ],
    '/documentos': [
      { label: 'Documentos', route: '/documentos' }
    ],
    '/reportes': [
      { label: 'Reportes', route: '/reportes' }
    ]
  }
  
  // Para rutas dinámicas como /expedientes/:id
  if (route.path.startsWith('/expedientes/') && route.path !== '/expedientes') {
    const expedienteId = route.params.id
    items.push(
      { label: 'Expedientes', route: '/expedientes' },
      { label: `Expediente ${expedienteId}`, route: route.path }
    )
    return items
  }
  
  const routeCrumbs = routeMap[route.path] || []
  return [...items, ...routeCrumbs]
})
</script>

<style scoped>
.breadcrumb-wrapper {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
}

/* 🎯 BREADCRUMB INTEGRADO - Sin conflictos de posicionamiento */
.integrated-breadcrumb-section {
  background: var(--iggsad-surface-25);
  border-bottom: 1px solid var(--iggsad-surface-200);
  padding: var(--iggsad-spacing-sm) 0;
  /* 🔧 FIX: Sin sticky, flujo normal */
}

.breadcrumb-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--iggsad-spacing-xl);
}

.integrated-breadcrumb {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 0.875rem;
}

/* 🎯 Breadcrumb más sutil */
.integrated-breadcrumb :deep(.p-breadcrumb-list) {
  margin: 0;
  padding: 0;
}

.integrated-breadcrumb :deep(.p-breadcrumb-item) {
  color: var(--iggsad-surface-600);
}

.integrated-breadcrumb :deep(.p-breadcrumb-item:last-child) {
  color: var(--iggsad-surface-800);
  font-weight: 500;
}

@media (max-width: 768px) {
  .breadcrumb-container {
    padding: 0 var(--iggsad-spacing-md);
  }
  
  .integrated-breadcrumb {
    font-size: 0.8125rem;
  }
}
</style>