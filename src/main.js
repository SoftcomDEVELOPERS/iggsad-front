import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// ===== TEMA MEJORADO =====
import { 
  GestionProcesalTheme, 
  applyIggsadTokens 
} from './themes/primevue-theme.js'

// ===== ESTILOS BASE =====
import './assets/tailwind.css'

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

// ===== APLICAR TOKENS CSS PERSONALIZADOS =====
// 🔧 NUEVO: Inyectar variables CSS para uso directo
try {
  applyIggsadTokens()
} catch (error) {
  console.error('❌ Error aplicando tokens CSS:', error)
}

// ===== REGISTRAR DIRECTIVAS =====

app.directive('tooltip', TooltipDirective)

// ===== REGISTRAR COMPONENTES GLOBALES =====

app.component('Form', Form)
app.component('Message', Message)
app.component('Toast', Toast)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)

// ===== CONFIGURAR TOAST SERVICE =====

try {
  app.use(ToastService, defaultToastConfig)
  console.log('✅ ToastService configurado')
} catch (error) {
  console.error('❌ Error configurando ToastService:', error)
}

// ===== APLICAR ESTILOS TOAST =====

try {
  applyToastStyles()    // Estilos profesionales
  applyToastVariants()  // Variantes especializadas
  console.log('✅ Estilos Toast aplicados')
} catch (error) {
  console.error('❌ Error aplicando estilos Toast:', error)
}

// ===== CONFIGURAR CONFIRMACIÓN =====

app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)

// ===== CONFIGURAR ROUTER Y MONTAR =====

app.use(router)

router.isReady().then(async () => {

  try {
    const authStore = useAuthStore()
    await authStore.checkAuth()
    console.log('🔐 Verificación de autenticación completada. isAuthenticated ->', authStore.isAuthenticated)

    if (authStore.isAuthenticated) {
      router.push({ name: 'Landing Page' })
    } 
  } catch (e) {
    console.error('❌ Error al verificar autenticación:', e)
  }

  // 🔧 MONTAR CON VALIDACIONES
  try {
    app.mount('#app')
    console.log('🚀 Aplicación montada exitosamente tras router.isReady()')
    
    // 🔧 VALIDAR QUE ESTILOS SE APLICARON CORRECTAMENTE
    const toastStyles = document.getElementById('gestion-procesal-toast-styles')
    const iggsadTokens = document.getElementById('iggsad-css-tokens')
    
    if (toastStyles) {
      console.log('✅ Estilos Toast verificados')
    } else {
      console.warn('⚠️ Estilos Toast no encontrados')
    }
    
    if (iggsadTokens) {
      console.log('✅ Tokens CSS Iggsad verificados')
    } else {
      console.warn('⚠️ Tokens CSS no encontrados')
    }
    
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

// ===== DETECTAR MODO DESARROLLO =====
if (import.meta.env.DEV) {
  console.log('🔧 Modo desarrollo - Logs adicionales habilitados')
  
  // Verificar que todas las dependencias críticas estén cargadas
  window.addEventListener('load', () => {
    const checks = {
      'PrimeVue': !!document.querySelector('.p-component'),
      'Tailwind': !!document.querySelector('[class*="bg-"]'),
      'Inter Font': getComputedStyle(document.body).fontFamily.includes('Inter')
    }
    
    Object.entries(checks).forEach(([name, loaded]) => {
      console.log(`${loaded ? '✅' : '❌'} ${name}: ${loaded ? 'Cargado' : 'No encontrado'}`)
    })
  })
}