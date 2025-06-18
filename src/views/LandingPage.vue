<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header de bienvenida -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">
            Bienvenido al Sistema de Gestión Procesal
          </h1>
          <p class="text-slate-600">
            Dashboard principal - {{ new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-slate-500">Último acceso</p>
          <p class="text-slate-700 font-medium">{{ lastAccess }}</p>
        </div>
      </div>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <i class="pi pi-folder text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.totalCases }}</p>
              <p class="text-sm text-slate-600">Casos Activos</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <i class="pi pi-calendar text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.upcomingHearings }}</p>
              <p class="text-sm text-slate-600">Audiencias Próximas</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
              <i class="pi pi-exclamation-triangle text-amber-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.urgentCases }}</p>
              <p class="text-sm text-slate-600">Casos Urgentes</p>
            </div>
          </div>
        </template>
      </Card>

      <Card class="border border-slate-200 hover:shadow-lg transition-shadow">
        <template #content>
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <i class="pi pi-users text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-slate-800">{{ stats.totalClients }}</p>
              <p class="text-sm text-slate-600">Clientes</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Contenido principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Casos recientes -->
      <div class="lg:col-span-2">
        <Card>
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800">Casos Recientes</h3>
              <Button 
                icon="pi pi-external-link" 
                text 
                size="small"
                @click="$router.push('/casos')"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-4">
              <div 
                v-for="caso in recentCases" 
                :key="caso.id"
                class="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div class="flex items-center space-x-3">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    caso.priority === 'urgent' ? 'bg-red-500' : 
                    caso.priority === 'high' ? 'bg-amber-500' : 'bg-green-500'
                  ]"></div>
                  <div>
                    <p class="font-medium text-slate-800">{{ caso.title }}</p>
                    <p class="text-sm text-slate-600">{{ caso.client }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm text-slate-500">{{ caso.lastUpdate }}</p>
                  <span :class="[
                    'text-xs px-2 py-1 rounded-full',
                    caso.status === 'active' ? 'bg-green-100 text-green-800' :
                    caso.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  ]">
                    {{ caso.statusText }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <!-- Panel lateral -->
      <div class="space-y-6">
        <!-- Próximas audiencias -->
        <Card>
          <template #header>
            <div class="flex items-center justify-between p-6 pb-0">
              <h3 class="text-lg font-semibold text-slate-800">Próximas Audiencias</h3>
              <Button 
                icon="pi pi-external-link" 
                text 
                size="small"
                @click="$router.push('/audiencias')"
              />
            </div>
          </template>
          <template #content>
            <div class="space-y-3">
              <div 
                v-for="hearing in upcomingHearings" 
                :key="hearing.id"
                class="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
              >
                <p class="font-medium text-slate-800 text-sm">{{ hearing.case }}</p>
                <p class="text-xs text-slate-600">{{ hearing.date }} - {{ hearing.time }}</p>
                <p class="text-xs text-blue-600">{{ hearing.location }}</p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Acciones rápidas -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-800 p-6 pb-0">Acciones Rápidas</h3>
          </template>
          <template #content>
            <div class="space-y-2">
              <Button 
                label="Nuevo Caso" 
                icon="pi pi-plus" 
                fluid 
                outlined
                @click="$router.push('/casos/nuevo')"
              />
              <Button 
                label="Subir Documento" 
                icon="pi pi-upload" 
                fluid 
                outlined
                @click="$router.push('/documentos/upload')"
              />
              <Button 
                label="Nuevo Cliente" 
                icon="pi pi-user-plus" 
                fluid 
                outlined
                @click="$router.push('/clientes/nuevo')"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

// Datos simulados
const stats = ref({
  totalCases: 147,
  upcomingHearings: 12,
  urgentCases: 5,
  totalClients: 89
})

const lastAccess = ref('14 Jun 2025, 09:30')

const recentCases = ref([
  {
    id: 1,
    title: 'Demanda Civil - Incumplimiento Contractual',
    client: 'García López, María',
    lastUpdate: 'Hace 2 horas',
    priority: 'high',
    status: 'active',
    statusText: 'Activo'
  },
  {
    id: 2,
    title: 'Proceso Ejecutivo - Deuda Comercial',
    client: 'Empresas del Norte S.L.',
    lastUpdate: 'Ayer',
    priority: 'urgent',
    status: 'pending',
    statusText: 'Pendiente'
  },
  {
    id: 3,
    title: 'Divorcio Contencioso',
    client: 'Martín Rodríguez, Juan',
    lastUpdate: 'Hace 3 días',
    priority: 'normal',
    status: 'active',
    statusText: 'Activo'
  },
  {
    id: 4,
    title: 'Reclamación de Cantidad',
    client: 'Inversiones Beta S.A.',
    lastUpdate: 'Hace 1 semana',
    priority: 'normal',
    status: 'review',
    statusText: 'En revisión'
  }
])

const upcomingHearings = ref([
  {
    id: 1,
    case: 'Demanda Civil #2024-001',
    date: '15 Jun 2025',
    time: '10:00',
    location: 'Juzgado 1ª Instancia Nº 3'
  },
  {
    id: 2,
    case: 'Proceso Ejecutivo #2024-045',
    date: '18 Jun 2025',
    time: '12:30',
    location: 'Juzgado Mercantil Nº 1'
  },
  {
    id: 3,
    case: 'Divorcio #2024-023',
    date: '22 Jun 2025',
    time: '09:15',
    location: 'Juzgado Familia Nº 2'
  }
])

onMounted(() => {
  // Aquí podrías cargar datos reales desde tu API
  console.log('Dashboard cargado')
})
</script>

<style scoped>
/* Animaciones suaves para las tarjetas */
.transition-shadow {
  transition: box-shadow 0.2s ease-in-out;
}

.transition-colors {
  transition: background-color 0.2s ease-in-out;
}

/* Efectos hover personalizados */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>