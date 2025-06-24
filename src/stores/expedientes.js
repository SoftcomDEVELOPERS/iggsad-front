// stores/expedientes.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExpedientesStore = defineStore('expedientes', () => {
  // Estado
  const expedientes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0
  })
  
  // Filtros activos
  const activeFilters = ref({})
  const searchQuery = ref('')

  // Getters
  const hasExpedientes = computed(() => expedientes.value.length > 0)
  const isLoading = computed(() => loading.value)
  const currentPage = computed(() => pagination.value.page)
  const totalExpedientes = computed(() => pagination.value.total)

  // Actions
  const searchExpedientes = async (filters = {}, query = '', page = 1, pageSize = 50) => {
    loading.value = true
    error.value = null
    
    try {
      // Preparar parámetros de consulta
      const queryParams = {
        page,
        pageSize,
        searchQuery: query,
        ...filters
      }

      console.log('🔍 Buscando expedientes con:', queryParams)

      // TODO: Reemplazar por llamada real al API
      const response = await mockApiCall(queryParams)
      
      // Actualizar estado
      expedientes.value = response.data
      pagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages
      }
      
      activeFilters.value = { ...filters }
      searchQuery.value = query

      console.log('✅ Expedientes cargados:', response.data.length)
      
      return response
      
    } catch (err) {
      error.value = err.message || 'Error al buscar expedientes'
      console.error('❌ Error al buscar expedientes:', err)
      throw err
      
    } finally {
      loading.value = false
    }
  }

  const clearResults = () => {
    expedientes.value = []
    activeFilters.value = {}
    searchQuery.value = ''
    error.value = null
    pagination.value = {
      page: 1,
      pageSize: 50,
      total: 0,
      totalPages: 0
    }
  }

  const changePage = async (newPage) => {
    if (newPage > 0 && newPage <= pagination.value.totalPages) {
      await searchExpedientes(activeFilters.value, searchQuery.value, newPage, pagination.value.pageSize)
    }
  }

  const changePageSize = async (newPageSize) => {
    await searchExpedientes(activeFilters.value, searchQuery.value, 1, newPageSize)
  }

  // Mock API Call - REEMPLAZAR con llamada real
  const mockApiCall = async (params) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Datos ficticios
    const mockExpedientes = Array.from({ length: params.pageSize }, (_, index) => ({
      id: (params.page - 1) * params.pageSize + index + 1,
      numero: `EXP-2024-${String((params.page - 1) * params.pageSize + index + 1).padStart(3, '0')}`,
      cliente: `Cliente ${index + 1}`,
      estado: ['Activo', 'Pendiente', 'Cerrado'][index % 3],
      fechaCreacion: new Date(2024, 0, 1 + index).toISOString(),
      cuantia: (Math.random() * 100000).toFixed(2),
      letrado: ['Ana Rodríguez', 'Carlos López', 'Elena Martín'][index % 3],
      nig: `NIG${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      referencia: `REF-${index + 1}`,
      hito: `Hito ${(index % 3) + 1}`
    }))

    return {
      data: mockExpedientes,
      page: params.page,
      pageSize: params.pageSize,
      total: 1234, // Total ficticio
      totalPages: Math.ceil(1234 / params.pageSize),
      filters: params
    }
  }

  return {
    // Estado
    expedientes,
    loading,
    error,
    pagination,
    activeFilters,
    searchQuery,
    
    // Getters
    hasExpedientes,
    isLoading,
    currentPage,
    totalExpedientes,
    
    // Actions
    searchExpedientes,
    clearResults,
    changePage,
    changePageSize
  }
})