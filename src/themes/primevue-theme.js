// primevue-theme.js
import { definePreset } from '@primeuix/themes';
import Nora from '@primeuix/themes/nora';

export const GestionProcesalTheme = definePreset(Nora, {
    semantic: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#172554'
        },
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
                    700: '#334155',
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
        card: {
            root: {
                background: '{surface.0}',
                borderRadius: '12px',
                color: '{surface.700}',
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            body: {
                padding: '1.5rem',
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
        button: {
            root: {
                borderRadius: '8px',
                paddingX: '1.25rem',
                paddingY: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                focusRing: {
                    width: '2px',
                    style: 'solid',
                    color: '{primary.500}',
                    offset: '2px'
                }
            },
            raised: {
                shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }
        },
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
                borderRadius: '6px',
                focusRing: {
                    width: '2px',
                    style: 'solid',
                    color: '{primary.500}',
                    offset: '-1px'
                }
            }
        },
        datepicker: {
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
                borderRadius: '6px',
                focusRing: {
                    width: '2px',
                    style: 'solid',
                    color: '{primary.500}',
                    offset: '-1px'
                }
            }
        },
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
                borderRadius: '6px',
                focusRing: {
                    width: '2px',
                    style: 'solid',
                    color: '{primary.500}',
                    offset: '-1px'
                }
            }
        },
        menubar: {
            root: {
                background: 'transparent', // Cambiado a transparente
                borderColor: 'transparent', // Sin borde
                color: '{surface.700}',     // Texto gris oscuro
                borderRadius: '0px',
                padding: '0'               // Sin padding
            },
            item: {
                focusBackground: '{primary.600}',    // Fondo azul sólido en hover
                activeBackground: '{primary.700}',   // Activo azul más oscuro
                color: '{surface.700}',              // Texto gris oscuro normal
                focusColor: '#ffffff',               // Texto blanco en hover
                activeColor: '#ffffff',              // Texto blanco cuando activo
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                gap: '0.5rem',
                icon: {
                    color: '{surface.600}',     // Icono gris normal
                    focusColor: '#ffffff',      // Icono blanco en hover
                    activeColor: '#ffffff'      // Icono blanco cuando activo
                }
            },
            submenu: {
                background: '{surface.0}',
                borderColor: '{surface.200}',
                color: '{surface.700}',
                shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '0.5rem 0',
                gap: '2px',
                borderRadius: '8px'
            },
            submenuitem: {
                focusBackground: '{surface.100}',
                activeBackground: '{surface.100}',
                color: '{surface.700}',
                focusColor: '{surface.800}',
                activeColor: '{surface.800}',
                padding: '0.75rem 1rem',
                borderRadius: '0px',
                gap: '0.5rem',
                icon: {
                    color: '{surface.500}',
                    focusColor: '{surface.600}',
                    activeColor: '{surface.600}'
                }
            }
        },
        badge: {
            root: {
                background: '{primary.color}',
                color: '#ffffff', // Blanco siempre
                fontSize: '0.75rem',
                fontWeight: '700',
                minWidth: '1.5rem',
                height: '1.5rem'
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
        toast: {
            root: {
                width: '25rem',
                borderRadius: '12px',
                borderWidth: '0px',
                transitionDuration: '{transition.duration}'
            },
            icon: {
                size: '1.25rem'
            },
            content: {
                padding: '1rem',
                gap: '0.5rem'
            },
            text: {
                gap: '0.5rem',
            },
            summary: {
                fontWeight: '600',
                fontSize: '1rem'
            },
            detail: {
                fontWeight: '500',
                fontSize: '0.875rem'
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
        }
    }
});