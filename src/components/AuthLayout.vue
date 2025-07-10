<!-- src/components/AuthLayout.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100
           flex items-center justify-center p-3 sm:p-4 lg:p-6"
  >
    <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
      <Card
        class="shadow-xl sm:shadow-2xl border-0 backdrop-blur-sm bg-white/90 card-enter-active"
      >
        <!-- SLOT HEADER del Card -->
        <template #header>
          <slot name="header" />
        </template>

        <!-- SLOT CONTENT del Card -->
        <template #content>
          <slot name="content" />
        </template>

        <!-- SLOT FOOTER del Card -->
        <template #footer>
          <slot name="footer" />
        </template>
      </Card>

      <!-- Pie de info seguro (se muestra siempre) -->
      <div class="mt-6 sm:mt-8 text-center">
        <div class="bg-white/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-sm">
          <h3 class="text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-3">
            Acceso Seguro
          </h3>
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
import Card from 'primevue/card'
</script>

<!-- <style scoped>
@import '@/styles/auth-layout.css';
</style> -->
