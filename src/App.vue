<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <!-- Header con navegación -->
    <div v-if="!isLoginPage" class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo y título -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <!-- Logo -->
              <img 
                src="/logoBalanza.png" 
                alt="Logo Balanza" 
                class="w-10 h-10 object-contain"
                @error="showFallbackIcon = true"
                v-if="!showFallbackIcon"
              />
              <!-- Fallback icon si no se encuentra la imagen -->
              <div 
                v-else
                class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
              >
                <i class="pi pi-balance-scale text-white text-lg"></i>
              </div>
              
              <div>
                <h1 class="text-xl font-bold text-slate-800">Gestión Procesal</h1>
                <p class="text-sm text-slate-500">Sistema Jurídico Integral</p>
              </div>
            </div>
          </div>

          <!-- Navegación principal -->
          <Menubar :model="menuItems">
            <template #start>
              <div class="flex items-center space-x-1">
                <!-- Los items del menú se renderizan aquí -->
              </div>
            </template>
            <template #end>
              <div class="flex items-center space-x-3">
                <Button 
                  icon="pi pi-user" 
                  :label="currentUser"
                  text 
                  class="text-slate-700 hover:text-blue-600"
                />
                <Button 
                  icon="pi pi-sign-out" 
                  text 
                  class="text-slate-700 hover:text-red-600"
                  @click="logout"
                />
              </div>
            </template>
          </Menubar>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Toast global -->
    <Toast position="top-right" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const router = useRouter()
const route = useRoute()
// const auth = useAuthStore()

// Verificar si estamos en la página de login
const isLoginPage = computed(() => route.name === 'Login')

// Usuario actual (simulado)
const currentUser = ref('Juan Pérez')

// Estado para manejar el logo
const showFallbackIcon = ref(false)

// Elementos del menú principal
const menuItems = ref([
  {
    label: 'Casos',
    icon: 'pi pi-folder',
    items: [
      {
        label: 'Todos los Casos',
        icon: 'pi pi-list',
        command: () => router.push('/casos')
      },
      {
        label: 'Nuevo Caso',
        icon: 'pi pi-plus',
        command: () => router.push('/casos/nuevo')
      },
      {
        label: 'Casos Urgentes',
        icon: 'pi pi-exclamation-triangle',
        command: () => router.push('/casos/urgentes')
      },
      {
        separator: true
      },
      {
        label: 'Archivo',
        icon: 'pi pi-archive',
        command: () => router.push('/casos/archivo')
      }
    ]
  },
  {
    label: 'Audiencias',
    icon: 'pi pi-calendar',
    items: [
      {
        label: 'Calendario',
        icon: 'pi pi-calendar',
        command: () => router.push('/audiencias')
      },
      {
        label: 'Próximas Citas',
        icon: 'pi pi-clock',
        command: () => router.push('/audiencias/proximas')
      },
      {
        label: 'Historial',
        icon: 'pi pi-history',
        command: () => router.push('/audiencias/historial')
      }
    ]
  },
  {
    label: 'Documentos',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Biblioteca',
        icon: 'pi pi-book',
        command: () => router.push('/documentos')
      },
      {
        label: 'Plantillas',
        icon: 'pi pi-file-edit',
        command: () => router.push('/documentos/plantillas')
      },
      {
        label: 'Subir Documento',
        icon: 'pi pi-upload',
        command: () => router.push('/documentos/upload')
      }
    ]
  },
  {
    label: 'Clientes',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Lista de Clientes',
        icon: 'pi pi-users',
        command: () => router.push('/clientes')
      },
      {
        label: 'Nuevo Cliente',
        icon: 'pi pi-user-plus',
        command: () => router.push('/clientes/nuevo')
      },
      {
        label: 'Deudores',
        icon: 'pi pi-exclamation-circle',
        command: () => router.push('/clientes/deudores')
      }
    ]
  }
])

// Función de logout
const logout = () => {
  // auth.logout()
  router.push('/login')
}
</script>

<style>
/* Estilos globales personalizados */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Sobrescribir el tema personalizado para el menubar en el header */
.custom-menubar.p-menubar {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.custom-menubar.p-menubar .p-menubar-root-list {
  background: transparent !important;
  gap: 0.5rem;
}

/* Forzar colores oscuros en el menubar del header */
.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link {
  padding: 0.5rem 1rem !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  color: #334155 !important; /* slate-700 - forzar color oscuro */
  background: transparent !important;
}

.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:hover,
.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:focus {
  background: rgba(59, 130, 246, 0.1) !important; /* blue-600 con opacidad */
  color: #2563eb !important; /* blue-600 */
}

.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link .p-menuitem-text {
  color: #334155 !important; /* Forzar texto oscuro */
}

.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link .p-menuitem-icon {
  color: #334155 !important; /* Forzar icono oscuro */
  margin-right: 0.5rem !important;
}

/* Estados hover y focus */
.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:hover .p-menuitem-text,
.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:focus .p-menuitem-text {
  color: #2563eb !important;
}

.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:hover .p-menuitem-icon,
.custom-menubar.p-menubar .p-menuitem .p-menuitem-content .p-menuitem-link:focus .p-menuitem-icon {
  color: #2563eb !important;
}

/* También aplicar a elementos anidados */
.custom-menubar.p-menubar * {
  color: #334155 !important;
}

.custom-menubar.p-menubar .p-menuitem-text {
  color: #334155 !important;
}

.custom-menubar.p-menubar .p-menuitem-icon {
  color: #334155 !important;
}

/* Mejoras para submenús - mantener el tema */
.p-submenu-list {
  min-width: 200px !important;
  margin-top: 0.5rem !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  padding: 0.5rem 0 !important;
}

.p-submenu-list .p-menuitem-link {
  padding: 0.75rem 1rem !important;
  color: #475569 !important; /* slate-600 */
  border-radius: 6px !important;
  margin: 0.25rem !important;
  background: transparent !important;
}

.p-submenu-list .p-menuitem-link:hover {
  background: #f8fafc !important; /* slate-50 */
  color: #2563eb !important; /* blue-600 */
}

.p-submenu-list .p-menuitem-link:focus {
  background: #f1f5f9 !important; /* slate-100 */
  color: #2563eb !important;
  outline: none !important;
}

.p-submenu-list .p-menuitem-link .p-menuitem-text {
  color: inherit !important;
}

.p-submenu-list .p-menuitem-link .p-menuitem-icon {
  color: inherit !important;
  margin-right: 0.5rem !important;
}

/* Separadores */
.p-menuitem-separator {
  margin: 0.5rem 0.25rem !important;
  border-top: 1px solid #e2e8f0 !important; /* slate-200 */
  background: none !important;
}

/* Botones del header - SOLO para el área del usuario */
.p-button.p-button-text {
  border: none !important;
  background: transparent !important;
}

/* Botones del usuario específicamente */
.p-menubar .p-button.p-button-text {
  color: #475569 !important; /* slate-600 */
}

.p-menubar .p-button.p-button-text:hover {
  background: rgba(59, 130, 246, 0.1) !important;
}

.p-menubar .p-button.p-button-text .p-button-label {
  color: inherit !important;
  font-weight: 500 !important;
}

.p-menubar .p-button.p-button-text .p-button-icon {
  color: inherit !important;
}

/* Mejoras para toast */
.p-toast {
  z-index: 1100 !important;
}

.p-toast .p-toast-message {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(226, 232, 240, 0.3) !important;
}

/* Asegurar que todos los textos sean visibles - EXCEPTO botones principales */
.p-component:not(.p-button) {
  color: #334155 !important;
}

/* Los botones principales mantienen su tema original */
.p-button:not(.p-button-text) {
  /* No sobrescribir - usar tema original */
}

/* Solo los botones de texto en el menubar */
.p-menubar .p-button-text {
  color: #475569 !important;
}

/* Estilos específicos para el menú desplegable */
.p-menubar .p-submenu-list {
  background: white !important;
}

.p-menubar .p-submenu-list .p-menuitem {
  background: transparent !important;
}

.p-menubar .p-submenu-list .p-menuitem .p-menuitem-content {
  background: transparent !important;
}

/* Asegurar visibilidad en modo oscuro si existe */
@media (prefers-color-scheme: dark) {
  .p-menubar .p-menuitem-link {
    color: #64748b !important;
  }
  
  .p-submenu-list {
    background: #1e293b !important;
    border-color: #334155 !important;
  }
  
  .p-submenu-list .p-menuitem-link {
    color: #cbd5e1 !important;
  }
}
</style>