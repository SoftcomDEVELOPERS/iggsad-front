<!-- src/views/Login.vue -->
<template>
  <AuthLayout>
    <template #header>
      <div class="text-center px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700">
        <div class="mb-4 sm:mb-6">
          <div class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto flex items-center justify-center">
            <img
              src="/images/logoBalanza.png"
              alt="Gestión Procesal Logo"
              class="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Gestión Procesal</h1>
        <p class="text-primary-100 text-sm sm:text-base font-medium">Acceso a Gestión Procesal</p>
      </div>
    </template>

    <template #content>
      <div class="px-4 sm:px-6 py-6 sm:py-8 flex justify-center">
        <LoginForm />
      </div>
    </template>

    <template #footer>
      <div class="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 text-center border-t">
        <p class="text-xs sm:text-sm text-slate-500">
          © 2025 Gestión Procesal. Todos los derechos reservados.
        </p>
        <!-- <div class="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
          <Button
            text
            size="small"
            class="text-xs sm:text-sm text-slate-400 hover:text-primary-600 p-1"
          >
            Términos y Condiciones
          </Button>
          <span class="text-slate-300 hidden sm:inline">•</span>
          <Button
            text
            size="small"
            class="text-xs sm:text-sm text-slate-400 hover:text-primary-600 p-1"
          >
            Política de Privacidad
          </Button>
        </div> -->
      </div>
    </template>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/components/AuthLayout.vue'
import LoginForm from '@/components/LoginForm.vue'
import Button from 'primevue/button'
</script>



<style scoped>
/* Animaciones y efectos adicionales */
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

/* Efecto de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Mejoras para el gradiente */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Sombras personalizadas responsivas */
.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

@media (min-width: 640px) {
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
}

/* Hover effects para botones del footer */
:deep(.p-button-text:hover) {
  background: transparent !important;
}

/* Mejoras responsive para el card */
@media (max-width: 640px) {
  :deep(.p-card) {
    margin: 0.5rem;
  }
  
  :deep(.p-card .p-card-header) {
    border-radius: 0.75rem 0.75rem 0 0;
  }
}

/* Optimización para pantallas muy pequeñas */
@media (max-width: 375px) {
  .min-h-screen {
    padding: 0.75rem;
  }
}

/* Mejoras para tablets */
@media (min-width: 768px) and (max-width: 1024px) {
  .max-w-md {
    max-width: 28rem;
  }
}

/* Mejoras para pantallas grandes */
@media (min-width: 1024px) {
  .card-enter-active {
    animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>