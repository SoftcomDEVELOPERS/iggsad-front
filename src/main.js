import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserProfile } from '@/composables/useUserProfile'

// ===== ESTILOS BASE =====
import './assets/tailwind.css'
import './styles/index.css'
import './styles/app-layout.css'  

// ===== TEMA MEJORADO =====
import { GestionProcesalTheme } from './themes/primevue-theme.js'

// ===== PRIMEVUE CORE =====
import PrimeVue from 'primevue/config'
import TooltipDirective from 'primevue/tooltip'
import 'primeicons/primeicons.css'

// ===== FORMS PLUGIN =====
import { Form } from '@primevue/forms';

// ===== SISTEMA TOAST =====

import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import { applyToastStyles } from '@/styles/toast.styles.js'
import { applyToastVariants } from '@/styles/toast.variants.js'
import { defaultToastConfig } from '@/styles/toast.config.js'

// ===== CONFIRMACIÓN =====

import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'

// ===== COMPONENTES GLOBALES =====

import Message from 'primevue/message';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// ===== SERVICIOS =====

import { initializeHttpInterceptor } from '@/services/httpInterceptor'
import { useAuthStore } from '@/stores/auth'

// ===== CREAR APLICACIÓN =====
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// ===== INICIALIZAR INTERCEPTOR =====
initializeHttpInterceptor()

// ===== CONFIGURAR PRIMEVUE =====
try {
  app.use(PrimeVue, {
    theme: {
      preset: GestionProcesalTheme,    // 🔧 TEMA MEJORADO
      options: {
        prefix: 'p',                   
        darkModeSelector: '.p-dark',   
        cssLayer: false                
      }
    }
  })
  console.log('✅ PrimeVue configurado con tema Gestión Procesal')
} catch (error) {
  console.error('❌ Error configurando PrimeVue:', error)
}

// ===== REGISTRAR DIRECTIVAS =====
app.directive('tooltip', TooltipDirective)

// ===== REGISTRAR SERVICIOS =====
app.use(ToastService, defaultToastConfig)
app.use(ConfirmationService)

// ===== REGISTRAR PLUGINS =====
app.component('Form', Form)

// ===== REGISTRAR COMPONENTES GLOBALES =====
app.component('Toast', Toast)
app.component('Message', Message)
app.component('ConfirmDialog', ConfirmDialog)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('DataTable', DataTable)
app.component('Column', Column)



// ===== APLICAR ESTILOS TOAST =====
try {
  applyToastStyles()    // Estilos profesionales
  applyToastVariants()  // Variantes especializadas
  console.log('✅ Estilos Toast aplicados')
} catch (error) {
  console.error('❌ Error aplicando estilos Toast:', error)
}

// ===== CONFIGURAR ROUTER Y MONTAR =====
app.use(router)

router.isReady().then(async () => {

  try {
    const authStore = useAuthStore()
    await authStore.checkAuth()
    console.log('✅ Router listo y estado de autenticación verificado')

    if (authStore.isAuthenticated) {
      const { loadProfile } = useUserProfile()
      console.log('🔐 Usuario autenticado, cargando perfil...')
      await loadProfile()
      router.push({ name: 'Dashboard' })
     }
  } catch (e) {
    console.error('❌ Error al verificar autenticación:', e)
  }

  // 🔧 MONTAR CON VALIDACIONES
  try {
    app.mount('#app')
    console.log('🚀 Aplicación montada exitosamente tras router.isReady()')
    
  } catch (error) {
    console.error('❌ Error montando aplicación:', error)
  }
})

// ===== MANEJO DE ERRORES GLOBALES =====
// 🔧 NUEVO: Capturar errores no manejados
app.config.errorHandler = (err, vm, info) => {
  console.error('❌ Error global capturado:', err)
  console.error('📍 Información del error:', info)
  
  // No bloquear la aplicación por errores de estilos
  if (err.message?.includes('toast') || err.message?.includes('theme')) {
    console.warn('⚠️ Error de estilos detectado, continuando...')
    return
  }
}
