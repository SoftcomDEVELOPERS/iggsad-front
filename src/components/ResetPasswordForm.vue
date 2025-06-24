<template>
  <div class="w-full max-w-md">
    <Toast />
    
    <!-- Información -->
    <div class="text-center mb-6">
      <i class="pi pi-shield text-4xl text-primary-600 mb-4"></i>
      <h3 class="text-lg font-semibold text-slate-800 mb-2">
        Crear Nueva Contraseña
      </h3>
      <p class="text-sm text-slate-600">
        Su nueva contraseña debe ser segura y diferente a la anterior
      </p>
    </div>

    <!-- Formulario -->
    <Form 
      v-slot="$form" 
      :initialValues="formValues" 
      :resolver="formResolver" 
      @submit="onSubmit"
      class="space-y-4">
      
      <!-- Campo Nueva Contraseña -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Nueva Contraseña</label>
        <IconField>
          <InputIcon>
            <i class="pi pi-lock text-slate-400" />
          </InputIcon>
          <Password 
            name="password" 
            placeholder="Ingrese nueva contraseña"
            :feedback="true"
            toggleMask 
            fluid 
            :disabled="isLoading"
            weakLabel="Débil"
            mediumLabel="Media"
            strongLabel="Fuerte"
            promptLabel="Ingrese una contraseña"
          />
        </IconField>
        <Message
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
        >
          <ul class="my-0 px-4 space-y-1 text-sm">
            <li v-for="(error, index) in $form.password.errors" :key="index">
              {{ error.message }}
            </li>
          </ul>
        </Message>
      </div>

      <!-- Campo Confirmar Contraseña -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Confirmar Contraseña</label>
        <IconField>
          <InputIcon>
            <i class="pi pi-lock text-slate-400" />
          </InputIcon>
          <Password 
            name="confirmPassword" 
            placeholder="Confirme nueva contraseña"
            :feedback="false"
            toggleMask 
            fluid 
            :disabled="isLoading"
          />
        </IconField>
        <Message
          v-if="$form.confirmPassword?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
        >
          {{ $form.confirmPassword.error.message }}
        </Message>
      </div>

      <!-- Requisitos de contraseña -->
      <div class="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <h4 class="text-sm font-medium text-slate-700 mb-2">Requisitos de contraseña:</h4>
        <ul class="text-xs text-slate-600 space-y-1">
          <li class="flex items-center">
            <i class="pi pi-check text-green-500 mr-2" v-if="hasMinLength"></i>
            <i class="pi pi-times text-red-500 mr-2" v-else></i>
            Mínimo 8 caracteres
          </li>
          <li class="flex items-center">
            <i class="pi pi-check text-green-500 mr-2" v-if="hasLowerCase"></i>
            <i class="pi pi-times text-red-500 mr-2" v-else></i>
            Al menos una letra minúscula
          </li>
          <li class="flex items-center">
            <i class="pi pi-check text-green-500 mr-2" v-if="hasUpperCase"></i>
            <i class="pi pi-times text-red-500 mr-2" v-else></i>
            Al menos una letra mayúscula
          </li>
          <li class="flex items-center">
            <i class="pi pi-check text-green-500 mr-2" v-if="hasNumber"></i>
            <i class="pi pi-times text-red-500 mr-2" v-else></i>
            Al menos un número
          </li>
          <li class="flex items-center">
            <i class="pi pi-check text-green-500 mr-2" v-if="hasSpecialChar"></i>
            <i class="pi pi-times text-red-500 mr-2" v-else></i>
            Al menos un carácter especial
          </li>
        </ul>
      </div>

      <!-- Botón de envío -->
      <Button 
        type="submit" 
        label="Cambiar Contraseña" 
        :loading="isLoading" 
        :disabled="isLoading || !isFormValid"
        fluid
        class="mt-6"
        icon="pi pi-save"
      />

      <!-- Enlaces adicionales -->
      <div class="text-center space-y-2 mt-6">
        <Button 
          @click="$router.push('/login')"
          text
          label="← Volver al login"
          fluid
          class="text-slate-600"
          :disabled="isLoading"
        />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/composables/useToast'
import { resetPassword } from '@/services/auth.services'

// PrimeVue components
import Password from 'primevue/password'
import Button from 'primevue/button'

const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

// Estado de loading
const isLoading = ref(false)
const currentPassword = ref('')
const currentConfirmPassword = ref('')

// Valores iniciales
const formValues = ref({
  password: '',
  confirmPassword: ''
})

// Computed para validaciones en tiempo real
const hasMinLength = computed(() => currentPassword.value.length >= 8)
const hasLowerCase = computed(() => /[a-z]/.test(currentPassword.value))
const hasUpperCase = computed(() => /[A-Z]/.test(currentPassword.value))
const hasNumber = computed(() => /\d/.test(currentPassword.value))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(currentPassword.value))

const isFormValid = computed(() => {
  return hasMinLength.value && 
         hasLowerCase.value && 
         hasUpperCase.value && 
         hasNumber.value && 
         hasSpecialChar.value &&
         currentPassword.value === currentConfirmPassword.value &&
         currentPassword.value.length > 0
})

// Resolver de validación
const formResolver = zodResolver(
  z.object({
    password: z
      .string()
      .min(8, { message: 'Mínimo 8 caracteres.' })
      .refine(v => /[a-z]/.test(v), { message: 'Al menos una letra minúscula.' })
      .refine(v => /[A-Z]/.test(v), { message: 'Al menos una letra mayúscula.' })
      .refine(v => /\d/.test(v), { message: 'Al menos un número.' })
      .refine(v => /[!@#$%^&*(),.?":{}|<>]/.test(v), { message: 'Al menos un carácter especial.' }),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })
)

// Composables
const router = useRouter()
const { showWarn, showError, showSuccess } = useToast()

// Watchers para actualizar el estado en tiempo real
watch(() => formValues.value.password, (newVal) => {
  currentPassword.value = newVal
})

watch(() => formValues.value.confirmPassword, (newVal) => {
  currentConfirmPassword.value = newVal
})

// Función de envío
async function onSubmit(event) {
  // Prevenir doble ejecución
  if (isLoading.value) {
    console.log('🔄 Cambio ya está en proceso, ignorando...')
    return
  }

  // Validar evento
  if (!event || !event.valid || !event.values?.password) {
    console.warn('⚠️ Evento inválido:', event)
    showWarn('Datos inválidos', 'Por favor complete todos los campos correctamente')
    return
  }

  // Validar que las contraseñas coincidan
  if (event.values.password !== event.values.confirmPassword) {
    showWarn('Contraseñas no coinciden', 'Asegúrese de que ambas contraseñas sean idénticas')
    return
  }

  console.log('🔐 Iniciando cambio de contraseña con token')

  try {
    isLoading.value = true
    
    // ✅ Usar el store para mantener consistencia
    const response = await auth.resetPassword(props.token, event.values.password, event.values.confirmPassword)
    
    console.log('✅ Contraseña cambiada exitosamente')
    
    // ✨ Usar el mensaje del backend
    showSuccess(
      'Contraseña actualizada', 
      response.message || 'Su contraseña ha sido cambiada exitosamente. Ya puede iniciar sesión.'
    )
    
    // Navegar al login después de un breve delay
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (error) {
    console.error('❌ Error en cambio de contraseña:', error)
    
    // ✨ Usar el mensaje del backend si está disponible
    let errorMessage = error.message || 'No se pudo cambiar la contraseña'
    
    // Fallback para errores de conexión
    if (error.message && (error.message.includes('Network') || error.message.includes('fetch'))) {
      errorMessage = 'Error de conexión con el servidor'
    }
    
    showError('Error al cambiar contraseña', errorMessage)
    
    // Si el token expiró, redirigir a login
    if (errorMessage.includes('expirado')) {
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
    
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos específicos para el formulario */
.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

/* Ajustes para los iconos en los campos */
:deep(.p-password .p-password-input) {
  padding-left: 2.5rem;
}

/* Animación suave para el icono principal */
.pi-shield {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Estilo para campos deshabilitados */
:deep(.p-password .p-password-input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Estilo para botón deshabilitado */
.p-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animaciones para los checkmarks de requisitos */
.pi-check {
  animation: checkIn 0.3s ease-out;
}

@keyframes checkIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>