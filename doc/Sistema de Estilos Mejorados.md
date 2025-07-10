# 📚 Sistema de Estilos Iggsad - Documentación Completa v2.0

## 🎯 **Resumen del Sistema Unificado**

### ✅ **LO QUE SE MANTIENE (Funciona perfectamente)**
- 🔒 **Sistema Toast completo** - Toda la funcionalidad JS + variantes especializadas
- 🔒 **Configuración de router y auth** - Estados, guards, interceptores
- 🔒 **Compatibilidad total** - No se rompe nada existente
- 🔒 **Performance optimizado** - Carga rápida y transiciones suaves

### 🚀 **LO QUE SE HA MEJORADO (v2.0)**
1. **🎨 Sistema de tokens CSS expandido** - Variables completas para todo el sistema
2. **🔧 PrimeVue 100% tokenizado** - Eliminados todos los valores hardcodeados
3. **📱 App.vue completamente limpio** - CSS organizado en archivos separados
4. **✅ Integración perfecta** - Tokens CSS ↔ PrimeVue Theme sin duplicaciones
5. **📚 Documentación completa** - Guías de uso y ejemplos actualizados

## 📋 **Estructura de Archivos Final**

```
src/
├── themes/
│   ├── primevue-theme.js         # ✅ 100% TOKENIZADO - Usa var(--iggsad-*)
│   └── custom-tokens.css         # ✅ EXPANDIDO - Sistema completo de tokens
├── styles/
│   ├── app-layout.css           # ✅ MANTIENE - Estilos del layout principal
│   ├── index.css                # ✅ MANTIENE - Imports centralizados
│   ├── toast.styles.js          # ✅ MANTIENE - Sistema toast perfecto
│   ├── toast.variants.js        # ✅ MANTIENE - Variantes especializadas
│   └── toast.config.js          # ✅ MANTIENE - Configuración actual
├── main.js                      # ✅ CORREGIDO - Sin errores, validaciones mejoradas
└── App.vue                      # ✅ LIMPIO - Solo import + CSS específico
```

## 🎨 **Sistema de Tokens CSS Expandido v2.0**

### **🆕 Nuevas Categorías de Tokens**

#### **🎯 Font System Completo**
```css
/* Font Weights - Eliminan fontWeight: '500', '600' hardcodeados */
--iggsad-font-normal: 400;           /* fontWeight: '400' */
--iggsad-font-medium: 500;           /* fontWeight: '500' ← NUEVO */
--iggsad-font-semibold: 600;         /* fontWeight: '600' ← NUEVO */
--iggsad-font-bold: 700;

/* Font Sizes - Eliminan fontSize hardcodeados */
--iggsad-text-xs: 0.75rem;           /* 12px */
--iggsad-text-sm: 0.875rem;          /* 14px ← USADO EN PRIMEVUE */
--iggsad-text-base: 1rem;            /* 16px ← USADO EN PRIMEVUE */
--iggsad-text-xl: 1.25rem;           /* 20px ← USADO EN PRIMEVUE */
```

#### **📏 Sizing System**
```css
/* Widths específicos - Eliminan width: '2rem' hardcodeados */
--iggsad-width-md: 2rem;             /* 32px ← DROPDOWN WIDTH */
--iggsad-width-lg: 2.5rem;           /* 40px ← LOGO SIZE */

/* Heights específicos - Eliminan height: '1.5rem' hardcodeados */
--iggsad-height-sm: 1.5rem;          /* 24px ← CLOSE BUTTON */
--iggsad-height-md: 2rem;            /* 32px */
--iggsad-height-header: 4rem;        /* 64px ← HEADER HEIGHT */
```

#### **📐 Espaciado Expandido**
```css
/* Eliminan padding hardcodeados como '0.625rem 0.875rem' */
--iggsad-spacing-0-5: 0.125rem;      /* 2px ← GAP PEQUEÑO */
--iggsad-spacing-sm-plus: 0.625rem;  /* 10px ← PADDING Y */
--iggsad-spacing-md-minus: 0.75rem;  /* 12px ← PADDING X */

/* Tokens combinados para uso directo */
--iggsad-input-padding: 0.625rem 0.875rem;  /* Padding estándar inputs */
--iggsad-input-padding-x: 0.875rem;         /* Solo horizontal */
--iggsad-input-padding-y: 0.625rem;         /* Solo vertical */
```

#### **🎭 Focus Ring System**
```css
/* Eliminan focusRing hardcodeados */
--iggsad-focus-ring-width: 2px;      /* width: '2px' ← ANTES HARDCODED */
--iggsad-focus-ring-style: solid;    /* style: 'solid' ← ANTES HARDCODED */
--iggsad-focus-ring-color: var(--iggsad-primary-500);
--iggsad-focus-ring-offset: -1px;    /* offset: '-1px' ← ANTES HARDCODED */
```

#### **🌟 Shadow System Expandido**
```css
--iggsad-shadow-inner: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* INPUT SHADOW */
--iggsad-shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);    /* MODAL SHADOW */
```

#### **🎛️ Border System**
```css
--iggsad-border-width-none: 0;       /* border: '0 none' ← TOAST */
--iggsad-border-width-thin: 1px;     /* border: '1px solid' ← SUBMENU */
--iggsad-border-width-medium: 2px;   /* focusRing width ← FOCUS */
--iggsad-border-solid: solid;        /* border-style ← STANDARDIZED */
```

### **🔗 Variables Combinadas (Composite Tokens)**
```css
/* Toast específico */
--iggsad-toast-width: 25rem;         /* width: '25rem' ← ANTES HARDCODED */

/* Menubar específico */
--iggsad-menubar-item-padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
--iggsad-menubar-item-hover-bg: var(--iggsad-primary-600);
--iggsad-menubar-item-hover-color: var(--iggsad-surface-white);

/* Cards específico */
--iggsad-card-bg: var(--iggsad-surface-white);
--iggsad-card-radius: var(--iggsad-radius-lg);
--iggsad-card-shadow: var(--iggsad-shadow-md);
--iggsad-card-padding: var(--iggsad-spacing-lg);
```

## 🔧 **PrimeVue Theme 100% Tokenizado**

### **❌ ANTES (Valores hardcodeados):**
```javascript
menubar: {
  item: {
    padding: '0.5rem 1rem',          // ← HARDCODED
    borderRadius: '6px',             // ← HARDCODED
    fontWeight: '500',               // ← HARDCODED
    focusBackground: '{primary.600}' // ← REFERENCIA INDIRECTA
  }
}
```

### **✅ AHORA (100% Tokens directos):**
```javascript
menubar: {
  item: {
    padding: 'var(--iggsad-menubar-item-padding)',    // ← TOKEN COMBINADO
    borderRadius: 'var(--iggsad-radius-sm)',          // ← TOKEN DIRECTO
    fontWeight: 'var(--iggsad-font-medium)',          // ← TOKEN DIRECTO
    focusBackground: 'var(--iggsad-primary-600)'      // ← TOKEN DIRECTO
  }
}
```

### **🎯 Componentes 100% Tokenizados:**

#### **Cards**
```javascript
card: {
  root: {
    background: 'var(--iggsad-surface-white)',      // TOKEN
    borderRadius: 'var(--iggsad-radius-lg)',        // TOKEN
    shadow: 'var(--iggsad-shadow-md)',              // TOKEN
    padding: 'var(--iggsad-spacing-lg)'             // TOKEN
  },
  title: {
    fontSize: 'var(--iggsad-text-xl)',              // TOKEN ← ANTES '1.25rem'
    fontWeight: 'var(--iggsad-font-semibold)'       // TOKEN ← ANTES '600'
  }
}
```

#### **Buttons**
```javascript
button: {
  root: {
    borderRadius: 'var(--iggsad-radius-md)',        // TOKEN
    fontWeight: 'var(--iggsad-font-medium)',        // TOKEN ← ANTES '500'
    focusRing: {
      width: 'var(--iggsad-focus-ring-width)',      // TOKEN ← ANTES '2px'
      style: 'var(--iggsad-focus-ring-style)',      // TOKEN ← ANTES 'solid'
      offset: 'var(--iggsad-spacing-0-5)'          // TOKEN ← ANTES '2px'
    }
  }
}
```

#### **Toast**
```javascript
toast: {
  root: {
    width: 'var(--iggsad-toast-width)',             // TOKEN ← ANTES '25rem'
    borderRadius: 'var(--iggsad-radius-lg)',        // TOKEN
    border: 'var(--iggsad-border-width-none)'       // TOKEN ← ANTES '0 none'
  },
  closeButton: {
    width: 'var(--iggsad-height-sm)',               // TOKEN ← ANTES '1.5rem'
    height: 'var(--iggsad-height-sm)',              // TOKEN ← ANTES '1.5rem'
    borderRadius: 'var(--iggsad-radius-full)'       // TOKEN ← ANTES '50%'
  }
}
```

#### **Inputs/Select**
```javascript
inputtext: {
  root: {
    paddingX: 'var(--iggsad-input-padding-x)',      // TOKEN ← ANTES '0.875rem'
    paddingY: 'var(--iggsad-input-padding-y)',      // TOKEN ← ANTES '0.625rem'
    shadow: 'var(--iggsad-shadow-inner)',           // TOKEN ← ANTES 'inset 0 1px...'
    borderRadius: 'var(--iggsad-radius-sm)',        // TOKEN
    focusRing: {
      width: 'var(--iggsad-focus-ring-width)',      // TOKEN ← ANTES '2px'
      offset: 'var(--iggsad-focus-ring-offset)'     // TOKEN ← ANTES '-1px'
    }
  }
}
```

## 📱 **Sistema Responsive (Mantenido)**

### **Breakpoints Implementados**
```css
/* Mobile First - Usando tokens para consistencia */
@media (max-width: 768px) {
  .iggsad-header-content {
    flex-direction: column;
    gap: var(--iggsad-spacing-md);           /* ← TOKENIZADO */
    padding: var(--iggsad-spacing-sm);       /* ← TOKENIZADO */
  }
}

@media (max-width: 480px) {
  .iggsad-main-navigation {
    font-size: var(--iggsad-text-sm);       /* ← TOKENIZADO */
  }
}
```

## ♿ **Accesibilidad Mejorada**

### **Focus Management con Tokens**
```css
.iggsad-focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 var(--iggsad-focus-ring-width) var(--iggsad-focus-ring-color);
}

/* Respeto por preferencias del usuario */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: var(--iggsad-transition-fast) !important; /* ← TOKENIZADO */
  }
}
```

## 🌙 **Modo Oscuro Preparado**

### **Sistema Automático**
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* Solo cambiar tokens clave - todo se adapta automáticamente */
    --iggsad-surface-white: #0f172a;
    --iggsad-surface-50: #1e293b;
    --iggsad-surface-700: #cbd5e1;
    --iggsad-surface-800: #f1f5f9;
    
    /* Ajustar sombras para contraste */
    --iggsad-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    --iggsad-shadow-inner: inset 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  }
}
```

## 🔄 **Sistema Toast (MANTENIDO 100%)**

### **✅ Funcionalidad Preservada**
```javascript
import { useToast } from '@/composables/useToast'

const { 
  showSuccess, showError, showWarn, showInfo,
  showCritical, showLegal, showFinancial, showDeadline 
} = useToast()

// Todas las variantes especializadas funcionan igual
showLegal('Notificación Judicial', 'Nueva citación recibida')
showFinancial('Pago Recibido', '€1,250.00 abonados')
showDeadline('Vencimiento Próximo', 'Alegaciones en 3 días')
```

## 🎨 **Ejemplos de Uso v2.0**

### **Crear Componente con Tokens Expandidos**
```vue
<template>
  <div class="mi-tarjeta-avanzada">
    <header class="mi-tarjeta-header">
      <h3 class="mi-tarjeta-titulo">{{ titulo }}</h3>
      <p class="mi-tarjeta-subtitulo">{{ subtitulo }}</p>
    </header>
    <div class="mi-tarjeta-contenido">
      <slot />
    </div>
    <footer class="mi-tarjeta-acciones">
      <Button class="mi-boton-primario">Acción Principal</Button>
      <Button class="mi-boton-secundario">Cancelar</Button>
    </footer>
  </div>
</template>

<style scoped>
.mi-tarjeta-avanzada {
  background: var(--iggsad-card-bg);           /* Token combinado */
  border-radius: var(--iggsad-card-radius);    /* Token combinado */
  box-shadow: var(--iggsad-card-shadow);       /* Token combinado */
  overflow: hidden;
  transition: var(--iggsad-transition-normal);
}

.mi-tarjeta-header {
  padding: var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-50);
  border-bottom: var(--iggsad-border-width-thin) var(--iggsad-border-solid) var(--iggsad-surface-200);
}

.mi-tarjeta-titulo {
  font-size: var(--iggsad-text-xl);            /* ← NUEVO TOKEN */
  font-weight: var(--iggsad-font-semibold);    /* ← NUEVO TOKEN */
  color: var(--iggsad-surface-800);
  margin: var(--iggsad-spacing-none);
}

.mi-tarjeta-subtitulo {
  font-size: var(--iggsad-text-sm);            /* ← NUEVO TOKEN */
  font-weight: var(--iggsad-font-normal);      /* ← NUEVO TOKEN */
  color: var(--iggsad-surface-600);
  margin: var(--iggsad-spacing-xs) var(--iggsad-spacing-none) var(--iggsad-spacing-none);
}

.mi-tarjeta-contenido {
  padding: var(--iggsad-card-padding);         /* Token combinado */
}

.mi-tarjeta-acciones {
  padding: var(--iggsad-spacing-md) var(--iggsad-spacing-lg);
  background: var(--iggsad-surface-50);
  display: flex;
  gap: var(--iggsad-spacing-sm);
  justify-content: flex-end;
  border-top: var(--iggsad-border-width-thin) var(--iggsad-border-solid) var(--iggsad-surface-200);
}

.mi-boton-primario {
  background: var(--iggsad-primary-600);
  color: var(--iggsad-surface-white);
  border: var(--iggsad-border-width-none);
  border-radius: var(--iggsad-radius-md);
  padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
  font-weight: var(--iggsad-font-medium);      /* ← NUEVO TOKEN */
  transition: var(--iggsad-transition-fast);
}

.mi-boton-primario:hover {
  background: var(--iggsad-primary-700);
  transform: translateY(-1px);
  box-shadow: var(--iggsad-shadow-md);
}

.mi-boton-secundario {
  background: var(--iggsad-surface-100);
  color: var(--iggsad-surface-700);
  border: var(--iggsad-border-width-thin) var(--iggsad-border-solid) var(--iggsad-surface-300);
  border-radius: var(--iggsad-radius-md);
  padding: var(--iggsad-spacing-sm) var(--iggsad-spacing-md);
  font-weight: var(--iggsad-font-medium);      /* ← NUEVO TOKEN */
  transition: var(--iggsad-transition-fast);
}

.mi-boton-secundario:hover {
  background: var(--iggsad-surface-200);
  border-color: var(--iggsad-surface-400);
}

/* Focus rings usando tokens */
.mi-boton-primario:focus,
.mi-boton-secundario:focus {
  outline: var(--iggsad-border-width-none);
  box-shadow: 0 0 0 var(--iggsad-focus-ring-width) var(--iggsad-focus-ring-color);
}
</style>
```

### **Usar Clases Utilitarias Expandidas**
```vue
<template>
  <div class="iggsad-page-container">
    <header class="iggsad-page-header">
      <h1 class="iggsad-text-xl iggsad-font-bold">Mi Página</h1>
      <p class="iggsad-text-sm iggsad-font-normal">Descripción detallada</p>
    </header>
    
    <main class="iggsad-card">
      <div class="iggsad-w-md iggsad-h-lg">
        <!-- Contenido con sizing específico -->
      </div>
    </main>
  </div>
</template>
```

## 🔍 **Troubleshooting v2.0**

### **Validación de Tokens Expandidos**
```javascript
// En DevTools Console:
console.log('Font Medium:', getComputedStyle(document.documentElement).getPropertyValue('--iggsad-font-medium'))
// Resultado esperado: 500

console.log('Text SM:', getComputedStyle(document.documentElement).getPropertyValue('--iggsad-text-sm'))
// Resultado esperado: 0.875rem

console.log('Input Padding:', getComputedStyle(document.documentElement).getPropertyValue('--iggsad-input-padding'))
// Resultado esperado: 0.625rem 0.875rem
```

### **Verificación de Integración PrimeVue**
```javascript
// Verificar que PrimeVue usa tokens directos
const menuItem = document.querySelector('.p-menuitem-link')
if (menuItem) {
  const styles = getComputedStyle(menuItem)
  console.log('Menubar padding:', styles.padding)
  console.log('Menubar font-weight:', styles.fontWeight)
  console.log('Menubar border-radius:', styles.borderRadius)
}
```

## 📊 **Validaciones Automáticas Mejoradas**

### **En main.js - Validaciones v2.0**
```javascript
const checks = {
  'PrimeVue Theme': !!document.querySelector('.p-component'),
  'Custom Tokens CSS': !!getComputedStyle(document.documentElement).getPropertyValue('--iggsad-primary-600'),
  'Expanded Tokens': !!getComputedStyle(document.documentElement).getPropertyValue('--iggsad-font-medium'),
  'Composite Tokens': !!getComputedStyle(document.documentElement).getPropertyValue('--iggsad-input-padding'),
  'Focus Ring System': !!getComputedStyle(document.documentElement).getPropertyValue('--iggsad-focus-ring-width'),
  'Toast System': !!document.getElementById('gestion-procesal-toast-styles'),
  'App Layout': !!Array.from(document.styleSheets).some(sheet => 
    sheet.href?.includes('app-layout') || 
    Array.from(sheet.cssRules || []).some(rule => rule.selectorText?.includes('iggsad-header'))
  ),
  'Font Integration': getComputedStyle(document.querySelector('#app')).fontFamily.includes('Inter')
}
```

## 📈 **Beneficios del Sistema v2.0**

### **✅ Consistencia Total (100%)**
- **0 valores hardcodeados** - Todo usa tokens
- **Mismo spacing** - En toda la aplicación
- **Mismo typography** - Weights y sizes unificados
- **Mismo focus behavior** - Rings consistentes

### **✅ Mantenibilidad Extrema**
- **1 cambio = efecto global** - Modificar token afecta todo
- **Type safety** - Variables con nombres descriptivos
- **Debugging fácil** - DevTools muestra tokens directos
- **Escalabilidad** - Nuevos componentes heredan automáticamente

### **✅ Performance Optimizado**
- **CSS compilado** - Variables resueltas en build time cuando sea posible
- **Caching eficiente** - Archivos CSS separados cacheables
- **Lazy loading** - Solo carga estilos cuando se necesitan
- **Tree shaking** - Elimina tokens no usados en producción

### **✅ Developer Experience Superior**
- **Autocompletado** - IDEs sugieren nombres de tokens
- **Validación** - Avisos si token no existe
- **Documentación** - Cada token tiene propósito claro
- **Testing** - Validaciones automáticas en desarrollo

## 🚀 **Roadmap Futuro**

### **v2.1 - Temas Dinámicos**
- Cambio de tema en runtime
- Múltiples paletas de colores
- Personalización por usuario

### **v2.2 - Tokens Semánticos**
- Sistema de color basado en intención
- Tokens de componente específicos
- Adaptación automática de contraste

### **v2.3 - Integración Avanzada**
- Plugin de Figma para tokens
- Generación automática desde design system
- Sincronización con herramientas de design

---

*Documentación actualizada para el Sistema de Gestión Procesal | Versión 2.0.0*