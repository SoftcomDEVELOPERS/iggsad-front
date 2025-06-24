// composables/useToast.js
import { useToast as usePrimeToast } from 'primevue/usetoast'
import { showToast } from '@/styles/toast.styles.js'

export function useToast() {
  const toast = usePrimeToast()

  const showSuccess = (summary, detail, life = 4000) => {
    showToast(toast, { severity: 'success', summary, detail, life })
  }

  const showError = (summary, detail, life = 5000) => {
    showToast(toast, { severity: 'error', summary, detail, life })
  }

  const showWarn = (summary, detail, life = 4000) => {
    showToast(toast, { severity: 'warn', summary, detail, life })
  }

  const showInfo = (summary, detail, life = 4000) => {
    showToast(toast, { severity: 'info', summary, detail, life })
  }

  return {
    showSuccess,
    showError,
    showWarn,
    showInfo,
    toast // Exposer el toast original por si se necesita
  }
}