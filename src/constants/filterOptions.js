// constants/filterOptions.js
import { ref } from 'vue'

export function useFilterOptions() {
  const clienteOptions = ref([
    { label: 'Clientes Activos', value: 'activos' },
    { label: 'Todos los Clientes', value: 'todos' }
  ])

  const carteraOptions = ref([
    { label: 'Carteras Activas', value: 'activas' },
    { label: 'Todas las Carteras', value: 'todas' }
  ])

  const estadoExpedienteOptions = ref([
    { label: 'Todos (Extrajudiciales y Judiciales)', value: 'todos' },
    { label: 'Solo Extrajudiciales', value: 'extrajudiciales' },
    { label: 'Solo Judiciales', value: 'judiciales' }
  ])

  const hitoOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Hito 1', value: 'hito1' },
    { label: 'Hito 2', value: 'hito2' },
    { label: 'Hito 3', value: 'hito3' }
  ])

  const estadoDemandaOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Presentada', value: 'presentada' },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Admitida', value: 'admitida' },
    { label: 'Rechazada', value: 'rechazada' }
  ])

  const estadoSubrogacionOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Subrogado', value: 'subrogado' },
    { label: 'No Subrogado', value: 'no_subrogado' },
    { label: 'Pendiente', value: 'pendiente' }
  ])

  const tGestExtOptions = ref([
    { label: 'Sin Clasificar', value: 'sin_clasificar' },
    { label: 'Clasificado', value: 'clasificado' },
    { label: 'En Proceso', value: 'en_proceso' }
  ])

  const tipoDemandaOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Monitorio', value: 'monitorio' },
    { label: 'Ordinario', value: 'ordinario' },
    { label: 'Verbal', value: 'verbal' },
    { label: 'Cambiario', value: 'cambiario' }
  ])

  const estadoContactacionOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Contactables', value: 'contactables' },
    { label: 'No Contactables', value: 'no_contactables' },
    { label: 'Pendiente Contacto', value: 'pendiente' }
  ])

  const conIngresosOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Con Ingresos', value: 'con_ingresos' },
    { label: 'Sin Ingresos', value: 'sin_ingresos' }
  ])

  const estadoProcedimientoOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Activo', value: 'activo' },
    { label: 'Cerrado', value: 'cerrado' },
    { label: 'Suspendido', value: 'suspendido' },
    { label: 'Archivado', value: 'archivado' }
  ])

  const letradoOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Ana Rodríguez', value: 'ana_rodriguez' },
    { label: 'Carlos López', value: 'carlos_lopez' },
    { label: 'Elena Martín', value: 'elena_martin' },
    { label: 'David García', value: 'david_garcia' }
  ])

  const gestorOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'María González', value: 'maria_gonzalez' },
    { label: 'Juan Pérez', value: 'juan_perez' },
    { label: 'Laura Sánchez', value: 'laura_sanchez' },
    { label: 'Roberto Díaz', value: 'roberto_diaz' }
  ])

  const localizadosOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Localizados', value: 'localizados' },
    { label: 'No Localizados', value: 'no_localizados' },
    { label: 'Parcialmente Localizados', value: 'parcialmente' }
  ])

  const tipoCostasOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Costas Judiciales', value: 'judiciales' },
    { label: 'Costas Procesales', value: 'procesales' },
    { label: 'Costas de Ejecución', value: 'ejecucion' }
  ])

  const gestExtOptions = ref([
    { label: '---', value: null },
    { label: 'Gestión Externa A', value: 'opcion1' },
    { label: 'Gestión Externa B', value: 'opcion2' },
    { label: 'Gestión Externa C', value: 'opcion3' }
  ])

  const conAcuerdoPagoOptions = ref([
    { label: 'Todos', value: 'todos' },
    { label: 'Con Acuerdo', value: 'con_acuerdo' },
    { label: 'Sin Acuerdo', value: 'sin_acuerdo' },
    { label: 'Acuerdo Pendiente', value: 'pendiente' }
  ])

  return {
    clienteOptions,
    carteraOptions,
    estadoExpedienteOptions,
    hitoOptions,
    estadoDemandaOptions,
    estadoSubrogacionOptions,
    tGestExtOptions,
    tipoDemandaOptions,
    estadoContactacionOptions,
    conIngresosOptions,
    estadoProcedimientoOptions,
    letradoOptions,
    gestorOptions,
    localizadosOptions,
    tipoCostasOptions,
    gestExtOptions,
    conAcuerdoPagoOptions
  }
}