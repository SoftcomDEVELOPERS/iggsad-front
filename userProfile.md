``` js
// Estructura que añadiremos al auth/me response (data.userProfile)
const userProfileStructure = {
  userProfile: {
    dashboard: {
      layout: 'grid-auto', // 'grid-2-cols', 'grid-3-cols', 'grid-auto', 'custom'
      cards: [
        {
          id: 'casos-activos',
          type: 'stat',
          visible: true,
          order: 1,
          size: 'normal', // 'small', 'normal', 'large', 'xl'
          position: { row: 1, col: 1 } // para layout custom
        },
        {
          id: 'audiencias-proximas',
          type: 'stat', 
          visible: true,
          order: 2,
          size: 'normal',
          position: { row: 1, col: 2 }
        },
        {
          id: 'casos-urgentes',
          type: 'stat',
          visible: true, 
          order: 3,
          size: 'normal',
          position: { row: 2, col: 1 }
        },
        {
          id: 'total-clientes',
          type: 'stat',
          visible: false, // Usuario lo ocultó
          order: 4,
          size: 'normal',
          position: { row: 2, col: 2 }
        },
        {
          id: 'busquedas-recientes',
          type: 'content',
          visible: true,
          order: 5,
          size: 'large',
          position: { row: 3, col: 1, colspan: 2 }
        },
        {
          id: 'notificaciones',
          type: 'sidebar',
          visible: true,
          order: 6,
          size: 'normal',
          position: { row: 1, col: 3, rowspan: 2 }
        },
        {
          id: 'chat',
          type: 'sidebar',
          visible: true,
          order: 7, 
          size: 'normal',
          position: { row: 3, col: 3 }
        },
        {
          id: 'acciones-rapidas',
          type: 'sidebar',
          visible: true,
          order: 8,
          size: 'small',
          position: { row: 4, col: 3 }
        }
      ]
    },
    dock: {
      enabled: true,
      position: 'bottom', // 'top', 'right', 'bottom', 'left'
      autoHide: false,
      autoHideDelay: 3000,
      items: [
        { id: 'casos', visible: true, order: 1 },
        { id: 'audiencias', visible: true, order: 2 },
        { id: 'clientes', visible: true, order: 3 },
        { id: 'documentos', visible: true, order: 4 },
        { id: 'perfil', visible: false, order: 5 } // Usuario lo ocultó
      ]
    },
    filters: {
      defaults: {
        cliente: ['activos'],
        cartera: ['activas'],
        estadoExpediente: ['todos']
      },
      favorites: ['cliente', 'estadoExpediente', 'fechaExpediente'], 
      expandedSections: ['procedimiento-basico', 'fechas'],
      quickAccess: ['cliente', 'estadoExpediente'] // Filtros en acceso rápido
    },
    preferences: {
      theme: 'light', // 'light', 'dark', 'auto'
      language: 'es',
      dateFormat: 'dd/mm/yyyy',
      notifications: {
        toast: true,
        sound: false,
        desktop: true
      }
    }
  }
}
```
