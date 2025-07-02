<template>
  <div id="app">
    <!-- Toast container -->
    <Toast />
    <ConfirmDialog />
    
    <!-- Header principal - SOLO mostrar si NO estamos en login -->
    <header v-if="!isLoginPage" class="iggsad-header">
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
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

// ===== COMPOSABLES =====
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showSuccess, showError } = useToast()

// ===== ESTADO =====
const logoError = ref(false)

// ===== COMPUTED =====
// 🔧 CORREGIDO: Verificar si estamos en la página de login
const isLoginPage = computed(() => {
  return route.name === 'Login' || route.path === '/login'
})

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

</script>

<style>
/* 
 * ===== IMPORTAR ESTILOS SEPARADOS =====
 * Los estilos del layout están en un archivo separado para mejor organización
 */
@import '@/styles/app-layout.css';

/* ===== SOLO ESTILOS ESPECÍFICOS QUE NO ESTÁN EN EL ARCHIVO SEPARADO ===== */

/* Estilo específico para el nombre de usuario */
.iggsad-user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--iggsad-surface-600);
  margin-right: var(--iggsad-spacing-sm);
  padding: var(--iggsad-spacing-xs) var(--iggsad-spacing-sm);
  background: var(--iggsad-surface-100);
  border-radius: var(--iggsad-radius-sm);
  transition: var(--iggsad-transition-fast);
}

.iggsad-user-name:hover {
  background: var(--iggsad-surface-200);
  color: var(--iggsad-surface-700);
}

/* Responsive para el nombre de usuario */
@media (max-width: 768px) {
  .iggsad-user-name {
    display: none;
  }
}

/* ===== TRANSICIONES DE PÁGINA ===== */
.router-view {
  transition: var(--iggsad-transition-normal);
}

/* Evitar que la página salte cuando aparece/desaparece el header */
.iggsad-main-content {
  min-height: calc(100vh - 80px); /* Altura aproximada del header */
}

/* Cuando estamos en login, usar toda la altura */
.iggsad-main-content:only-child {
  min-height: 100vh;
}

/* ===== ESTADOS DE LA APLICACIÓN ===== */

/* Estado de carga global */
.app-loading .iggsad-header {
  opacity: 0.7;
  pointer-events: none;
}

.app-loading .iggsad-main-content {
  filter: blur(1px);
}

/* Estado offline */
.app-offline .iggsad-header::after {
  content: '⚠️ Sin conexión';
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--iggsad-warning-600, #f59e0b);
  color: white;
  padding: var(--iggsad-spacing-xs) var(--iggsad-spacing-md);
  border-radius: 0 0 var(--iggsad-radius-sm) var(--iggsad-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1001;
}
</style>