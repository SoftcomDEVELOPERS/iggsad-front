// themes/primevue-theme.js - VERSIÓN MEJORADA
// ✅ MANTIENE: Toda la funcionalidad actual
// 🔧 AÑADE: Tokens personalizados, mejor organización, documentación
// 🎯 PREPARA: Para eliminar CSS inline de App.vue

import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';
// IMPORTAR TOKENS CUSTOM
import './custom-tokens.css' 

/**
 * ===== TEMA PRINCIPAL GESTION PROCESAL =====
 * Configuración completa del tema basado en Nora
 */
export const GestionProcesalTheme = definePreset(Nora, {
  semantic: {
    // ✅ MANTENER: Configuración de colores actual (funciona perfectamente)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',        // Color principal del sistema
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    // 🔧 AÑADIR: Tokens personalizados Iggsad
    iggsad: iggsadTokens,
    
    // ✅ MANTENER: Color scheme actual
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',      // ✅ Usado en App.vue - MANTENER
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        primary: {
          color: '{primary.600}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}'
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        }
      }
    }
  },
  
  components: {
    // ===== CARDS =====
    // ✅ MANTENER: Configuración actual que funciona
    card: {
      root: {
        background: '{surface.0}',
        borderRadius: '12px',           // ✅ MANTENER: Valor actual
        color: '{surface.700}',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // ✅ MANTENER
      },
      body: {
        padding: '1.5rem',              // ✅ MANTENER: Padding actual
        gap: '0.75rem'
      },
      caption: {
        gap: '0.5rem'
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: '600'
      },
      subtitle: {
        color: '{surface.500}'
      }
    },

    // ===== BOTONES =====
    // ✅ MANTENER: Configuración actual + mejoras mínimas
    button: {
      root: {
        borderRadius: '8px',            // ✅ MANTENER: Radio actual
        paddingX: '1.25rem',
        paddingY: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        fontFamily: '{iggsad.fonts.primary}', // 🔧 AÑADIR: Font consistente
        transitionDuration: '{iggsad.transitions.normal}', // 🔧 AÑADIR: Transición consistente
        focusRing: {
          width: '2px',
          style: 'solid',
          color: '{primary.500}',
          offset: '2px'
        }
      },
      
      // 🔧 MEJORAR: Botones de texto específicos (para App.vue)
      text: {
        primary: {
          color: '{surface.600}',       // ✅ Para botones usuario en App.vue
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
          hoverBackground: 'color-mix(in srgb, {primary.600} 10%, transparent)',
          activeBackground: 'color-mix(in srgb, {primary.600} 20%, transparent)',
          borderRadius: '{iggsad.radius.sm}',
          padding: '{iggsad.spacing.sm} {iggsad.spacing.md}',
          fontWeight: '500',
          transition: '{iggsad.transitions.fast}'
        }
      },
      
      raised: {
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' // ✅ MANTENER
      }
    },

    // ===== INPUTS =====
    // ✅ MANTENER: Configuración actual completa
    inputtext: {
      root: {
        background: '{surface.0}',
        disabledBackground: '{surface.200}',
        filledBackground: '{surface.50}',
        filledFocusBackground: '{surface.50}',
        borderColor: '{surface.300}',
        hoverBorderColor: '{primary.400}',
        focusBorderColor: '{primary.500}',
        invalidBorderColor: '{red.400}',
        color: '{surface.700}',
        disabledColor: '{surface.500}',
        placeholderColor: '{surface.500}',
        shadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        paddingX: '0.875rem',
        paddingY: '0.625rem',
        borderRadius: '6px',             // ✅ MANTENER
        fontFamily: '{iggsad.fonts.primary}', // 🔧 AÑADIR
        transitionDuration: '{iggsad.transitions.normal}', // 🔧 AÑADIR
        focusRing: {
          width: '2px',
          style: 'solid',
          color: '{primary.500}',
          offset: '-1px'
        }
      }
    },

    // ===== SELECT =====
    // ✅ MANTENER: Configuración actual completa
    select: {
      root: {
        background: '{surface.0}',
        disabledBackground: '{surface.200}',
        filledBackground: '{surface.50}',
        filledFocusBackground: '{surface.50}',
        borderColor: '{surface.300}',
        hoverBorderColor: '{primary.400}',
        focusBorderColor: '{primary.500}',
        invalidBorderColor: '{red.400}',
        color: '{surface.700}',
        disabledColor: '{surface.500}',
        placeholderColor: '{surface.500}',
        shadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        paddingX: '0.875rem',
        paddingY: '0.625rem',
        borderRadius: '6px',             // ✅ MANTENER
        focusRing: {
          width: '2px',
          style: 'solid',
          color: '{primary.500}',
          offset: '-1px'
        }
      }
    },

    // ===== MENUBAR =====
    // ✅ MANTENER: Toda la configuración actual (es perfecta para App.vue)
    menubar: {
      root: {
        background: 'transparent',       // ✅ MANTENER: Exacto para App.vue
        borderColor: 'transparent',      // ✅ MANTENER: Sin borde
        color: '{surface.700}',          // ✅ MANTENER: Texto gris oscuro
        borderRadius: '0px',             // ✅ MANTENER: Sin radio
        padding: '0',                    // ✅ MANTENER: Sin padding
        fontFamily: '{iggsad.fonts.primary}' // 🔧 AÑADIR: Font consistente
      },
      item: {
        focusBackground: '{primary.600}', // ✅ MANTENER: Fondo azul sólido en hover
        activeBackground: '{primary.700}', // ✅ MANTENER: Activo azul más oscuro
        color: '{surface.700}',          // ✅ MANTENER: Texto gris oscuro normal
        focusColor: '#ffffff',           // ✅ MANTENER: Texto blanco en hover
        activeColor: '#ffffff',          // ✅ MANTENER: Texto blanco cuando activo
        padding: '0.5rem 1rem',          // ✅ MANTENER: Padding exacto
        borderRadius: '6px',             // ✅ MANTENER: Radio exacto
        gap: '0.5rem',                   // ✅ MANTENER
        transitionDuration: '{iggsad.transitions.fast}', // 🔧 AÑADIR
        icon: {
          color: '{surface.600}',        // ✅ MANTENER: Icono gris normal
          focusColor: '#ffffff',         // ✅ MANTENER: Icono blanco en hover
          activeColor: '#ffffff'         // ✅ MANTENER: Icono blanco cuando activo
        }
      },
      
      // ✅ MANTENER: Configuración completa de submenú
      submenu: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
        color: '{surface.700}',
        shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // ✅ Exacto App.vue
        padding: '0.5rem 0',
        gap: '2px',
        borderRadius: '8px',             // ✅ MANTENER: Exacto App.vue
        minWidth: '200px',               // 🔧 AÑADIR: Del CSS de App.vue
        marginTop: '0.5rem'              // 🔧 AÑADIR: Del CSS de App.vue
      },
      submenuitem: {
        focusBackground: '{surface.100}', // ✅ MANTENER: slate-100
        activeBackground: '{surface.100}',
        color: '{surface.700}',
        focusColor: '{surface.800}',
        activeColor: '{surface.800}',
        padding: '0.75rem 1rem',         // ✅ MANTENER: Exacto App.vue
        borderRadius: '6px',             // 🔧 CAMBIAR: 0px → 6px (mejora de App.vue)
        gap: '0.5rem',
        margin: '0.25rem',               // 🔧 AÑADIR: Del CSS de App.vue
        transitionDuration: '{iggsad.transitions.fast}', // 🔧 AÑADIR
        icon: {
          color: '{surface.500}',
          focusColor: '{surface.600}',
          activeColor: '{surface.600}'
        }
      },
      separator: {
        borderColor: '{surface.200}',
        margin: '0.5rem 0.25rem',        // 🔧 AÑADIR: Del CSS de App.vue
        borderTop: '1px solid {surface.200}' // 🔧 AÑADIR: Del CSS de App.vue
      }
    },

    // ===== BADGE =====
    // ✅ MANTENER: Configuración actual completa
    badge: {
      root: {
        background: '{primary.color}',
        color: '#ffffff',               // ✅ MANTENER: Blanco siempre
        fontSize: '0.75rem',
        fontWeight: '700',
        minWidth: '1.5rem',
        height: '1.5rem',
        borderRadius: '{iggsad.radius.xl}' // 🔧 MEJORAR: Usar token
      },
      sm: {
        fontSize: '0.625rem',
        minWidth: '1.25rem',
        height: '1.25rem'
      },
      lg: {
        fontSize: '0.875rem',
        minWidth: '1.75rem',
        height: '1.75rem'
      },
      xl: {
        fontSize: '1rem',
        minWidth: '2rem',
        height: '2rem'
      }
    },

    // ===== TOAST =====
    // ✅ MANTENER: Configuración base (los estilos JS la complementan)
    toast: {
      root: {
        width: '25rem',                 // ✅ MANTENER: Ancho exacto
        borderRadius: '12px',           // ✅ MANTENER: Radio exacto
        borderWidth: '0px',             // ✅ MANTENER: Sin bordes (los estilos JS los añaden)
        fontFamily: '{iggsad.fonts.primary}', // 🔧 AÑADIR
        transitionDuration: '{transition.duration}' // ✅ MANTENER
      },
      icon: {
        size: '1.25rem'                 // ✅ MANTENER
      },
      content: {
        padding: '1rem',                // ✅ MANTENER
        gap: '0.5rem'                   // ✅ MANTENER
      },
      text: {
        gap: '0.5rem'                   // ✅ MANTENER
      },
      summary: {
        fontWeight: '600',              // ✅ MANTENER
        fontSize: '1rem'                // ✅ MANTENER
      },
      detail: {
        fontWeight: '500',              // ✅ MANTENER
        fontSize: '0.875rem'            // ✅ MANTENER
      },
      closeButton: {
        width: '1.75rem',
        height: '1.75rem',
        borderRadius: '50%',
        focusRing: {
          width: '1px',
          style: 'solid',
          offset: '2px'
        }
      },
      closeIcon: {
        size: '1rem'
      }
    },

    // ===== DRAWER =====
    // 🔧 AÑADIR: Configuración para DrawerPanel (usado en Dashboard)
    drawer: {
      root: {
        borderRadius: '0px'             // Sin radio en los bordes
      },
      header: {
        padding: '{iggsad.spacing.lg}',
        borderBottomWidth: '1px',
        borderBottomColor: '{surface.200}',
        fontFamily: '{iggsad.fonts.primary}'
      },
      content: {
        padding: '{iggsad.spacing.lg}',
        fontFamily: '{iggsad.fonts.primary}'
      },
      footer: {
        padding: '{iggsad.spacing.md} {iggsad.spacing.lg}',
        borderTopWidth: '1px',
        borderTopColor: '{surface.200}'
      }
    },

    // ===== DIALOG =====
    // 🔧 AÑADIR: Para modales de configuración
    dialog: {
      root: {
        borderRadius: '{iggsad.radius.lg}',
        shadow: '{iggsad.shadows.xl}',
        fontFamily: '{iggsad.fonts.primary}'
      },
      header: {
        padding: '{iggsad.spacing.lg} {iggsad.spacing.lg} {iggsad.spacing.md} {iggsad.spacing.lg}',
        borderBottomWidth: '1px',
        borderBottomColor: '{surface.200}'
      },
      content: {
        padding: '{iggsad.spacing.md} {iggsad.spacing.lg}'
      },
      footer: {
        padding: '{iggsad.spacing.md} {iggsad.spacing.lg} {iggsad.spacing.lg} {iggsad.spacing.lg}',
        borderTopWidth: '1px',
        borderTopColor: '{surface.200}',
        gap: '{iggsad.spacing.sm}'
      }
    }
  }
});



