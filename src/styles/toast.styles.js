// styles/toast.styles.js
export const applyToastStyles = () => {
  const toastStyles = document.createElement('style')
  toastStyles.id = 'gestion-procesal-toast-styles'
  toastStyles.textContent = `
/* ===== TOAST EMPRESARIAL GESTIÓN PROCESAL ===== */

/* Contenedor principal con z-index alto */
.p-toast {
  z-index: 9999 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* Mensaje principal con glassmorphism */
.p-toast .p-toast-message {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
  border-radius: 10px !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  margin-bottom: 0.75rem !important;
  padding: 1.25rem !important;
  min-width: 320px !important;
  max-width: 480px !important;
}

/* Contenido del mensaje */
.p-toast .p-toast-message .p-toast-message-content {
  padding: 0 !important;
  align-items: flex-start !important;
  gap: 0.75rem !important;
}

/* Icono del mensaje */
.p-toast .p-toast-message .p-toast-message-icon {
  width: 1.5rem !important;
  height: 1.5rem !important;
  margin-right: 0 !important;
  margin-top: 0.125rem !important;
  flex-shrink: 0 !important;
}

/* Contenedor de texto */
.p-toast .p-toast-message .p-toast-message-text {
  flex: 1 !important;
  min-width: 0 !important;
}

/* Título del mensaje */
.p-toast .p-toast-message .p-toast-summary {
  font-weight: 600 !important;
  font-size: 0.9375rem !important;
  color: #111827 !important;
  margin-bottom: 0.375rem !important;
  line-height: 1.4 !important;
  letter-spacing: -0.01em !important;
}

/* Detalle del mensaje */
.p-toast .p-toast-message .p-toast-detail {
  font-size: 0.8125rem !important;
  color: #6b7280 !important;
  line-height: 1.5 !important;
  margin: 0 !important;
}

/* Botón de cerrar */
.p-toast .p-toast-message .p-toast-icon-close {
  width: 1.5rem !important;
  height: 1.5rem !important;
  color: #9ca3af !important;
  transition: all 0.2s ease !important;
  border-radius: 6px !important;
  flex-shrink: 0 !important;
  margin-left: 0.5rem !important;
}

.p-toast .p-toast-message .p-toast-icon-close:hover {
  color: #6b7280 !important;
  background-color: rgba(156, 163, 175, 0.1) !important;
  transform: scale(1.05) !important;
}

/* ===== COLORES POR SEVERIDAD ===== */

/* Success - Verde empresarial */
.p-toast .p-toast-message-success {
  border-left: 4px solid #10b981 !important;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.02), rgba(255, 255, 255, 0.98)) !important;
}

.p-toast .p-toast-message-success .p-toast-message-icon {
  color: #10b981 !important;
}

.p-toast .p-toast-message-success .p-toast-summary {
  color: #065f46 !important;
}

/* Info - Azul profesional */
.p-toast .p-toast-message-info {
  border-left: 4px solid #3b82f6 !important;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(255, 255, 255, 0.98)) !important;
}

.p-toast .p-toast-message-info .p-toast-message-icon {
  color: #3b82f6 !important;
}

.p-toast .p-toast-message-info .p-toast-summary {
  color: #1e40af !important;
}

/* Warning - Ámbar corporativo */
.p-toast .p-toast-message-warn {
  border-left: 4px solid #f59e0b !important;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.02), rgba(255, 255, 255, 0.98)) !important;
}

.p-toast .p-toast-message-warn .p-toast-message-icon {
  color: #f59e0b !important;
}

.p-toast .p-toast-message-warn .p-toast-summary {
  color: #92400e !important;
}

/* Error - Rojo empresarial */
.p-toast .p-toast-message-error {
  border-left: 4px solid #ef4444 !important;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.02), rgba(255, 255, 255, 0.98)) !important;
}

.p-toast .p-toast-message-error .p-toast-message-icon {
  color: #ef4444 !important;
}

.p-toast .p-toast-message-error .p-toast-summary {
  color: #991b1b !important;
}

/* ===== ANIMACIONES EMPRESARIALES ===== */

/* Entrada suave */
.p-toast .p-toast-message {
  animation: toastSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Salida suave */
.p-toast .p-toast-message.p-toast-message-leave {
  animation: toastSlideOut 0.3s ease-in forwards !important;
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
}

/* ===== RESPONSIVE ===== */

/* Móvil */
@media (max-width: 640px) {
  .p-toast {
    left: 0.5rem !important;
    right: 0.5rem !important;
    top: 1rem !important;
  }
  
  .p-toast .p-toast-message {
    min-width: auto !important;
    max-width: none !important;
    margin-bottom: 0.5rem !important;
    padding: 1rem !important;
  }
  
  .p-toast .p-toast-summary {
    font-size: 0.875rem !important;
  }
  
  .p-toast .p-toast-detail {
    font-size: 0.75rem !important;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .p-toast .p-toast-message {
    min-width: 280px !important;
    max-width: 400px !important;
  }
}

/* ===== MODO OSCURO (OPCIONAL) ===== */
@media (prefers-color-scheme: dark) {
  .p-toast .p-toast-message {
    background: rgba(31, 41, 55, 0.98) !important;
    border-color: rgba(75, 85, 99, 0.8) !important;
  }
  
  .p-toast .p-toast-summary {
    color: #f9fafb !important;
  }
  
  .p-toast .p-toast-detail {
    color: #d1d5db !important;
  }
  
  .p-toast .p-toast-icon-close {
    color: #9ca3af !important;
  }
  
  .p-toast .p-toast-icon-close:hover {
    color: #d1d5db !important;
    background-color: rgba(156, 163, 175, 0.2) !important;
  }
}

/* ===== HIGH CONTRAST ===== */
@media (prefers-contrast: high) {
  .p-toast .p-toast-message {
    border-width: 2px !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
  }
  
  .p-toast .p-toast-summary {
    font-weight: 700 !important;
  }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .p-toast .p-toast-message {
    animation: none !important;
  }
  
  .p-toast .p-toast-message.p-toast-message-leave {
    animation: none !important;
  }
  
  .p-toast .p-toast-icon-close {
    transition: none !important;
  }
}
`

  // Solo agregar si no existe ya
  if (!document.getElementById('gestion-procesal-toast-styles')) {
    document.head.appendChild(toastStyles)
    console.log('✅ Estilos de Toast empresarial aplicados')
  }
}

// Función para remover los estilos (útil para testing o hot reload)
export const removeToastStyles = () => {
  const existingStyles = document.getElementById('gestion-procesal-toast-styles')
  if (existingStyles) {
    existingStyles.remove()
    console.log('🗑️ Estilos de Toast removidos')
  }
}

// Configuración de toast por defecto para la aplicación
export const defaultToastConfig = {
  position: 'top-right',
  life: 4000,
  closable: true,
  breakpoints: {
    '640px': {
      position: 'top-center',
      life: 3000
    }
  }
}

// Función helper para mostrar toasts consistentes
export const showToast = (toast, { severity = 'info', summary, detail, life = 4000 }) => {
  toast.add({
    severity,
    summary,
    detail,
    life,
    closable: true
  })
}