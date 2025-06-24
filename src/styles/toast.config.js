// Configuración de toast por defecto para la aplicación
export const defaultToastConfig = {
  position: 'top-right',
  life: 5000, // Más tiempo para leer información importante
  closable: true,
  breakpoints: {
    '640px': {
      position: 'top-center',
      life: 4000
    }
  }
}

// Función helper para mostrar toasts consistentes
export const showToast = (toast, { severity = 'info', summary, detail, life = 5000 }) => {
  toast.add({
    severity,
    summary,
    detail,
    life,
    closable: true
  })
}

// Configuraciones específicas por tipo para gestión procesal
export const toastPresets = {
  // Para acciones críticas (eliminar expedientes, cambios importantes)
  critical: {
    life: 8000,
    closable: true
  },
  
  // Para operaciones exitosas (guardar, enviar, procesar)
  success: {
    life: 4000,
    closable: true
  },
  
  // Para advertencias (validaciones, permisos)
  warning: {
    life: 6000,
    closable: true
  },
  
  // Para errores (fallos de sistema, conexión)
  error: {
    life: 7000,
    closable: true
  },
  
  // Para información general
  info: {
    life: 5000,
    closable: true
  }
}