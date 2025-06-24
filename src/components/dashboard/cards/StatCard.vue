<!-- src/components/dashboard/cards/StatCard.vue -->
<template>
  <div 
    class="stat-card"
    :class="{ 
      'compact': compact,
      'config-mode': configMode 
    }"
  >
    <div class="stat-content">
      <!-- Icono -->
      <div 
        class="stat-icon"
        :style="{ backgroundColor: iconBgColor, color: stat.color }"
      >
        <i :class="stat.icon"></i>
      </div>

      <!-- Datos -->
      <div class="stat-data">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
        
        <!-- Tendencia (solo si no es compacto) -->
        <div v-if="!compact && stat.trend" class="stat-trend">
          <span 
            class="trend-indicator"
            :class="getTrendClass()"
          >
            <i :class="getTrendIcon()"></i>
            {{ stat.trend }}
          </span>
        </div>
      </div>
    </div>

    <!-- Overlay de configuración -->
    <div v-if="configMode" class="config-overlay">
      <div class="config-hint">
        <i class="pi pi-drag text-slate-400"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stat: {
    type: Object,
    required: true,
    validator: (stat) => {
      return stat.hasOwnProperty('value') && stat.hasOwnProperty('label')
    }
  },
  compact: {
    type: Boolean,
    default: false
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

// Computed
const iconBgColor = computed(() => {
  if (!props.stat.color) return '#f1f5f9'
  
  // Convertir color hex a rgba con opacidad baja para el fondo
  const hex = props.stat.color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, 0.1)`
})

const getTrendClass = () => {
  if (!props.stat.trend) return ''
  
  const trend = props.stat.trend.toString()
  
  if (trend.startsWith('+') || (!trend.startsWith('-') && parseFloat(trend) > 0)) {
    return 'trend-positive'
  } else if (trend.startsWith('-') || parseFloat(trend) < 0) {
    return 'trend-negative'
  }
  
  return 'trend-neutral'
}

const getTrendIcon = () => {
  if (!props.stat.trend) return ''
  
  const trend = props.stat.trend.toString()
  
  if (trend.startsWith('+') || (!trend.startsWith('-') && parseFloat(trend) > 0)) {
    return 'pi pi-arrow-up'
  } else if (trend.startsWith('-') || parseFloat(trend) < 0) {
    return 'pi pi-arrow-down'
  }
  
  return 'pi pi-minus'
}
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-card.compact {
  padding: 1rem;
}

.stat-card.config-mode {
  opacity: 0.8;
  cursor: move;
}

/* Contenido principal */
.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.stat-card.compact .stat-content {
  gap: 0.75rem;
}

/* Icono */
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-card.compact .stat-icon {
  width: 36px;
  height: 36px;
  font-size: 1.25rem;
  border-radius: 8px;
}

/* Datos */
.stat-data {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-card.compact .stat-value {
  font-size: 1.5rem;
  margin-bottom: 0.125rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.2;
}

.stat-card.compact .stat-label {
  font-size: 0.75rem;
}

/* Tendencia */
.stat-trend {
  margin-top: 0.5rem;
}

.trend-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.trend-positive {
  color: #059669;
  background-color: #ecfdf5;
}

.trend-negative {
  color: #dc2626;
  background-color: #fef2f2;
}

.trend-neutral {
  color: #6b7280;
  background-color: #f9fafb;
}

/* Overlay de configuración */
.config-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.stat-card.config-mode:hover .config-overlay {
  opacity: 1;
}

.config-hint {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-content {
    gap: 0.75rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  .stat-card {
    padding: 0.75rem;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-value {
    font-size: 1.375rem;
  }
}

/* Animaciones */
.stat-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estados especiales */
.stat-card:active {
  transform: scale(0.98);
}

.stat-card.config-mode:active {
  transform: scale(0.95);
  opacity: 0.9;
}

/* Variantes de color para diferentes estados */
.stat-card.success {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5, #ffffff);
}

.stat-card.warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb, #ffffff);
}

.stat-card.danger {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2, #ffffff);
}
</style>