import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// ===== ESTILOS BASE =====
import './assets/tailwind.css'
import './styles/index.css'  

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

// ===== VALIDACIONES POST-MOUNT =====
// 🔧 CORREGIDO: Ejecutar validaciones DESPUÉS de que Vue renderice
function runPostMountValidations() {
  // Esperar un tick para que Vue termine de renderizar
  setTimeout(() => {
    const checks = {
      'PrimeVue': !!document.querySelector('.p-component'),
      'Tailwind': !!document.querySelector('[class*="bg-"], [class*="text-"], [class*="flex"], [class*="grid"]'),
      'Inter Font': getComputedStyle(document.body).fontFamily.includes('Inter'),
      'Toast Styles': !!document.getElementById('gestion-procesal-toast-styles'),
      'Iggsad Tokens': !!document.getElementById('iggsad-css-tokens'),
      'Router View': !!document.querySelector('#app router-view, #app > main'),
      'Menubar': !!document.querySelector('.p-menubar')
    }
    
    console.log('\n🔍 === VALIDACIÓN DEL SISTEMA ===')
    Object.entries(checks).forEach(([name, loaded]) => {
      console.log(`${loaded ? '✅' : '❌'} ${name}: ${loaded ? 'Cargado' : 'No encontrado'}`)
    })
    
    // Validaciones específicas adicionales
    if (checks['PrimeVue']) {
      const primeComponents = document.querySelectorAll('.p-component').length
      console.log(`📊 Componentes PrimeVue encontrados: ${primeComponents}`)
    }
    
    if (checks['Tailwind']) {
      const tailwindClasses = document.querySelectorAll('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"], [class*="flex"], [class*="grid"]').length
      console.log(`📊 Elementos con clases Tailwind: ${tailwindClasses}`)
    }
    
    // Verificar tokens CSS específicos
    const rootStyles = getComputedStyle(document.documentElement)
    const iggsadPrimary = rootStyles.getPropertyValue('--iggsad-primary-600')
    const iggsadSurface = rootStyles.getPropertyValue('--iggsad-surface-white')
    
    if (iggsadPrimary) {
      console.log(`🎨 Token --iggsad-primary-600: ${iggsadPrimary}`)
    }
    if (iggsadSurface) {
      console.log(`🎨 Token --iggsad-surface-white: ${iggsadSurface}`)
    }
    
    console.log('=== FIN VALIDACIÓN ===\n')
  }, 100) // 100ms es suficiente para que Vue renderice
}

// ===== DETECTAR MODO DESARROLLO =====
if (import.meta.env.DEV) {
  console.log('🔧 Modo desarrollo - Logs adicionales habilitados')
  
  // Ejecutar validaciones después del mount
  router.isReady().then(() => {
    // Esperar a que el router haya terminado de cargar la primera ruta
    setTimeout(runPostMountValidations, 200)
  })
  
  // También ejecutar cuando la página esté completamente cargada
  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      setTimeout(runPostMountValidations, 300)
    })
  } else {
    // Si ya está cargada, ejecutar inmediatamente
    setTimeout(runPostMountValidations, 100)
  }
}