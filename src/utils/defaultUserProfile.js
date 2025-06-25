// utils/defaultUserProfile.js
export const getDefaultUserProfile = () => {
  return {
    dashboard: {
      // Layout del grid compatible con vue-grid-layout
      layout: [
        { i: 'stats-dashboard', x: 0, y: 0, w: 8, h: 4 },
        { i: 'recent-searches', x: 0, y: 4, w: 8, h: 5 },
        { i: 'notifications', x: 8, y: 0, w: 4, h: 6 },
        { i: 'chat', x: 8, y: 6, w: 4, h: 4 },
        { i: 'quick-actions', x: 8, y: 10, w: 4, h: 3 }
      ],
      
      // Configuración específica de cada card
      cardsConfig: {
        'stats-dashboard': {
          title: 'Estadísticas',
          selectedStats: [
            'casos-activos', 
            'audiencias-proximas', 
            'casos-urgentes', 
            'total-clientes'
          ],
          gridLayout: 'auto', // auto, 2x2, 1x4, 4x1
          showLabels: true,
          autoRefresh: false,
          refreshInterval: 30
        },
        'recent-searches': {
          title: 'Búsquedas Recientes',
          maxItems: 5,
          showActions: true,
          showStats: false,
          autoRefresh: true,
          refreshInterval: 60
        },
        'notifications': {
          title: 'Notificaciones',
          maxItems: 10,
          showMarkAllRead: true,
          autoRefresh: true,
          refreshInterval: 30,
          filterTypes: ['info', 'warning', 'error'],
          playSound: false
        },
        'chat': {
          title: 'Chat',
          maxMessages: 5,
          showOpenChat: true,
          showAvatars: true,
          autoRefresh: true,
          refreshInterval: 15
        },
        'quick-actions': {
          title: 'Acciones Rápidas',
          layout: 'vertical', // vertical, horizontal
          showLabels: true,
          actions: [
            'nuevo-caso',
            'subir-documento', 
            'nuevo-cliente',
            'calendario'
          ]
        }
      },
      
      // Configuración global del dashboard
      globalConfig: {
        configMode: false,
        autoSave: true,
        showGridLines: false,
        compactMode: false,
        animations: true
      }
    },

    // ===== CONFIGURACIÓN DEL DOCK =====
    dock: {
      enabled: true,
      position: 'bottom', // top, right, bottom, left
      edge: 'bottom',
      autoHide: false,
      autoHideDelay: 3000,
      showTooltips: true,
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard',
          icon: 'pi pi-home',
          visible: true, 
          order: 1,
          active: false,
          badge: null
        },
        { 
          id: 'casos', 
          label: 'Casos',
          icon: 'pi pi-folder',
          visible: true, 
          order: 2,
          active: false,
          badge: '147'
        },
        { 
          id: 'audiencias', 
          label: 'Audiencias',
          icon: 'pi pi-calendar',
          visible: true, 
          order: 3,
          active: false,
          badge: '12'
        },
        { 
          id: 'clientes', 
          label: 'Clientes',
          icon: 'pi pi-users',
          visible: true, 
          order: 4,
          active: false,
          badge: null
        },
        { 
          id: 'documentos', 
          label: 'Documentos',
          icon: 'pi pi-file',
          visible: true, 
          order: 5,
          active: false,
          badge: '23'
        },
        { 
          id: 'config', 
          label: 'Configuración',
          icon: 'pi pi-cog',
          visible: true, 
          order: 6,
          active: false,
          badge: null
        }
      ]
    },

    // ===== CONFIGURACIÓN DE FILTROS =====
    filters: {
      // Filtros por defecto que se aplican automáticamente
      defaults: {
        status: null,
        processType: [],
        priority: [],
        dateRange: null
      },
      
      // Filtros guardados como favoritos
      favorites: [
        {
          id: 'casos-urgentes',
          name: 'Casos Urgentes',
          filters: {
            priority: ['alta'],
            status: 'activo'
          }
        },
        {
          id: 'audiencias-semana',
          name: 'Audiencias Esta Semana',
          filters: {
            processType: ['audiencia'],
            dateRange: 'this-week'
          }
        }
      ],
      
      // Secciones expandidas por defecto en el panel de filtros
      expandedSections: [
        'procedimiento-basico',
        'fechas'
      ],
      
      // Configuración del panel de filtros
      panelConfig: {
        position: 'bottom', // bottom, left, right
        height: '75vh',
        fullscreenEnabled: true,
        quickFiltersEnabled: true,
        floatingFiltersEnabled: true
      }
    },

    // ===== PREFERENCIAS GENERALES =====
    preferences: {
      // Tema y apariencia
      theme: 'light', // light, dark, auto
      language: 'es', // es, en, fr, etc.
      dateFormat: 'dd/mm/yyyy', // dd/mm/yyyy, mm/dd/yyyy, yyyy-mm-dd
      timeFormat: '24h', // 12h, 24h
      currency: 'EUR',
      currencyPosition: 'after', // before, after
      
      // Comportamiento de la aplicación
      autoSave: true,
      autoSaveInterval: 30, // segundos
      confirmBeforeDelete: true,
      showWelcomeMessage: true,
      enableNotifications: true,
      enableSounds: false,
      
      // Configuración de búsqueda
      searchConfig: {
        saveHistory: true,
        maxHistoryItems: 20,
        showSuggestions: true,
        fuzzySearch: true
      },
      
      // Configuración de exportación
      exportConfig: {
        defaultFormat: 'xlsx', // xlsx, csv, pdf
        includeFilters: true,
        includeMetadata: true
      }
    },

    // ===== CONFIGURACIÓN DE NOTIFICACIONES =====
    notifications: {
      enabled: true,
      types: {
        'case-update': { enabled: true, sound: false, desktop: true },
        'hearing-reminder': { enabled: true, sound: true, desktop: true },
        'document-uploaded': { enabled: true, sound: false, desktop: false },
        'deadline-warning': { enabled: true, sound: true, desktop: true },
        'system-message': { enabled: true, sound: false, desktop: true }
      },
      schedule: {
        startTime: '09:00',
        endTime: '18:00',
        weekends: false,
        holidays: false
      }
    },

    // ===== CONFIGURACIÓN DE INTEGRACIONES =====
    integrations: {
      calendar: {
        enabled: false,
        provider: null, // google, outlook, etc.
        syncInterval: 15 // minutos
      },
      email: {
        enabled: false,
        autoImport: false,
        folderWatch: []
      }
    },

    // ===== METADATOS DEL PERFIL =====
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      migrationVersion: 1
    }
  }
}


