// composables/useToast.js
import { useToast as usePrimeToast } from 'primevue/usetoast'
import { showToast, toastPresets } from '@/styles/toast.config.js'

export function useToast() {
  const toast = usePrimeToast()

  // Toasts básicos con configuración profesional
  const showSuccess = (summary, detail, life = toastPresets.success.life) => {
    showToast(toast, { severity: 'success', summary, detail, life })
  }

  const showError = (summary, detail, life = toastPresets.error.life) => {
    showToast(toast, { severity: 'error', summary, detail, life })
  }

  const showWarn = (summary, detail, life = toastPresets.warning.life) => {
    showToast(toast, { severity: 'warn', summary, detail, life })
  }

  const showInfo = (summary, detail, life = toastPresets.info.life) => {
    showToast(toast, { severity: 'info', summary, detail, life })
  }

  // ✨ Toasts especializados para gestión procesal
  const showCritical = (summary, detail) => {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: toastPresets.critical.life,
      closable: true,
      styleClass: 'toast-critical'
    })
  }

  const showLegal = (summary, detail) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: 6000,
      closable: true,
      styleClass: 'toast-legal'
    })
  }

  const showFinancial = (summary, detail) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: 6000,
      closable: true,
      styleClass: 'toast-financial'
    })
  }

  const showDeadline = (summary, detail) => {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: 8000,
      closable: true,
      styleClass: 'toast-deadline'
    })
  }

  const showSystem = (summary, detail) => {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: 5000,
      closable: true,
      styleClass: 'toast-system'
    })
  }

  return {
    // Básicos
    showSuccess,
    showError,
    showWarn,
    showInfo,
    
    // Especializados
    showCritical,
    showLegal,
    showFinancial,
    showDeadline,
    showSystem,
    
    // Toast original por si se necesita
    toast
  }
}