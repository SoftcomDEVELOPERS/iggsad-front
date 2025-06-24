// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { GestionProcesalTheme } from './themes/primevue-theme.js'

// Importa Tailwind
import './assets/tailwind.css'

// PrimeVue core
import PrimeVue from 'primevue/config'
import TooltipDirective from 'primevue/tooltip'
// PrimeVue componentes globales
import 'primeicons/primeicons.css'
// Forms plugin
import { Form } from '@primevue/forms';
// Toast
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import { applyToastStyles } from '@/styles/toast.styles.js'
import { applyToastVariants } from '@/styles/toast.variants.js'
import { defaultToastConfig } from '@/styles/toast.config.js'

// Otros componentes
import Message from 'primevue/message';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// HTTP interceptor
import { initializeHttpInterceptor } from '@/services/httpInterceptor'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Inicializar interceptor antes de todo
initializeHttpInterceptor()

// Registrar PrimeVue y plugins
app.use(PrimeVue, {
  theme: {
    preset: GestionProcesalTheme,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false
    }
  }
})

// Registrar directiva tooltip
app.directive('tooltip', TooltipDirective)

app.component('Form', Form)
app.component('Message', Message)
app.component('Toast', Toast)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)

// ✅ Configurar ToastService solo con la configuración
app.use(ToastService, defaultToastConfig)

// ✅ Aplicar estilos por separado (estas son funciones que manipulan el DOM)
applyToastStyles()
applyToastVariants()

// Conectar router y montar tras estar listo
app.use(router)
router.isReady().then(async () => {
  // Verificar autenticación antes de mostrar la App
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

  app.mount('#app')
  console.log('🚀 Aplicación montada exitosamente tras router.isReady()')
})