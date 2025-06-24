<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center p-3 sm:p-4 lg:p-6">
    <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <Card class="shadow-xl sm:shadow-2xl border-0 backdrop-blur-sm bg-white/90 card-enter-active">
        <template #header>
          <div class="text-center px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700">
            <!-- Logo/Icono -->
            <div class="mb-4 sm:mb-6">
              <div class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <img 
                  src="/logoBalanza.png" 
                  alt="Gestión Procesal Logo" 
                  class="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </div>
            
            <!-- Título -->
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Nueva Contraseña</h1>
            <p class="text-primary-100 text-sm sm:text-base font-medium">Establezca una contraseña segura</p>
          </div>
        </template>
        
        <template #content>
          <div class="px-4 sm:px-6 py-6 sm:py-8">
            <ResetPasswordForm :token="resetToken" />
          </div>
        </template>
        
        <template #footer>
          <div class="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 text-center border-t">
            <div class="text-xs text-slate-500">
              Su nueva contraseña debe cumplir con los requisitos de seguridad
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Card from 'primevue/card'
import ResetPasswordForm from '@/components/ResetPasswordForm.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { showError } = useToast()

const resetToken = ref('')

onMounted(async () => {
  resetToken.value = route.query.token || ''
  
  if (!resetToken.value) {
    showError('Token inválido', 'El enlace de recuperación no es válido')
    router.push('/login')
    return
  }
  
  // Verificar que el token sea válido usando el store
  try {
    await auth.verifyResetToken(resetToken.value)
    console.log('✅ Token de reset válido')
  } catch (error) {
    console.error('❌ Token de reset inválido:', error)
    showError('Enlace expirado', 'El enlace de recuperación ha expirado o no es válido')
    router.push('/login') // Volver al login si el token no es válido
  }
})
</script>

<style scoped>
/* Reutilizar los mismos estilos del Login */
.card-enter-active {
  animation: slideInUp 0.6s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (min-width: 640px) {
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
}
</style>