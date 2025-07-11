import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

import './custom-tokens.css';

/**
 * ===== TEMA GESTIÓN PROCESAL CON TOKENS EXPANDIDOS =====
 * Usa el sistema completo de tokens para máxima consistencia
 */
export const GestionProcesalTheme = definePreset(Nora, {
  semantic: {
    // ===== COLORES PRINCIPALES =====
    // ✅ MANTENER: Configuración base que funciona
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',        // ← Coincide con --iggsad-primary-600
      700: '#1d4ed8',        // ← Coincide con --iggsad-primary-700
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554'
    },
    
    // ===== SUPERFICIES (GRISES) =====
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',        // ← Coincide con --iggsad-surface-white
          50: '#f8fafc',       // ← Coincide con --iggsad-surface-50
          100: '#f1f5f9',
          200: '#e2e8f0',      // ← Coincide con --iggsad-surface-200
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',      // ← Coincide con --iggsad-surface-700
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        primary: {
          color: 'var(--iggsad-primary-600)',           
          inverseColor: 'var(--iggsad-surface-white)',  
          hoverColor: 'var(--iggsad-primary-700)',      
          activeColor: 'var(--iggsad-primary-800)'      
        },
        highlight: {
          background: 'var(--iggsad-primary-50)',       
          focusBackground: 'var(--iggsad-primary-100)', 
          color: 'var(--iggsad-primary-700)',           
          focusColor: 'var(--iggsad-primary-800)'       
        }
      },
      dark: {
        surface: {
          0: '#0f172a',        // ← --iggsad-surface-white (dark)
          50: '#1e293b',       // ← --iggsad-surface-50 (dark)
          100: '#334155',      // ← --iggsad-surface-100 (dark)
          200: '#475569',      // ← --iggsad-surface-200 (dark)
          300: '#64748b',      // ← --iggsad-surface-300 (dark)
          400: '#94a3b8',      // ← Se mantiene igual
          500: '#cbd5e1',      // ← --iggsad-surface-500 (dark)
          600: '#e2e8f0',      // ← --iggsad-surface-600 (dark)
          700: '#f1f5f9',      // ← --iggsad-surface-700 (dark)
          800: '#f8fafc',      // ← --iggsad-surface-800 (dark)
          900: '#ffffff',      // ← --iggsad-surface-900 (dark)
          950: '#ffffff'       // ← Blanco puro
        },
        primary: {
          color: 'var(--iggsad-primary-500)',           // 🌙 Más claro para contraste
          inverseColor: 'var(--iggsad-surface-white)',  // 🌙 Fondo oscuro
          hoverColor: 'var(--iggsad-primary-400)',      // 🌙 Más claro en hover
          activeColor: 'var(--iggsad-primary-300)'      // 🌙 Muy claro en active
        },
        highlight: {
          background: 'var(--iggsad-primary-800)',      // 🌙 Fondo más oscuro
          focusBackground: 'var(--iggsad-primary-700)', // 🌙 Focus más oscuro
          color: 'var(--iggsad-primary-300)',           // 🌙 Texto claro
          focusColor: 'var(--iggsad-primary-200)'       // 🌙 Focus muy claro
        }
      }
    }
  },
  
  components: {
    // ===== MENUBAR (App.vue) =====
    menubar: {
      root: {
        background: 'transparent',
        borderColor: 'transparent',
        color: 'var(--iggsad-surface-700)',             
        borderRadius: 'var(--iggsad-radius-none)',      
        padding: 'var(--iggsad-spacing-none)',          
        gap: 'var(--iggsad-spacing-none)'               
      },
      item: {
        focusBackground: 'var(--iggsad-primary-600)',   
        focusColor: 'var(--iggsad-surface-white)',      
        activeBackground: 'var(--iggsad-primary-600)',  
        activeColor: 'var(--iggsad-surface-white)',     
        padding: 'var(--iggsad-menubar-item-padding)',  
        borderRadius: 'var(--iggsad-radius-sm)',        
        gap: 'var(--iggsad-spacing-sm)',                
        fontWeight: 'var(--iggsad-font-medium)',        
        color: 'var(--iggsad-surface-700)',             
        hoverBackground: 'var(--iggsad-primary-600)',   
        hoverColor: 'var(--iggsad-surface-white)'       
      },
      submenu: {
        background: 'var(--iggsad-surface-white)',      
        borderRadius: 'var(--iggsad-radius-md)',        
        border: 'var(--iggsad-border-width-thin) var(--iggsad-border-solid) var(--iggsad-surface-200)', 
        boxShadow: 'var(--iggsad-shadow-md)',           
        padding: 'var(--iggsad-spacing-sm) var(--iggsad-spacing-none)', 
        gap: 'var(--iggsad-spacing-0-5)'                
      },
      submenuItem: {
        focusBackground: 'var(--iggsad-primary-50)',    
        focusColor: 'var(--iggsad-primary-700)',        
        activeBackground: 'var(--iggsad-primary-100)',  
        activeColor: 'var(--iggsad-primary-800)',       
        padding: 'var(--iggsad-spacing-sm) var(--iggsad-spacing-md)', 
        borderRadius: 'var(--iggsad-radius-sm)',        
        gap: 'var(--iggsad-spacing-sm)',                
        color: 'var(--iggsad-surface-700)',             
        hoverBackground: 'var(--iggsad-primary-50)',    
        hoverColor: 'var(--iggsad-primary-700)'         
      }
    },

    // ===== CARDS =====
    card: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        borderRadius: 'var(--iggsad-radius-lg)',        
        color: 'var(--iggsad-surface-700)',             
        shadow: 'var(--iggsad-shadow-md)',              
        padding: 'var(--iggsad-spacing-lg)'             
      },
      body: {
        padding: 'var(--iggsad-spacing-none)',          
        gap: 'var(--iggsad-spacing-md)'                 
      },
      caption: {
        gap: 'var(--iggsad-spacing-sm)'                 
      },
      title: {
        fontSize: 'var(--iggsad-text-xl)',              
        fontWeight: 'var(--iggsad-font-semibold)',      
        color: 'var(--iggsad-surface-800)'              
      },
      subtitle: {
        color: 'var(--iggsad-surface-600)',             
        fontSize: 'var(--iggsad-text-sm)'               
      }
    },

    // ===== BUTTONS =====
    button: {
      root: {
        borderRadius: 'var(--iggsad-radius-md)',        
        fontWeight: 'var(--iggsad-font-medium)',        
        focusRing: {
          width: 'var(--iggsad-focus-ring-width)',      
          style: 'var(--iggsad-focus-ring-style)',      
          color: 'var(--iggsad-primary-600)',           
          offset: 'var(--iggsad-spacing-0-5)',          
          shadow: 'var(--iggsad-shadow-none)'           
        }
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: 'var(--iggsad-primary-600)',         
              hoverBackground: 'var(--iggsad-primary-700)',    
              activeBackground: 'var(--iggsad-primary-800)',   
              borderColor: 'var(--iggsad-primary-600)',        
              hoverBorderColor: 'var(--iggsad-primary-700)',   
              activeBorderColor: 'var(--iggsad-primary-800)',  
              color: 'var(--iggsad-surface-white)',            
              hoverColor: 'var(--iggsad-surface-white)',       
              activeColor: 'var(--iggsad-surface-white)'       
            },
            secondary: {
              background: 'var(--iggsad-surface-100)',         
              hoverBackground: 'var(--iggsad-surface-200)',    
              activeBackground: 'var(--iggsad-surface-300)',   
              borderColor: 'var(--iggsad-surface-100)',        
              hoverBorderColor: 'var(--iggsad-surface-200)',   
              activeBorderColor: 'var(--iggsad-surface-300)',  
              color: 'var(--iggsad-surface-600)',              
              hoverColor: 'var(--iggsad-surface-700)',         
              activeColor: 'var(--iggsad-surface-800)'         
            }
          }
        },
        dark: {
          root: {
            primary: {
              background: 'var(--iggsad-primary-600)',         // 🌙 Mantiene azul vibrante
              hoverBackground: 'var(--iggsad-primary-500)',    // 🌙 Más claro en hover
              activeBackground: 'var(--iggsad-primary-700)',   // 🌙 Más oscuro en active
              borderColor: 'var(--iggsad-primary-600)',
              hoverBorderColor: 'var(--iggsad-primary-500)',
              activeBorderColor: 'var(--iggsad-primary-700)',
              color: 'var(--iggsad-surface-white)',            // 🌙 Texto oscuro sobre azul
              hoverColor: 'var(--iggsad-surface-white)',
              activeColor: 'var(--iggsad-surface-white)'
            },
            secondary: {
              background: 'var(--iggsad-surface-100)',         // 🌙 = #334155 en dark
              hoverBackground: 'var(--iggsad-surface-200)',    // 🌙 = #475569 en dark
              activeBackground: 'var(--iggsad-surface-300)',   // 🌙 = #64748b en dark
              borderColor: 'var(--iggsad-surface-200)',        // 🌙 Borde visible
              hoverBorderColor: 'var(--iggsad-surface-300)',
              activeBorderColor: 'var(--iggsad-surface-400)',
              color: 'var(--iggsad-surface-700)',              // 🌙 = #f1f5f9 en dark (claro)
              hoverColor: 'var(--iggsad-surface-800)',         // 🌙 = #f8fafc en dark (más claro)
              activeColor: 'var(--iggsad-surface-900)'         // 🌙 = #ffffff en dark (blanco)
            }
          }
        }
      },
      raised: {
        shadow: 'var(--iggsad-shadow-sm)'               
      }
    },

    // ===== TOOLTIP =====
    tooltip: {
      root: {
        maxWidth: '12rem',
        padding: 'var(--iggsad-spacing-sm) var(--iggsad-spacing-sm)',
        background: 'var(--iggsad-surface-600) !important',
        color: 'var(--iggsad-surface-white)',
        borderRadius: 'var(--iggsad-radius-md)',
        fontSize: 'var(--iggsad-text-xxs) !important',
        fontWeight: 'var(--iggsad-font-normal)',
        boxShadow: 'var(--iggsad-shadow-lg)',
        zIndex: 'var(--iggsad-z-tooltip)'
      },
      arrow: {
        color: 'var(--iggsad-surface-600) !important'
      }
    },

    // ===== TOAST =====
    toast: {
      root: {
        width: 'var(--iggsad-toast-width)',             
        borderRadius: 'var(--iggsad-radius-lg)',        
        border: 'var(--iggsad-border-width-none)',      
        shadow: 'var(--iggsad-shadow-lg)'               
      },
      content: {
        gap: 'var(--iggsad-spacing-md-minus)',          
        padding: 'var(--iggsad-spacing-md)'             
      },
      text: {
        gap: 'var(--iggsad-spacing-sm)'                 
      },
      summary: {
        fontWeight: 'var(--iggsad-font-semibold)',      
        fontSize: 'var(--iggsad-text-base)'             
      },
      detail: {
        fontWeight: 'var(--iggsad-font-normal)',        
        fontSize: 'var(--iggsad-text-sm)'               
      },
      closeButton: {
        width: 'var(--iggsad-height-sm)',               
        height: 'var(--iggsad-height-sm)',              
        borderRadius: 'var(--iggsad-radius-full)',      
        focusRing: {
          width: 'var(--iggsad-focus-ring-width)',      
          style: 'var(--iggsad-focus-ring-style)',      
          offset: 'var(--iggsad-spacing-0-5)'           
        }
      },
      closeIcon: {
        fontSize: 'var(--iggsad-text-sm)'               
      }
    },

    // ===== INPUTS =====
    inputtext: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        disabledBackground: 'var(--iggsad-surface-200)', 
        filledBackground: 'var(--iggsad-surface-50)',   
        filledFocusBackground: 'var(--iggsad-surface-50)', 
        borderColor: 'var(--iggsad-surface-300)',       
        hoverBorderColor: 'var(--iggsad-primary-400)',  
        focusBorderColor: 'var(--iggsad-primary-500)',  
        invalidBorderColor: 'var(--iggsad-error-color)', 
        color: 'var(--iggsad-surface-700)',             
        disabledColor: 'var(--iggsad-surface-500)',     
        placeholderColor: 'var(--iggsad-surface-500)',  
        shadow: 'var(--iggsad-shadow-inner)',           
        paddingX: 'var(--iggsad-input-padding-x)',      
        paddingY: 'var(--iggsad-input-padding-y)',      
        borderRadius: 'var(--iggsad-radius-sm)',        
        focusRing: {
          width: 'var(--iggsad-focus-ring-width)',      
          style: 'var(--iggsad-focus-ring-style)',      
          color: 'var(--iggsad-primary-500)',           
          offset: 'var(--iggsad-focus-ring-offset)'     
        }
      }
    },

    // ===== SELECT =====
    select: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        disabledBackground: 'var(--iggsad-surface-200)', 
        filledBackground: 'var(--iggsad-surface-50)',   
        filledFocusBackground: 'var(--iggsad-surface-50)', 
        borderColor: 'var(--iggsad-surface-300)',       
        hoverBorderColor: 'var(--iggsad-primary-400)',  
        focusBorderColor: 'var(--iggsad-primary-500)',  
        invalidBorderColor: 'var(--iggsad-error-color)', 
        color: 'var(--iggsad-surface-700)',             
        disabledColor: 'var(--iggsad-surface-500)',     
        placeholderColor: 'var(--iggsad-surface-500)',  
        shadow: 'var(--iggsad-shadow-inner)',           
        paddingX: 'var(--iggsad-input-padding-x)',      
        paddingY: 'var(--iggsad-input-padding-y)',      
        borderRadius: 'var(--iggsad-radius-sm)',        
        focusRing: {
          width: 'var(--iggsad-focus-ring-width)',      
          style: 'var(--iggsad-focus-ring-style)',      
          color: 'var(--iggsad-primary-500)',           
          offset: 'var(--iggsad-focus-ring-offset)'     
        }
      },
      dropdown: {
        width: 'var(--iggsad-width-md)',                
        color: 'var(--iggsad-surface-500)'              
      },
      overlay: {
        background: 'var(--iggsad-surface-white)',      
        borderColor: 'var(--iggsad-surface-300)',       
        borderRadius: 'var(--iggsad-radius-md)',        
        shadow: 'var(--iggsad-shadow-md)'               
      },
      list: {
        padding: 'var(--iggsad-spacing-sm) var(--iggsad-spacing-none)', 
        gap: 'var(--iggsad-spacing-0-5)'                
      },
      option: {
        focusBackground: 'var(--iggsad-primary-100)',   
        selectedBackground: 'var(--iggsad-primary-500)', 
        selectedFocusBackground: 'var(--iggsad-primary-600)', 
        color: 'var(--iggsad-surface-700)',             
        focusColor: 'var(--iggsad-surface-800)',        
        selectedColor: 'var(--iggsad-surface-white)',   
        selectedFocusColor: 'var(--iggsad-surface-white)', 
        padding: 'var(--iggsad-spacing-sm) var(--iggsad-spacing-md)', 
        borderRadius: 'var(--iggsad-radius-sm)'         
      }
    },

    // ===== PANEL =====
    panel: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        borderRadius: 'var(--iggsad-radius-md)'         
      },
      header: {
        background: 'var(--iggsad-surface-50)',         
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        padding: 'var(--iggsad-spacing-md)',            
        borderRadius: 'var(--iggsad-radius-md) var(--iggsad-radius-md) var(--iggsad-radius-none) var(--iggsad-radius-none)', 
        fontWeight: 'var(--iggsad-font-semibold)'       
      },
      content: {
        padding: 'var(--iggsad-spacing-md)'             
      }
    },

    // ===== DATATABLE =====
    datatable: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        borderRadius: 'var(--iggsad-radius-md)'         
      },
      header: {
        background: 'var(--iggsad-surface-50)',         
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        padding: 'var(--iggsad-spacing-md)',            
        fontWeight: 'var(--iggsad-font-semibold)'       
      },
      headerCell: {
        background: 'var(--iggsad-surface-50)',         
        hoverBackground: 'var(--iggsad-surface-100)',   
        selectedBackground: 'var(--iggsad-primary-100)', 
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        hoverColor: 'var(--iggsad-surface-800)',        
        selectedColor: 'var(--iggsad-primary-700)',     
        gap: 'var(--iggsad-spacing-sm)',                
        padding: 'var(--iggsad-spacing-md-minus) var(--iggsad-spacing-md)', 
        focusRing: {
          width: 'var(--iggsad-focus-ring-width)',      
          style: 'var(--iggsad-focus-ring-style)',      
          color: 'var(--iggsad-primary-500)',           
          offset: 'var(--iggsad-focus-ring-offset)'     
        }
      },
      bodyCell: {
        borderColor: 'var(--iggsad-surface-200)',       
        selectedBorderColor: 'var(--iggsad-primary-500)', 
        color: 'var(--iggsad-surface-700)',             
        selectedColor: 'var(--iggsad-primary-700)',     
        selectedBackground: 'var(--iggsad-primary-50)', 
        padding: 'var(--iggsad-spacing-md-minus) var(--iggsad-spacing-md)', 
        gap: 'var(--iggsad-spacing-sm)'                 
      }
    },

    // ===== DIALOG =====
    dialog: {
      root: {
        background: 'var(--iggsad-surface-white)',      
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-700)',             
        borderRadius: 'var(--iggsad-radius-xl)',        
        shadow: 'var(--iggsad-shadow-xl)'               
      },
      header: {
        padding: 'var(--iggsad-spacing-lg) var(--iggsad-spacing-lg) var(--iggsad-spacing-md) var(--iggsad-spacing-lg)', 
        gap: 'var(--iggsad-spacing-sm)'                 
      },
      title: {
        fontWeight: 'var(--iggsad-font-semibold)',      
        fontSize: 'var(--iggsad-text-xl)'               
      },
      content: {
        padding: 'var(--iggsad-spacing-none) var(--iggsad-spacing-lg) var(--iggsad-spacing-lg) var(--iggsad-spacing-lg)' 
      },
      footer: {
        padding: 'var(--iggsad-spacing-md) var(--iggsad-spacing-lg) var(--iggsad-spacing-lg) var(--iggsad-spacing-lg)', 
        gap: 'var(--iggsad-spacing-sm)'                 
      }
    },

    // ===== PROGRESSBAR =====
    progressbar: {
      root: {
        background: 'var(--iggsad-surface-200)',        
        borderRadius: 'var(--iggsad-radius-sm)',        
        height: 'var(--iggsad-spacing-sm)'              
      },
      value: {
        background: 'var(--iggsad-primary-600)',        
        borderRadius: 'var(--iggsad-radius-sm)'         
      }
    },

    // ===== DIVIDER =====
    divider: {
      root: {
        borderColor: 'var(--iggsad-surface-200)',       
        color: 'var(--iggsad-surface-500)'              
      },
      content: {
        background: 'var(--iggsad-surface-white)',      
        padding: 'var(--iggsad-spacing-xs) var(--iggsad-spacing-md)' 
      }
    },

    // ===== SCROLLPANEL =====
    scrollpanel: {
      root: {
        background: 'var(--iggsad-surface-white)'       
      },
      bar: {
        background: 'var(--iggsad-surface-300)',        
        borderRadius: 'var(--iggsad-radius-full)',      
        size: 'var(--iggsad-spacing-xs)'                
      },
      barHandle: {
        background: 'var(--iggsad-surface-500)',        
        hoverBackground: 'var(--iggsad-surface-600)',   
        borderRadius: 'var(--iggsad-radius-full)'       
      }
    }
  }
});

// ===== EXPORT DEFAULT PARA COMPATIBILIDAD =====
export default GestionProcesalTheme;