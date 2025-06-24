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


¡Me parece una idea GENIAL! 🚀 Un sistema de personalización completo va a hacer que la aplicación sea mucho más útil y personal para cada usuario. 

## 🎯 **Plan de implementación paso a paso:**

### 📋 **Análisis de lo que quieres personalizar:**

1. **Cards del Dashboard (LandingPage)**
   - ✅ Qué tarjetas mostrar/ocultar
   - ✅ Orden de las tarjetas
   - ✅ Tamaño de las tarjetas (grid responsive)

2. **Dock**
   - ✅ Activado/desactivado
   - ✅ Posición inicial (top/right/bottom/left)
   - ✅ Auto-hide configuración

3. **FilterPanel**
   - ✅ Filtros preseleccionados por defecto
   - ✅ Secciones expandidas/colapsadas por defecto
   - ✅ Filtros favoritos

4. **Sistema de Grid**
   - ✅ Posición y tamaño de cada panel
   - ✅ Layout personalizado por usuario

## 🗂️ **Estructura que propongo:**

### **1. Store de personalización (`stores/userSettings.js`)**
```javascript
// Estructura del perfil de usuario
userSettings: {
  dashboard: {
    cards: [
      { id: 'stats', visible: true, order: 1, size: 'normal' },
      { id: 'recent-searches', visible: true, order: 2, size: 'large' },
      // ...
    ],
    layout: 'grid-3-cols' // o personalizado
  },
  dock: {
    enabled: true,
    position: 'bottom',
    autoHide: false,
    items: ['casos', 'audiencias', 'clientes'] // orden personalizado
  },
  filters: {
    defaults: {
      cliente: ['activos'],
      estadoExpediente: ['todos']
    },
    favorites: ['cliente', 'estadoExpediente', 'fechaExpediente'],
    expandedSections: ['procedimiento', 'fechas']
  },
  grid: {
    panels: [
      { id: 'main-content', x: 0, y: 0, w: 8, h: 12 },
      { id: 'sidebar', x: 8, y: 0, w: 4, h: 12 }
    ]
  }
}
```

### **2. Servicio de personalización (`services/userSettings.services.js`)**
- GET/PUT para obtener y guardar configuración
- Sincronización con backend

### **3. Composables para cada sección**
- `useUserDashboard.js` → Gestión de cards del dashboard
- `useUserDock.js` → Configuración del dock
- `useUserFilters.js` → Filtros preseleccionados
- `useUserGrid.js` → Sistema de grid personalizable

### **4. Componentes de configuración**
- Panel de configuración modal/drawer
- Switches, selects, drag&drop para personalizar

## 🤔 **Preguntas para empezar:**

1. **¿Cómo llega la configuración en el `auth/me`?** 
   - ¿Viene en un campo como `userProfile` o `settings`?
   - ¿Qué estructura JSON tiene en la respuesta?

2. **¿Prefieres empezar por alguna sección específica?**
   - Dashboard cards (más visual)
   - Dock (más simple)
   - Filtros (más funcional)

3. **¿Quieres un panel de configuración único o distribuido?**
   - Un modal/drawer central con pestañas
   - Botones de configuración en cada sección

4. **¿Para el grid usamos alguna librería específica?**
   - Vue Grid Layout
   - CSS Grid personalizado
   - Algo más simple con Flexbox

¿Por cuál empezamos? Yo sugiero **Dashboard cards** porque es lo más visual y da una sensación inmediata de personalización. ¿Te parece bien?

Te contesto las preguntas y empezamos por el Dashboard Cards (voy a cambiar el nombre de LAndingPage por Dashboard que es mas claro)
Te respondo:
1) {
    "success": true,
    "message": "Perfil del usuario",
    "data": {
        "id": "ec5df4d3-00a0-46cb-8bec-d81702961185",
        "email": "admin@test.com",
        "roles": [
            "Admin"
        ],
        "permissions": [
            "Execute"
        ],
        "frontPermissions": [
            "*",
            "auth-allView"
        ]
    },
    "statusCode": 200
}
Pero vamos a falsear la respuesta añadiendo el objeto que vendría realmente con las opciones del usuario, ahora mismo lo inventamos y se lo agregamos cuando llegue auth/me con las opciones que vayamos creando

2) Dashboard con grids directamente, respetando lo que hay (los inputs, filtros, mensajes...)
3) Panel central
4) El que sea más ligero, eficiente, robusto a tu parecer