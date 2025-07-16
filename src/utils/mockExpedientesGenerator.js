// utils/mockExpedientesGenerator.js
// Generador de datos mock para expedientes con soporte para lazy loading

/**
 * Genera una página de expedientes de forma dinámica
 * @param {number} page - Número de página (empezando en 1)
 * @param {number} pageSize - Cantidad de elementos por página
 * @param {Object} filters - Filtros aplicados (opcional)
 * @param {string} searchQuery - Término de búsqueda (opcional)
 * @returns {Object} Datos de la página con paginación
 */
export function generateExpedientePage(page = 1, pageSize = 25, filters = {}, searchQuery = '') {
  const totalRecords = 1000; // Total de registros simulados
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  console.log(`🔄 Generando página ${page} con ${pageSize} elementos (${startIndex}-${endIndex})`);
  
  const expedientes = [];
  
  // Generar expedientes para la página actual
  for (let i = startIndex; i < endIndex && i < totalRecords; i++) {
    const expediente = generateSingleExpediente(i + 1);
    
    // Aplicar filtros si existen
    if (matchesFilters(expediente, filters, searchQuery)) {
      expedientes.push(expediente);
    }
  }
  
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  return {
    data: expedientes,
    page: page,
    pageSize: pageSize,
    total: totalRecords,
    totalPages: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    start: startIndex + 1,
    end: Math.min(endIndex, totalRecords),
    timestamp: new Date().toISOString()
  };
}

/**
 * Genera un expediente individual con datos realistas
 * @param {number} index - Índice del expediente
 * @returns {Object} Expediente generado
 */
function generateSingleExpediente(index) {
  const carteras = ['Cartera A', 'Cartera B', 'Cartera C'];
  const nombres = [
    'Juan Pérez García', 'María López Rodríguez', 'Carlos Martín Sánchez',
    'Ana González Fernández', 'José Rodríguez Martín', 'Laura Sánchez López',
    'Miguel Fernández García', 'Carmen Martín González', 'Antonio López Pérez',
    'Isabel García Rodríguez', 'Francisco Pérez Martín', 'Rosa González Sánchez'
  ];
  
  const juzgados = [
    'Juzgado de Primera Instancia nº 1 de Madrid',
    'Juzgado de Primera Instancia nº 2 de Barcelona',
    'Juzgado de Primera Instancia nº 3 de Valencia',
    'Juzgado de Primera Instancia nº 4 de Sevilla',
    'Juzgado de Primera Instancia nº 5 de Bilbao'
  ];

  // Generar fechas realistas
  const baseDate = new Date(2024, 0, 1); // 1 enero 2024
  const dayOffset = Math.floor(Math.random() * 365); // Hasta un año
  const fechaEnvio = new Date(baseDate.getTime() + (dayOffset * 24 * 60 * 60 * 1000));
  
  const fechaPresentacion = new Date(fechaEnvio.getTime() + (Math.random() * 10 * 24 * 60 * 60 * 1000));
  const fechaAdmision = new Date(fechaPresentacion.getTime() + (Math.random() * 15 * 24 * 60 * 60 * 1000));
  
  // Generar importes realistas
  const principal = Number((Math.random() * 8000 + 500).toFixed(2));
  const intereses = Number((principal * (Math.random() * 0.3 + 0.05)).toFixed(2));
  const costas = Number((principal * (Math.random() * 0.1 + 0.02)).toFixed(2));
  
  return {
    id: index,
    numero: `EXP-2025-${String(index).padStart(3, '0')}`,
    ap: String(index).padStart(3, '0'),
    ee: `EE${index}`,
    ep: `EP${index}`,
    sub: `SUB${index}`,
    td: `TD${index}`,
    cartera: carteras[index % carteras.length],
    nombreTitular: nombres[index % nombres.length],
    autos: `Procedimiento Monitorio ${index}/2025`,
    autosVerbOrd: `Verbal Ordinario ${index}/2025`,
    autoMonitorio: `Monitorio ${index}/2025`,
    juzgado: juzgados[index % juzgados.length],
    fechaEnvio: fechaEnvio.toISOString(),
    fechaPresentacion: fechaPresentacion.toISOString(),
    fechaAdmision: fechaAdmision.toISOString(),
    ultFechaAgJud: new Date(fechaAdmision.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    ultFechaGesExp: new Date(fechaAdmision.getTime() + (Math.random() * 45 * 24 * 60 * 60 * 1000)).toISOString(),
    embargos: index % 4 === 0 ? 'Sí' : 'No',
    ultFecCobro: Math.random() > 0.3 ? new Date(fechaAdmision.getTime() + (Math.random() * 60 * 24 * 60 * 60 * 1000)).toISOString() : null,
    lo: `LO${index}`,
    gt: `GT${index}`,
    oc: `OC${index}`,
    principal: principal,
    intereses: intereses,
    costas: costas,
    ingJud: Number((Math.random() * 500 + 50).toFixed(2)),
    ingExj: Number((Math.random() * 300 + 25).toFixed(2)),
    estado: ['Activo', 'Pendiente', 'En Seguimiento', 'Resuelto'][index % 4],
    prioridad: index % 10 === 0 ? 'Alta' : index % 5 === 0 ? 'Media' : 'Normal'
  };
}

/**
 * Verifica si un expediente coincide con los filtros aplicados
 * @param {Object} expediente - Expediente a verificar
 * @param {Object} filters - Filtros a aplicar
 * @param {string} searchQuery - Término de búsqueda
 * @returns {boolean} True si coincide con los filtros
 */
function matchesFilters(expediente, filters = {}, searchQuery = '') {
  // Búsqueda por término general
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    const searchableFields = [
      expediente.numero,
      expediente.nombreTitular,
      expediente.cartera,
      expediente.autos
    ].join(' ').toLowerCase();
    
    if (!searchableFields.includes(searchLower)) {
      return false;
    }
  }
  
  // Filtro por cartera
  if (filters.cartera && filters.cartera.length > 0) {
    if (!filters.cartera.includes(expediente.cartera)) {
      return false;
    }
  }
  
  // Filtro por estado
  if (filters.estado && expediente.estado !== filters.estado) {
    return false;
  }
  
  // Filtro por embargos
  if (filters.embargos && expediente.embargos !== filters.embargos) {
    return false;
  }
  
  // Filtro por rango de fechas
  if (filters.fechaDesde) {
    const fechaEnvio = new Date(expediente.fechaEnvio);
    const fechaDesde = new Date(filters.fechaDesde);
    if (fechaEnvio < fechaDesde) {
      return false;
    }
  }
  
  if (filters.fechaHasta) {
    const fechaEnvio = new Date(expediente.fechaEnvio);
    const fechaHasta = new Date(filters.fechaHasta);
    if (fechaEnvio > fechaHasta) {
      return false;
    }
  }
  
  // Filtro por rango de importes
  if (filters.importeDesde && expediente.principal < filters.importeDesde) {
    return false;
  }
  
  if (filters.importeHasta && expediente.principal > filters.importeHasta) {
    return false;
  }
  
  return true;
}

/**
 * Simula delay de red para hacer más realista la experiencia
 * @param {number} min - Tiempo mínimo en ms
 * @param {number} max - Tiempo máximo en ms
 * @returns {Promise} Promise que se resuelve después del delay
 */
export function simulateNetworkDelay(min = 200, max = 800) {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Genera estadísticas globales de los expedientes
 * @returns {Object} Estadísticas generales
 */
export function generateExpedientesStats() {
  return {
    totalExpedientes: 1000,
    expedientesActivos: 856,
    expedientesUrgentes: 127,
    totalPrincipal: 2847652.45,
    totalIntereses: 428234.12,
    totalCostas: 142856.78,
    expedientesConEmbargo: 198,
    carteraA: 334,
    carteraB: 445,
    carteraC: 221,
    promedioImporte: 2847.65,
    ultimaActualizacion: new Date().toISOString()
  };
}

/**
 * Búsqueda avanzada con filtros complejos
 * @param {Object} searchParams - Parámetros de búsqueda
 * @returns {Object} Resultados paginados
 */
export async function searchExpedientes(searchParams = {}) {
  const {
    page = 1,
    pageSize = 25,
    searchQuery = '',
    filters = {},
    sortBy = null,
    sortOrder = 'asc'
  } = searchParams;
  
  console.log('🔍 Búsqueda avanzada:', { page, pageSize, searchQuery, filters });
  
  // Simular delay de red
  await simulateNetworkDelay();
  
  // Generar datos para la página
  let result = generateExpedientePage(page, pageSize, filters, searchQuery);
  
  // Aplicar ordenación si se especifica
  if (sortBy) {
    result.data.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Manejar fechas
      if (sortBy.includes('fecha') || sortBy.includes('Fecha')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      // Manejar números
      if (typeof aVal === 'string' && !isNaN(aVal)) {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
  }
  
  return result;
}

/**
 * Exporta la funcionalidad para ser usada en el store
 */
export default {
  generateExpedientePage,
  generateExpedientesStats,
  searchExpedientes,
  simulateNetworkDelay
};