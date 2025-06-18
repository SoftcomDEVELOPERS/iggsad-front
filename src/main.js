// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { GestionProcesalTheme } from './themes/primevue-theme.js'

// Importa Tailwind (creado por ti en assets)
import './assets/tailwind.css'

// PrimeVue core
import PrimeVue from 'primevue/config'

// PrimeVue componentes globales
import 'primeicons/primeicons.css'

// Forms (plugin oficial)
import { Form } from '@primevue/forms';

// Toast (servicio + componente visual)
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

// Otros componentes
import Message from 'primevue/message';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// ✨ NUEVO: Importar interceptor HTTP y store de auth
import { initializeHttpInterceptor } from '@/services/httpInterceptor'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// ✨ NUEVO: Inicializar el interceptor HTTP antes que todo
initializeHttpInterceptor()

// Función para inicializar la aplicación
const initializeApp = async () => {
  try {
    // ✨ NUEVO: Verificar autenticación al iniciar la app
    const authStore = useAuthStore()
    await authStore.checkAuth()
    console.log('🔐 Verificación de autenticación completada')
    
  } catch (error) {
    console.error('❌ Error al inicializar autenticación:', error)
  } finally {
    // Continuar con la inicialización normal
    app.use(router)

    // Configuración de PrimeVue + tema personalizado
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

    // registra globalmente los componentes de Forms
    app.component('Form', Form)
    app.component('Message', Message)
    app.component('Toast', Toast)
    app.component('IconField', IconField)
    app.component('InputIcon', InputIcon)

    app.use(ToastService)

    app.mount('#app')
    console.log('🚀 Aplicación montada exitosamente')
  }
}

// Inicializar la aplicación
initializeApp()