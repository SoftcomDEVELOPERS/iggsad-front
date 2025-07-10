<template>
  <div id="app">
    <!-- Toast container -->
    <Toast />
    <ConfirmDialog />
    
    <!-- Header principal - SOLO mostrar si NO estamos en login -->
    <header v-if="!isPublicPage" class="iggsad-header">
      <div class="iggsad-header-content">
        <!-- Logo y branding -->
        <div class="iggsad-brand">
          <img 
            src="/images/logoBalanza.png" 
            alt="Logo" 
            class="iggsad-logo"
            @error="logoError = true"
            v-if="!logoError"
          />
          <i v-else class="pi pi-balance-scale iggsad-logo-fallback"></i>
          
          <div class="iggsad-brand-text">
            <h1 class="iggsad-brand-title">Gestión Procesal</h1>
            <p class="iggsad-brand-subtitle">Sistema Jurídico Integral</p>
          </div>
        </div>

        <!-- Navegación principal -->
        <Menubar 
          :model="menuItems" 
          class="iggsad-main-navigation"
        >
          <template #end>
            <div class="iggsad-user-controls">
              <!-- Mostrar nombre del usuario si está disponible -->
              <span v-if="authStore.user" class="iggsad-user-name">
                {{ authStore.user.firstName || authStore.user.username || 'Usuario' }}
              </span>

              <DarkModeToggle />
              
              <Button 
                icon="pi pi-user" 
                text 
                aria-label="Perfil usuario"
                class="iggsad-user-button"
                @click="goToProfile"
              />
              <Button 
                icon="pi pi-cog" 
                text 
                aria-label="Configuración"
                class="iggsad-user-button"
                @click="goToSettings"
              />
              <Button 
                icon="pi pi-sign-out" 
                text 
                aria-label="Cerrar sesión"
                class="iggsad-user-button"
                @click="handleLogout"
              />
            </div>
          </template>
        </Menubar>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="iggsad-main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

import DarkModeToggle from '@/components/DarkModeToggle.vue'
import { useAppLayout } from '@/composables/useAppLayout'

// ===== COMPOSABLES =====
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showSuccess, showError } = useToast()
const { initializeTheme } = useAppLayout()

// ===== ESTADO =====
const logoError = ref(false)

// ===== COMPUTED =====
// 🔧 CORREGIDO: Verificar si estamos en la página de login
const isPublicPage = computed(() => route.meta.public === true)

// ===== MENÚ DE NAVEGACIÓN =====
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
        separator: true
      },
      {
        label: 'Casos Urgentes',
        icon: 'pi pi-exclamation-triangle',
        command: () => router.push('/casos/urgentes')
      },
      {
        label: 'Archivo',
        icon: 'pi pi-archive',
        command: () => router.push('/casos/archivo')
      }
    ]
  },
  {
    label: 'Expedientes', // ✨ NUEVA SECCIÓN
    icon: 'pi pi-folder-open',
    items: [
      {
        label: 'Todos los Expedientes',
        icon: 'pi pi-list',
        command: () => router.push('/expedientes')
      },
      {
        label: 'Nuevo Expediente',
        icon: 'pi pi-plus',
        command: () => router.push('/expedientes/nuevo')
      },
      {
        separator: true
      },
      {
        label: 'Búsqueda Avanzada',
        icon: 'pi pi-search',
        command: () => router.push('/expedientes?advanced=true')
      },
      {
        label: 'Expedientes Urgentes',
        icon: 'pi pi-exclamation-triangle',
        command: () => router.push('/expedientes?urgent=true')
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
        separator: true
      },
      {
        label: 'Subir Documento',
        icon: 'pi pi-upload',
        command: () => router.push('/documentos/subir')
      }
    ]
  },
  {
    label: 'Clientes',
    icon: 'pi pi-users',
    items: [
      {
        label: 'Lista de Clientes',
        icon: 'pi pi-list',
        command: () => router.push('/clientes')
      },
      {
        label: 'Nuevo Cliente',
        icon: 'pi pi-user-plus',
        command: () => router.push('/clientes/nuevo')
      },
      {
        separator: true
      },
      {
        label: 'Deudores',
        icon: 'pi pi-exclamation-circle',
        command: () => router.push('/clientes/deudores')
      }
    ]
  }
])

// ===== MÉTODOS =====
const handleLogout = async () => {
  try {
    await authStore.logout()
    showSuccess('Sesión cerrada', 'Has cerrado sesión correctamente')
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    showError('Error', 'Error al cerrar sesión')
  }
}

const goToProfile = () => {
  router.push('/perfil')
}

const goToSettings = () => {
  router.push('/configuracion')
}

onMounted(() => {
  initializeTheme()
})

</script>

<style>
@import '@/styles/app-layout.css';
</style>