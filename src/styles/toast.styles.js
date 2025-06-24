// styles/toast.styles.js - Estilo profesional para gestión procesal

export const applyToastStyles = () => {
  const toastStyles = document.createElement('style')
  toastStyles.id = 'gestion-procesal-toast-styles'
  toastStyles.textContent = `
/* ===== TOAST PROFESIONAL GESTIÓN PROCESAL ===== */

/* Contenedor principal */
.p-toast {
  z-index: 9999 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* Mensaje principal - Diseño sobrio y profesional */
.p-toast .p-toast-message {
  background: #ffffff !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.04) !important;
  margin-bottom: 0.5rem !important;
  padding: 1rem 1.25rem !important;
  min-width: 350px !important;
  max-width: 450px !important;
  backdrop-filter: none !important;
}

/* Contenido del mensaje */
.p-toast .p-toast-message .p-toast-message-content {
  padding: 0 !important;
  align-items: flex-start !important;
  gap: 0.75rem !important;
}

/* Icono del mensaje - Más discreto */
.p-toast .p-toast-message .p-toast-message-icon {
  width: 1.25rem !important;
  height: 1.25rem !important;
  margin-right: 0 !important;
  margin-top: 0.125rem !important;
  flex-shrink: 0 !important;
}

/* Contenedor de texto */
.p-toast .p-toast-message .p-toast-message-text {
  flex: 1 !important;
  min-width: 0 !important;
}

/* Título del mensaje - Más formal */
.p-toast .p-toast-message .p-toast-summary {
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  color: #1f2937 !important;
  margin-bottom: 0.25rem !important;
  line-height: 1.25 !important;
  letter-spacing: 0 !important;
}

/* Detalle del mensaje */
.p-toast .p-toast-message .p-toast-detail {
  font-size: 0.8125rem !important;
  color: #4b5563 !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

/* Botón de cerrar - Más visible */
.p-toast .p-toast-message .p-toast-icon-close {
  width: 1.25rem !important;
  height: 1.25rem !important;
  color: #6b7280 !important;
  transition: all 0.15s ease !important;
  border-radius: 4px !important;
  flex-shrink: 0 !important;
  margin-left: 0.75rem !important;
}

.p-toast .p-toast-message .p-toast-icon-close:hover {
  color: #374151 !important;
  background-color: #f3f4f6 !important;
}

/* ===== COLORES PROFESIONALES POR SEVERIDAD ===== */

/* Success - Verde legal/judicial */
.p-toast .p-toast-message-success {
  border-left: 4px solid #059669 !important;
  background: #ffffff !important;
}

.p-toast .p-toast-message-success .p-toast-message-icon {
  color: #059669 !important;
}

.p-toast .p-toast-message-success .p-toast-summary {
  color: #064e3b !important;
}

/* Info - Azul corporativo */
.p-toast .p-toast-message-info {
  border-left: 4px solid #1d4ed8 !important;
  background: #ffffff !important;
}

.p-toast .p-toast-message-info .p-toast-message-icon {
  color: #1d4ed8 !important;
}

.p-toast .p-toast-message-info .p-toast-summary {
  color: #1e3a8a !important;
}

/* Warning - Naranja profesional (alertas legales) */
.p-toast .p-toast-message-warn {
  border-left: 4px solid #d97706 !important;
  background: #ffffff !important;
}

.p-toast .p-toast-message-warn .p-toast-message-icon {
  color: #d97706 !important;
}

.p-toast .p-toast-message-warn .p-toast-summary {
  color: #92400e !important;
}

/* Error - Rojo serio (errores críticos) */
.p-toast .p-toast-message-error {
  border-left: 4px solid #dc2626 !important;
  background: #ffffff !important;
}

.p-toast .p-toast-message-error .p-toast-message-icon {
  color: #dc2626 !important;
}

.p-toast .p-toast-message-error .p-toast-summary {
  color: #991b1b !important;
}

/* ===== ANIMACIONES DISCRETAS ===== */

/* Entrada sutil */
.p-toast .p-toast-message {
  animation: toastSlideInProfessional 0.3s ease-out !important;
}

@keyframes toastSlideInProfessional {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Salida suave */
.p-toast .p-toast-message.p-toast-message-leave {
  animation: toastSlideOutProfessional 0.25s ease-in forwards !important;
}

@keyframes toastSlideOutProfessional {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(50px);
  }
}

/* ===== RESPONSIVE PROFESIONAL ===== */

/* Móvil */
@media (max-width: 640px) {
  .p-toast {
    left: 0.75rem !important;
    right: 0.75rem !important;
    top: 1rem !important;
  }
  
  .p-toast .p-toast-message {
    min-width: auto !important;
    max-width: none !important;
    margin-bottom: 0.5rem !important;
    padding: 0.875rem 1rem !important;
  }
  
  .p-toast .p-toast-summary {
    font-size: 0.8125rem !important;
  }
  
  .p-toast .p-toast-detail {
    font-size: 0.75rem !important;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .p-toast .p-toast-message {
    min-width: 320px !important;
    max-width: 420px !important;
  }
}
`

  // Solo agregar si no existe ya
  if (!document.getElementById('gestion-procesal-toast-styles')) {
    document.head.appendChild(toastStyles)
    console.log('✅ Estilos de Toast profesional aplicados')
  }
}

// Función para remover los estilos
export const removeToastStyles = () => {
  const existingStyles = document.getElementById('gestion-procesal-toast-styles')
  if (existingStyles) {
    existingStyles.remove()
    console.log('🗑️ Estilos de Toast removidos')
  }
}