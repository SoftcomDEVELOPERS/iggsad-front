<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center p-3 sm:p-4 lg:p-6">
    <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <Card class="shadow-xl sm:shadow-2xl border-0 backdrop-blur-sm bg-white/90 card-enter-active">
        <template #header>
          <div class="text-center px-4 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700">
            <!-- Logo/Icono -->
            <div class="mb-4 sm:mb-6">
              <div class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <!-- Aquí va tu logo existente -->
                <img 
                  src="/logoBalanza.png" 
                  alt="Gestión Procesal Logo" 
                  class="w-full h-full object-contain drop-shadow-lg"
                />
                <!-- Fallback si no tienes la imagen aún -->
                <!-- <i class="pi pi-balance-scale text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg"></i> -->
              </div>
            </div>
            
            <!-- Título -->
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
            <div class="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
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
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Información adicional -->
      <div class="mt-6 sm:mt-8 text-center">
        <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm">
          <h3 class="text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-3">Acceso Seguro</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
            <div class="flex items-center justify-center space-x-1 sm:space-x-2 py-1">
              <i class="pi pi-shield text-green-600 text-sm sm:text-base"></i>
              <span>Cifrado SSL</span>
            </div>
            <div class="flex items-center justify-center space-x-1 sm:space-x-2 py-1">
              <i class="pi pi-lock text-blue-600 text-sm sm:text-base"></i>
              <span>Datos Protegidos</span>
            </div>
            <div class="flex items-center justify-center space-x-1 sm:space-x-2 py-1">
              <i class="pi pi-verified text-purple-600 text-sm sm:text-base"></i>
              <span>LOPD Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
import Card from "primevue/card";
import Button from "primevue/button";
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