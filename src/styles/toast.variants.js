// styles/toast.variants.js - Variantes especiales para gestión procesal
export const applyToastVariants = () => {
  const variantStyles = document.createElement('style')
  variantStyles.id = 'gestion-procesal-toast-variants'
  variantStyles.textContent = `
/* ===== VARIANTES ESPECÍFICAS PARA GESTIÓN PROCESAL ===== */

/* Toast crítico (eliminaciones, acciones irreversibles) */
.p-toast .p-toast-message.toast-critical {
  border: 2px solid #dc2626 !important;
  border-left: 6px solid #dc2626 !important;
  background: #fef2f2 !important;
}

.p-toast .p-toast-message.toast-critical .p-toast-summary {
  color: #991b1b !important;
  font-weight: 700 !important;
}

.p-toast .p-toast-message.toast-critical .p-toast-detail {
  color: #7f1d1d !important;
}

/* Toast de sistema (mantenimiento, actualizaciones) */
.p-toast .p-toast-message.toast-system {
  border-left: 4px solid #6b7280 !important;
  background: #f9fafb !important;
}

.p-toast .p-toast-message.toast-system .p-toast-message-icon {
  color: #6b7280 !important;
}

.p-toast .p-toast-message.toast-system .p-toast-summary {
  color: #374151 !important;
}

/* Toast de proceso legal (notificaciones judiciales) */
.p-toast .p-toast-message.toast-legal {
  border-left: 4px solid #7c3aed !important;
  background: #ffffff !important;
  border: 1px solid #e5e7eb !important;
}

.p-toast .p-toast-message.toast-legal .p-toast-message-icon {
  color: #7c3aed !important;
}

.p-toast .p-toast-message.toast-legal .p-toast-summary {
  color: #581c87 !important;
  font-weight: 600 !important;
}

.p-toast .p-toast-message.toast-legal .p-toast-detail {
  color: #6b21a8 !important;
}

/* Toast de deuda/pago (información financiera) */
.p-toast .p-toast-message.toast-financial {
  border-left: 4px solid #0891b2 !important;
  background: #ffffff !important;
}

.p-toast .p-toast-message.toast-financial .p-toast-message-icon {
  color: #0891b2 !important;
}

.p-toast .p-toast-message.toast-financial .p-toast-summary {
  color: #164e63 !important;
}

.p-toast .p-toast-message.toast-financial .p-toast-detail {
  color: #0e7490 !important;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace !important;
}

/* Toast de vencimiento/deadline */
.p-toast .p-toast-message.toast-deadline {
  border-left: 4px solid #ea580c !important;
  background: #ffffff !important;
  animation: pulse-urgent 2s infinite !important;
}

.p-toast .p-toast-message.toast-deadline .p-toast-message-icon {
  color: #ea580c !important;
}

.p-toast .p-toast-message.toast-deadline .p-toast-summary {
  color: #9a3412 !important;
  font-weight: 700 !important;
}

@keyframes pulse-urgent {
  0%, 100% {
    border-left-color: #ea580c;
  }
  50% {
    border-left-color: #dc2626;
  }
}

/* ===== MODO OSCURO PARA VARIANTES ===== */
@media (prefers-color-scheme: dark) {
  .p-toast .p-toast-message.toast-critical {
    background: #1f1917 !important;
    border-color: #ef4444 !important;
  }
  
  .p-toast .p-toast-message.toast-system {
    background: #111827 !important;
  }
  
  .p-toast .p-toast-message.toast-legal {
    background: #1e1b23 !important;
  }
  
  .p-toast .p-toast-message.toast-financial {
    background: #164e63 !important;
  }
}
`

  if (!document.getElementById('gestion-procesal-toast-variants')) {
    document.head.appendChild(variantStyles)
    console.log('✅ Variantes de Toast aplicadas')
  }
}

export const removeToastVariants = () => {
  const existingVariants = document.getElementById('gestion-procesal-toast-variants')
  if (existingVariants) {
    existingVariants.remove()
    console.log('🗑️ Variantes de Toast removidas')
  }
}