<template>
  <div class="w-full max-w-md">
    <Toast />
    
    <!-- Modo Login -->
    <Form 
      v-if="!isResetMode"
      v-slot="$form" 
      :initialValues="loginValues" 
      :resolver="loginResolver" 
      @submit="onLoginSubmit" 
      class="space-y-4">
      
      <!-- Campo Usuario -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Usuario</label>
        <IconField>
          <InputIcon>
            <i class="pi pi-user text-slate-400" />
          </InputIcon>
          <InputText 
            name="email" 
            type="text" 
            placeholder="Ingrese su usuario" 
            autofocus 
            fluid 
            class="pl-10"
            :disabled="isLoginLoading"
          />
        </IconField>
        <Message
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
        >
          {{ $form.email.error.message }}
        </Message>
      </div>

      <!-- Campo Contraseña -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Contraseña</label>
        <IconField>
          <InputIcon>
            <i class="pi pi-lock text-slate-400" />
          </InputIcon>
          <Password 
            name="password" 
            placeholder="Ingrese su contraseña" 
            :feedback="false" 
            toggleMask 
            fluid 
            :disabled="isLoginLoading"
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

      <!-- Botón de login -->
      <Button 
        type="submit" 
        severity="secondary" 
        label="Iniciar Sesión" 
        :loading="isLoginLoading" 
        :disabled="isLoginLoading"
        fluid
        class="mt-6"
      />

      <!-- Enlaces adicionales -->
      <div class="text-center mt-4">
        <Button 
          @click="toggleResetMode"
          text
          class="text-sm text-primary-600 hover:text-primary-700 p-0"
          :disabled="isLoginLoading"
        >
          ¿Olvidó su contraseña?
        </Button>
      </div>
    </Form>

    <!-- Modo Reset Password -->
    <Form 
      v-else
      v-slot="$form" 
      :initialValues="resetValues" 
      :resolver="resetResolver" 
      @submit="onResetSubmit"
      class="space-y-4">
      
      <!-- Información -->
      <div class="text-center mb-6">
        <i class="pi pi-envelope text-3xl text-primary-600 mb-3"></i>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">
          Recuperar Contraseña
        </h3>
        <p class="text-sm text-slate-600">
          Ingrese su email para recibir un enlace de recuperación
        </p>
      </div>

      <!-- Campo Email -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Email</label>
        <IconField>
          <InputIcon>
            <i class="pi pi-envelope text-slate-400" />
          </InputIcon>
          <InputText 
            name="email" 
            type="email" 
            placeholder="ejemplo@correo.com" 
            autofocus 
            fluid 
            class="pl-10"
            :disabled="isResetLoading"
          />
        </IconField>
        <Message
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
          class="mt-1"
        >
          {{ $form.email.error.message }}
        </Message>
      </div>

      <!-- Botones -->
      <div class="space-y-3">
        <Button 
          type="submit" 
          label="Enviar Enlace de Recuperación" 
          :loading="isResetLoading" 
          :disabled="isResetLoading"
          fluid
          class="mt-6"
        />
        
        <Button 
          @click="toggleResetMode"
          text
          label="Volver al login"
          fluid
          class="text-slate-600"
          :disabled="isResetLoading"
        />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/composables/useToast'

// PrimeVue components
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

// Estados de loading
const isLoginLoading = ref(false)
const isResetLoading = ref(false)

// Estado del modo (login o reset)
const isResetMode = ref(false)

// Valores iniciales para login
const loginValues = ref({
  email: '',
  password: ''
})

// Valores iniciales para reset
const resetValues = ref({
  email: ''
})

// Resolver para login
const loginResolver = zodResolver(
  z.object({
    email: z.string().min(1, { message: 'Usuario es requerido.' }),
    password: z
      .string()
      .min(3, { message: 'Mínimo 3 caracteres.' })
      .refine(v => /[a-z]/.test(v), { message: 'Al menos una letra minúscula.' })
      .refine(v => /[A-Z]/.test(v), { message: 'Al menos una letra mayúscula.' })
      .refine(v => /\d/.test(v), { message: 'Al menos un número.' })
  })
)

// Resolver para reset password
const resetResolver = zodResolver(
  z.object({
    email: z
      .string()
      .min(1, { message: 'Email es requerido.' })
      .email({ message: 'Email no válido.' })
  })
)

// Composables
const router = useRouter()
const auth = useAuthStore()
const { showWarn, showError, showSuccess } = useToast()

// Funciones de manejo
function toggleResetMode() {
  isResetMode.value = !isResetMode.value
}

async function onLoginSubmit(event) {
  // Prevenir doble ejecución
  if (isLoginLoading.value) {
    console.log('🔄 Login ya está en proceso, ignorando...')
    return
  }

  // Validar evento
  if (!event || !event.valid || !event.values) {
    console.warn('⚠️ Evento inválido:', event)

    showWarn('Datos inválidos', 'Por favor complete todos los campos correctamente')
    return
  }

  // Validar que los valores no estén vacíos
  const { email, password } = event.values
  if (!email || !password) {
    console.warn('⚠️ Valores vacíos detectados:', event.values)
    showWarn('Campos requeridos', 'Usuario y contraseña son obligatorios')

    return
  }

  console.log('🔐 Iniciando login con cookies para:', email)

  try {
    isLoginLoading.value = true
    
    // ✨ El store ahora maneja las cookies automáticamente
    const result = await auth.doLogin(event.values)
    
    console.log('✅ Login exitoso, cookies establecidas por el backend')
    
    // Mostrar mensaje de éxito
    showSuccess('Acceso exitoso', `Bienvenido, ${auth.user?.firstName || auth.user?.username || 'Usuario'}`)
    
    // Pequeña pausa para que el usuario vea el mensaje
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Redirigir al dashboard
    router.push('/')
    
  } catch (error) {
    console.error('❌ Error en login:', error)
    
    // Determinar mensaje de error apropiado
    let errorMessage = 'Error de conexión'
    
    if (error.message) {
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        errorMessage = 'Usuario o contraseña incorrectos'
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = 'Error de conexión con el servidor'
      } else {
        errorMessage = error.message
      }
    }
    
    // Mostrar mensaje de error
    showError('Error de acceso', errorMessage)
    
    // Limpiar formulario en caso de error de credenciales
    if (errorMessage.includes('incorrectos')) {
      loginValues.value.password = ''
    }
    
  } finally {
    isLoginLoading.value = false
  }
}

async function onResetSubmit(event) {
  // Prevenir doble ejecución
  if (isResetLoading.value) {
    console.log('🔄 Reset ya está en proceso, ignorando...')
    return
  }

  // Validar evento
  if (!event || !event.valid || !event.values?.email) {
    console.warn('⚠️ Evento inválido o email vacío:', event)

    showWarn('Email requerido', 'Por favor ingrese un email válido')
    return
  }

  console.log('📧 Iniciando reset para:', event.values.email)

  try {
    isResetLoading.value = true
    
    // TODO: Reemplazar con tu servicio real de reset password
    // await authService.resetPassword(event.values.email)
    
    // Simular llamada a API por ahora
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('✅ Enlace de recuperación enviado')
    
    // Mostrar mensaje de éxito
    showSuccess('Enlace enviado', `Revisa tu correo ${event.values.email} para continuar`)
    // Volver al modo login después de un tiempo
    setTimeout(() => {
      isResetMode.value = false
      resetValues.value.email = '' // Limpiar campo
    }, 2000)
    
  } catch (error) {
    console.error('❌ Error en reset:', error)
    
    showError('Error al enviar', error.message || 'No se pudo enviar el enlace de recuperación')
  } finally {
    isResetLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos específicos para el formulario */
.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

/* Ajustes para los iconos en los campos */
:deep(.p-inputtext) {
  padding-left: 2.5rem;
}

:deep(.p-password-input) {
  padding-left: 2.5rem;
}

/* Animación suave para el cambio de modo */
.form-transition {
  transition: all 0.3s ease-in-out;
}

/* Animación de loading para mejorar UX */
.p-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Estilo para campos deshabilitados */
:deep(.p-inputtext:disabled),
:deep(.p-password-input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>