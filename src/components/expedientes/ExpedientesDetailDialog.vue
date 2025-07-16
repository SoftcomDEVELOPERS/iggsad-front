<!-- src/components/expedientes/ExpedienteDetailDialog.vue -->
<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="`Expediente ${expediente?.numero}`"
    :modal="true"
    :style="{ width: '95vw', maxWidth: '1400px', height: '90vh' }"
    :content-style="{ height: '100%', padding: '0' }"
    class="expediente-detail-dialog"
    maximizable
  >
    <div class="expediente-detail-content" v-if="expediente">
      
      <!-- Header info rápida -->
      <div class="detail-header">
        <div class="header-left">
          <div class="expediente-badge">
            <i class="pi pi-folder"></i>
            <span>{{ expediente.numero }}</span>
          </div>
          <div class="titular-info">
            <h3>{{ expediente.nombreTitular }}</h3>
            <p>{{ expediente.cartera }}</p>
          </div>
        </div>
        <div class="header-right">
          <div class="amount-summary">
            <div class="amount-item principal">
              <span class="label">Principal</span>
              <span class="value">{{ formatCurrency(expediente.principal) }}</span>
            </div>
            <div class="amount-item total">
              <span class="label">Total</span>
              <span class="value">{{ formatCurrency(
                (expediente.principal || 0) + 
                (expediente.intereses || 0) + 
                (expediente.costas || 0)
              ) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs mejorados -->
      <div class="detail-tabs">
        <Tabs value="0" class="expediente-tabs">
          <TabList class="tab-list">
            <Tab value="0" class="tab-item">
              <i class="pi pi-info-circle"></i>
              <span>Información General</span>
            </Tab>
            <Tab value="1" class="tab-item">
              <i class="pi pi-calendar"></i>
              <span>Fechas</span>
            </Tab>
            <Tab value="2" class="tab-item">
              <i class="pi pi-euro"></i>
              <span>Importes</span>
            </Tab>
            <Tab value="3" class="tab-item">
              <i class="pi pi-file-text"></i>
              <span>Procedimiento</span>
            </Tab>
            <Tab value="4" class="tab-item">
              <i class="pi pi-cog"></i>
              <span>Códigos</span>
            </Tab>
          </TabList>
          
          <TabPanels class="tab-panels">
            <!-- Tab 0: Información General -->
            <TabPanel value="0" class="tab-panel">
              <div class="info-grid">
                <div class="info-card">
                  <h4><i class="pi pi-id-card"></i> Datos Básicos</h4>
                  <div class="field-group">
                    <div class="field">
                      <label>Expediente:</label>
                      <span class="expediente-code">{{ expediente.numero }}</span>
                    </div>
                    <div class="field">
                      <label>Cartera:</label>
                      <span>{{ expediente.cartera }}</span>
                    </div>
                    <div class="field">
                      <label>Titular:</label>
                      <span>{{ expediente.nombreTitular }}</span>
                    </div>
                    <div class="field">
                      <label>A.P.:</label>
                      <span>{{ expediente.ap || 'N/A' }}</span>
                    </div>
                    <div class="field">
                      <label>Sub.:</label>
                      <span>{{ expediente.sub || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="info-card">
                  <h4><i class="pi pi-shield"></i> Estado y Embargos</h4>
                  <div class="field-group">
                    <div class="field">
                      <label>Embargos:</label>
                      <Tag 
                        :value="expediente.embargos" 
                        :severity="expediente.embargos === 'Sí' ? 'success' : 'secondary'"
                      />
                    </div>
                    <div class="field urgency-check" v-if="isUrgent(expediente)">
                      <label>Estado:</label>
                      <Tag value="URGENTE" severity="danger" />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Tab 1: Fechas -->
            <TabPanel value="1" class="tab-panel">
              <div class="dates-timeline">
                <div class="timeline-item" v-for="fecha in getFechasOrdenadas(expediente)" :key="fecha.key">
                  <div class="timeline-dot" :class="fecha.status"></div>
                  <div class="timeline-content">
                    <h5>{{ fecha.label }}</h5>
                    <p class="date-value" :class="getDateClass(fecha.value)">
                      {{ formatDate(fecha.value) }}
                    </p>
                    <small v-if="fecha.daysAgo !== null">
                      {{ fecha.daysAgo === 0 ? 'Hoy' : `Hace ${fecha.daysAgo} días` }}
                    </small>
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Tab 2: Importes -->
            <TabPanel value="2" class="tab-panel">
              <div class="amounts-breakdown">
                <div class="amount-card" v-for="importe in getImportesBreakdown(expediente)" :key="importe.key">
                  <div class="amount-header">
                    <i :class="importe.icon"></i>
                    <h4>{{ importe.label }}</h4>
                  </div>
                  <div class="amount-value" :class="importe.class">
                    {{ formatCurrency(importe.value) }}
                  </div>
                  <div class="amount-description">
                    {{ importe.description }}
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Tab 3: Procedimiento -->
            <TabPanel value="3" class="tab-panel">
              <div class="procedure-info">
                <div class="procedure-card">
                  <h4><i class="pi pi-file"></i> Documentos Procesales</h4>
                  <div class="field-group">
                    <div class="field">
                      <label>Autos:</label>
                      <span>{{ expediente.autos || 'Sin datos' }}</span>
                    </div>
                    <div class="field">
                      <label>Autos Verb. Ord.:</label>
                      <span>{{ expediente.autosVerbOrd || 'Sin datos' }}</span>
                    </div>
                    <div class="field">
                      <label>Auto Monitorio:</label>
                      <span>{{ expediente.autoMonitorio || 'Sin datos' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Tab 4: Códigos -->
            <TabPanel value="4" class="tab-panel">
              <div class="codes-grid">
                <div class="code-item" v-for="codigo in getCodigosExpediente(expediente)" :key="codigo.key">
                  <label>{{ codigo.label }}:</label>
                  <span class="code-value">{{ codigo.value || 'N/A' }}</span>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <Button
          label="Imprimir"
          icon="pi pi-print"
          outlined
          @click="$emit('print-expediente', expediente)"
        />
        <Button
          label="Editar"
          icon="pi pi-pencil"
          @click="$emit('edit-expediente', expediente)"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          outlined
          @click="$emit('update:visible', false)"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  expediente: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:visible', 'edit-expediente', 'print-expediente'])

// Métodos de formato (copiados del componente padre)
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  })
}

const formatCurrency = (value) => {
  if (value == null || value === '') return '-'
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value)
}

const getDateClass = (date) => {
  if (!date) return 'date-empty'
  
  const daysDiff = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24))
  if (daysDiff > 90) return 'date-old'
  if (daysDiff > 30) return 'date-medium'
  return 'date-recent'
}

const isUrgent = (data) => {
  const principal = parseFloat(data.principal) || 0
  const daysSinceEnvio = data.fechaEnvio ? 
    Math.floor((new Date() - new Date(data.fechaEnvio)) / (1000 * 60 * 60 * 24)) : 0
  
  return principal > 5000 || daysSinceEnvio > 90
}

const getFechasOrdenadas = (expediente) => {
  const fechas = [
    { key: 'envio', label: 'Fecha de Envío', value: expediente.fechaEnvio },
    { key: 'presentacion', label: 'Fecha de Presentación', value: expediente.fechaPresentacion },
    { key: 'admision', label: 'Fecha de Admisión', value: expediente.fechaAdmision },
    { key: 'ultAgJud', label: 'Última F. Ag. Judicial', value: expediente.ultFechaAgJud },
    { key: 'ultGesExp', label: 'Última F. Ges. Expediente', value: expediente.ultFechaGesExp },
    { key: 'ultCobro', label: 'Última F. Cobro', value: expediente.ultFecCobro }
  ].filter(f => f.value)
  
  return fechas.map(fecha => {
    const date = new Date(fecha.value)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      ...fecha,
      daysAgo: diffDays,
      status: diffDays > 90 ? 'old' : diffDays > 30 ? 'medium' : 'recent'
    }
  }).sort((a, b) => new Date(b.value) - new Date(a.value))
}

const getImportesBreakdown = (expediente) => [
  {
    key: 'principal',
    label: 'Principal',
    value: expediente.principal,
    icon: 'pi pi-euro',
    class: 'principal-amount',
    description: 'Cantidad principal adeudada'
  },
  {
    key: 'intereses',
    label: 'Intereses',
    value: expediente.intereses,
    icon: 'pi pi-percentage',
    class: 'interest-amount',
    description: 'Intereses acumulados'
  },
  {
    key: 'costas',
    label: 'Costas',
    value: expediente.costas,
    icon: 'pi pi-calculator',
    class: 'costs-amount',
    description: 'Costas procesales'
  },
  {
    key: 'ingJud',
    label: 'Ing. Judicial',
    value: expediente.ingJud,
    icon: 'pi pi-building',
    class: 'judicial-amount',
    description: 'Ingresos judiciales'
  },
  {
    key: 'ingExj',
    label: 'Ing. Extrajudicial',
    value: expediente.ingExj,
    icon: 'pi pi-home',
    class: 'extrajudicial-amount',
    description: 'Ingresos extrajudiciales'
  }
]

const getCodigosExpediente = (expediente) => [
  { key: 'ee', label: 'EE', value: expediente.ee },
  { key: 'ep', label: 'EP', value: expediente.ep },
  { key: 'td', label: 'TD', value: expediente.td },
  { key: 'lo', label: 'LO', value: expediente.lo },
  { key: 'gt', label: 'GT', value: expediente.gt },
  { key: 'oc', label: 'OC', value: expediente.oc }
]
</script>

<style>
@import '@/styles/expedientes-dialog.css';
</style>