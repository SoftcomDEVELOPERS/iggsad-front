<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <!-- Header con navegación -->
    <div v-if="!isLoginPage" class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo y título -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <i class="pi pi-balance-scale text-white text-lg"></i>
              </div>
              <div>
                <h1 class="text-xl font-bold text-slate-800">Gestión Procesal</h1>
                <p class="text-sm text-slate-500">Sistema Jurídico Integral</p>
              </div>
            </div>
          </div>

          <!-- Navegación principal -->
          <Menubar :model="menuItems" class="border-0 bg-transparent text-primary-600">
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
                  class="text-slate-600 hover:text-primary-600"
                />
                <Button 
                  icon="pi pi-sign-out" 
                  text 
                  class="text-slate-600 hover:text-red-600"
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
import { useAuthStore } from '@/stores/auth'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// Verificar si estamos en la página de login
const isLoginPage = computed(() => route.name === 'Login')

// Usuario actual (simulado)
const currentUser = ref('Juan Pérez')

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
  auth.logout()
  router.push('/login')
}
</script>

<style>
/* Estilos globales personalizados */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mejoras para el menubar */
.p-menubar {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.p-menubar .p-menubar-root-list {
  background: transparent !important;
  gap: 0.5rem;
}

.p-menubar .p-menuitem-link {
  padding: 0.5rem 1rem !important;
  border-radius: 6px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.p-menubar .p-menuitem-link:hover {
  background: rgb(59 130 246 / 0.1) !important;
  color: rgb(59 130 246) !important;
}

/* Mejoras para submenús */
.p-submenu-list {
  min-width: 200px !important;
  margin-top: 0.5rem !important;
}

.p-submenu-list .p-menuitem-link {
  padding: 0.75rem 1rem !important;
  color: rgb(51 65 85) !important;
}

.p-submenu-list .p-menuitem-link:hover {
  background: rgb(248 250 252) !important;
  color: rgb(59 130 246) !important;
}

/* Separadores */
.p-menuitem-separator {
  margin: 0.5rem 0 !important;
  border-top: 1px solid rgb(226 232 240) !important;
}

/* Mejoras para toast */
.p-toast {
  z-index: 1100 !important;
}

.p-toast .p-toast-message {
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgb(226 232 240 / 0.3) !important;
}
</style>