<!-- src/components/dashboard/cards/CustomCard.vue -->
<template>
  <div class="custom-card h-full flex flex-col">
    <!-- Header con configuración -->
    <div v-if="showHeader" class="custom-card-header p-3 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-800">
          <i :class="config?.icon || 'pi pi-code'" class="mr-2"></i>
          {{ config?.title || 'Widget Personalizado' }}
        </h3>
        <div class="flex gap-1">
          <Button
            v-if="configMode"
            icon="pi pi-cog"
            text
            size="small"
            @click="showConfigPanel = true"
            title="Configurar widget"
          />
          <Button
            v-if="configMode && config?.editable !== false"
            icon="pi pi-pencil"
            text
            size="small"
            @click="showEditor = true"
            title="Editar código"
          />
        </div>
      </div>
    </div>

    <!-- Panel de configuración -->
    <div v-if="configMode && showConfigPanel" class="config-panel p-4 bg-blue-50 border-b border-blue-200">
      <h4 class="text-sm font-medium text-blue-800 mb-3">Configuración del Widget</h4>
      
      <div class="space-y-4">
        <!-- Título personalizado -->
        <div>
          <label class="block text-xs font-medium text-blue-800 mb-1">Título:</label>
          <InputText
            v-model="localConfig.title"
            placeholder="Nombre del widget"
            class="w-full text-sm"
          />
        </div>

        <!-- Icono -->
        <div>
          <label class="block text-xs font-medium text-blue-800 mb-1">Icono (PrimeIcon):</label>
          <InputText
            v-model="localConfig.icon"
            placeholder="pi pi-star"
            class="w-full text-sm"
          />
        </div>

        <!-- Tipo de contenido -->
        <div>
          <label class="block text-xs font-medium text-blue-800 mb-1">Tipo de Contenido:</label>
          <Dropdown
            v-model="localConfig.contentType"
            :options="contentTypes"
            option-label="label"
            option-value="value"
            placeholder="Seleccionar tipo"
            class="w-full text-sm"
          />
        </div>

        <!-- Configuraciones específicas según tipo -->
        <div v-if="localConfig.contentType === 'html'">
          <label class="block text-xs font-medium text-blue-800 mb-1">Altura del contenido:</label>
          <InputNumber
            v-model="localConfig.height"
            :min="100"
            :max="600"
            suffix="px"
            class="w-full"
          />
        </div>

        <div v-if="localConfig.contentType === 'iframe'">
          <label class="block text-xs font-medium text-blue-800 mb-1">URL del iframe:</label>
          <InputText
            v-model="localConfig.iframeUrl"
            placeholder="https://example.com"
            class="w-full text-sm"
          />
        </div>

        <!-- Auto-actualización -->
        <div>
          <div class="flex items-center gap-2">
            <Checkbox
              v-model="localConfig.autoRefresh"
              binary
            />
            <label class="text-xs font-medium text-blue-800">Auto-actualizar contenido</label>
          </div>
          <div v-if="localConfig.autoRefresh" class="mt-2">
            <label class="block text-xs font-medium text-blue-800 mb-1">Intervalo (segundos):</label>
            <InputNumber
              v-model="localConfig.refreshInterval"
              :min="5"
              :max="300"
              suffix="s"
              class="w-full"
            />
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex gap-2">
          <Button
            label="Aplicar"
            size="small"
            @click="applyConfig"
          />
          <Button
            label="Cancelar"
            outlined
            size="small"
            @click="cancelConfig"
          />
        </div>
      </div>
    </div>

    <!-- Editor de código -->
    <Dialog
      v-model:visible="showEditor"
      modal
      header="Editor de Código"
      :style="{ width: '80vw', height: '80vh' }"
      class="custom-card-editor"
    >
      <div class="h-full flex flex-col">
        <!-- Tabs del editor -->
        <div class="editor-tabs flex border-b border-slate-200 mb-4">
          <button
            v-for="tab in editorTabs"
            :key="tab.id"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            :class="{
              'border-blue-500 text-blue-600': activeTab === tab.id,
              'border-transparent text-slate-600 hover:text-slate-800': activeTab !== tab.id
            }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenido del editor -->
        <div class="flex-1">
          <!-- HTML Editor -->
          <div v-if="activeTab === 'html'" class="h-full">
            <label class="block text-sm font-medium text-slate-700 mb-2">Código HTML:</label>
            <Textarea
              v-model="editorContent.html"
              class="w-full h-full font-mono text-sm"
              style="min-height: 300px; font-family: 'Courier New', monospace;"
              placeholder="<div>Tu código HTML aquí...</div>"
            />
          </div>

          <!-- CSS Editor -->
          <div v-if="activeTab === 'css'" class="h-full">
            <label class="block text-sm font-medium text-slate-700 mb-2">Estilos CSS:</label>
            <Textarea
              v-model="editorContent.css"
              class="w-full h-full font-mono text-sm"
              style="min-height: 300px; font-family: 'Courier New', monospace;"
              placeholder=".mi-clase { color: blue; }"
            />
          </div>

          <!-- JavaScript Editor -->
          <div v-if="activeTab === 'js'" class="h-full">
            <label class="block text-sm font-medium text-slate-700 mb-2">JavaScript:</label>
            <Textarea
              v-model="editorContent.js"
              class="w-full h-full font-mono text-sm"
              style="min-height: 300px; font-family: 'Courier New', monospace;"
              placeholder="// Tu código JavaScript aquí
console.log('Hola mundo');"
            />
          </div>

          <!-- Preview -->
          <div v-if="activeTab === 'preview'" class="h-full">
            <label class="block text-sm font-medium text-slate-700 mb-2">Vista Previa:</label>
            <div class="preview-container border border-slate-200 rounded h-full p-4 overflow-auto">
              <div ref="previewRef" class="w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <Button
              label="Plantillas"
              icon="pi pi-file"
              outlined
              @click="showTemplates = true"
            />
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              severity="secondary"
              outlined
              @click="clearEditor"
            />
          </div>
          <div class="flex gap-2">
            <Button
              label="Cancelar"
              outlined
              @click="showEditor = false"
            />
            <Button
              label="Guardar y Aplicar"
              @click="saveAndApplyCode"
            />
          </div>
        </div>
      </template>
    </Dialog>

    <!-- Selector de plantillas -->
    <Dialog
      v-model:visible="showTemplates"
      modal
      header="Plantillas de Código"
      :style="{ width: '60vw' }"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="template in codeTemplates"
          :key="template.id"
          class="template-card p-4 border border-slate-200 rounded cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
          @click="applyTemplate(template)"
        >
          <div class="flex items-center gap-2 mb-2">
            <i :class="template.icon" class="text-lg text-blue-600"></i>
            <h4 class="font-medium">{{ template.name }}</h4>
          </div>
          <p class="text-sm text-slate-600 mb-3">{{ template.description }}</p>
          <div class="text-xs text-slate-500">
            {{ template.tags.join(', ') }}
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Contenido del widget -->
    <div class="custom-card-content flex-1 overflow-hidden">
      <!-- Modo loading -->
      <div v-if="loading" class="h-full flex items-center justify-center">
        <div class="text-center">
          <i class="pi pi-spin pi-spinner text-2xl text-blue-500 mb-2"></i>
          <p class="text-sm text-slate-600">Cargando widget...</p>
        </div>
      </div>

      <!-- Modo error -->
      <div v-else-if="error" class="h-full flex items-center justify-center">
        <div class="text-center text-red-600">
          <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
          <p class="text-sm">Error al cargar el widget</p>
          <p class="text-xs text-slate-500 mt-1">{{ error }}</p>
        </div>
      </div>

      <!-- Contenido personalizado -->
      <div v-else-if="hasContent" class="h-full">
        <!-- HTML personalizado -->
        <div
          v-if="config?.contentType === 'html'"
          ref="htmlContentRef"
          class="custom-html-content h-full overflow-auto"
          :style="{ height: config?.height ? `${config.height}px` : '100%' }"
        ></div>

        <!-- Iframe -->
        <iframe
          v-else-if="config?.contentType === 'iframe' && config?.iframeUrl"
          :src="config.iframeUrl"
          class="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>

        <!-- Widget de datos -->
        <div v-else-if="config?.contentType === 'data'" class="h-full p-4">
          <DataWidget
            :data="widgetData"
            :config="config"
          />
        </div>

        <!-- Imagen -->
        <div v-else-if="config?.contentType === 'image'" class="h-full flex items-center justify-center p-4">
          <img
            :src="config?.imageUrl"
            :alt="config?.title"
            class="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="h-full flex items-center justify-center">
        <div class="text-center">
          <i class="pi pi-code text-4xl text-slate-300 mb-4"></i>
          <h4 class="text-lg font-medium text-slate-600 mb-2">Widget Personalizado</h4>
          <p class="text-sm text-slate-500 mb-4">
            {{ configMode ? 'Configura el contenido usando el editor' : 'Este widget no tiene contenido configurado' }}
          </p>
          <Button
            v-if="configMode"
            icon="pi pi-pencil"
            label="Editar Código"
            @click="showEditor = true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  },
  configMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-config'])

// Referencias del DOM
const htmlContentRef = ref(null)
const previewRef = ref(null)

// Estado del componente
const loading = ref(false)
const error = ref(null)
const showHeader = ref(true)
const showConfigPanel = ref(false)
const showEditor = ref(false)
const showTemplates = ref(false)
const activeTab = ref('html')

// Configuración local
const localConfig = ref({
  title: 'Widget Personalizado',
  icon: 'pi pi-code',
  contentType: 'html',
  height: 300,
  iframeUrl: '',
  imageUrl: '',
  autoRefresh: false,
  refreshInterval: 30,
  editable: true,
  ...props.config
})

// Contenido del editor
const editorContent = ref({
  html: props.config?.customHtml || '',
  css: props.config?.customCss || '',
  js: props.config?.customJs || ''
})

// Intervalos para auto-actualización
let refreshInterval = null

// Tipos de contenido disponibles
const contentTypes = ref([
  { label: 'HTML Personalizado', value: 'html' },
  { label: 'Iframe/Web', value: 'iframe' },
  { label: 'Widget de Datos', value: 'data' },
  { label: 'Imagen', value: 'image' }
])

// Tabs del editor
const editorTabs = ref([
  { id: 'html', label: 'HTML', icon: 'pi pi-code' },
  { id: 'css', label: 'CSS', icon: 'pi pi-palette' },
  { id: 'js', label: 'JavaScript', icon: 'pi pi-cog' },
  { id: 'preview', label: 'Preview', icon: 'pi pi-eye' }
])

// Plantillas de código predefinidas
const codeTemplates = ref([
  {
    id: 'hello-world',
    name: 'Hola Mundo',
    description: 'Plantilla básica para empezar',
    icon: 'pi pi-star',
    tags: ['Básico', 'Ejemplo'],
    html: '<div class="text-center p-4"><h2>¡Hola Mundo!</h2><p>Este es tu primer widget personalizado.</p></div>',
    css: 'h2 { color: #3b82f6; margin-bottom: 1rem; } p { color: #6b7280; }',
    js: 'console.log("Widget cargado correctamente");'
  },
  {
    id: 'stats-counter',
    name: 'Contador de Estadísticas',
    description: 'Widget animado con contador',
    icon: 'pi pi-chart-line',
    tags: ['Estadísticas', 'Animación'],
    html: '<div class="stats-widget"><div class="stat-item"><span class="stat-number" id="counter">0</span><span class="stat-label">Visitas</span></div></div>',
    css: '.stats-widget { text-align: center; padding: 2rem; } .stat-number { font-size: 2rem; font-weight: bold; color: #059669; display: block; } .stat-label { color: #6b7280; font-size: 0.875rem; }',
    js: 'let counter = 0; const target = 1234; const increment = target / 100; const timer = setInterval(() => { counter += increment; document.getElementById("counter").textContent = Math.floor(counter); if (counter >= target) { clearInterval(timer); document.getElementById("counter").textContent = target; } }, 20);'
  },
  {
    id: 'weather-widget',
    name: 'Widget del Clima',
    description: 'Información meteorológica',
    icon: 'pi pi-sun',
    tags: ['Clima', 'API', 'Información'],
    html: '<div class="weather-widget"><div class="weather-icon">☀️</div><div class="weather-temp">22°C</div><div class="weather-desc">Soleado</div><div class="weather-location">Madrid, España</div></div>',
    css: '.weather-widget { text-align: center; padding: 1.5rem; background: linear-gradient(135deg, #87CEEB, #98DFEA); border-radius: 12px; color: white; } .weather-icon { font-size: 3rem; margin-bottom: 0.5rem; } .weather-temp { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25rem; } .weather-desc { margin-bottom: 0.5rem; } .weather-location { font-size: 0.875rem; opacity: 0.8; }',
    js: '// Aquí podrías conectar con una API del clima como OpenWeatherMap'
  },
  {
    id: 'todo-list',
    name: 'Lista de Tareas',
    description: 'Lista interactiva de tareas',
    icon: 'pi pi-check-square',
    tags: ['Productividad', 'Interactivo'],
    html: '<div class="todo-widget"><h3>Mis Tareas</h3><ul class="todo-list"><li><input type="checkbox"> Revisar documentos</li><li><input type="checkbox" checked> Llamar al cliente</li><li><input type="checkbox"> Preparar audiencia</li></ul></div>',
    css: '.todo-widget { padding: 1rem; } .todo-widget h3 { margin-bottom: 1rem; color: #374151; } .todo-list { list-style: none; padding: 0; } .todo-list li { margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; } .todo-list input[type="checkbox"] { margin: 0; }',
    js: 'document.querySelectorAll(".todo-list input[type=checkbox]").forEach(checkbox => { checkbox.addEventListener("change", function() { this.parentNode.style.opacity = this.checked ? "0.6" : "1"; this.parentNode.style.textDecoration = this.checked ? "line-through" : "none"; }); });'
  },
  {
    id: 'chart-widget',
    name: 'Gráfico Simple',
    description: 'Gráfico de barras básico',
    icon: 'pi pi-chart-bar',
    tags: ['Gráficos', 'Datos', 'Visualización'],
    html: '<div class="chart-widget"><h3>Ventas por Mes</h3><div class="chart-container"><div class="bar" style="height: 60%"><span>Ene</span></div><div class="bar" style="height: 80%"><span>Feb</span></div><div class="bar" style="height: 90%"><span>Mar</span></div><div class="bar" style="height: 70%"><span>Abr</span></div></div></div>',
    css: '.chart-widget { padding: 1rem; } .chart-widget h3 { margin-bottom: 1rem; color: #374151; text-align: center; } .chart-container { display: flex; align-items: end; justify-content: space-around; height: 120px; padding: 0 1rem; } .bar { background: linear-gradient(to top, #3b82f6, #60a5fa); width: 30px; border-radius: 4px 4px 0 0; display: flex; align-items: end; justify-content: center; position: relative; transition: all 0.3s ease; } .bar:hover { transform: scaleY(1.1); } .bar span { position: absolute; bottom: -20px; font-size: 0.75rem; color: #6b7280; }',
    js: '// Animación de las barras document.querySelectorAll(".bar").forEach((bar, index) => { const originalHeight = bar.style.height; bar.style.height = "0%"; setTimeout(() => { bar.style.height = originalHeight; }, index * 200); });'
  }
])

// Computed
const hasContent = computed(() => {
  const type = localConfig.value.contentType
  
  switch (type) {
    case 'html':
      return editorContent.value.html.trim() !== ''
    case 'iframe':
      return localConfig.value.iframeUrl && localConfig.value.iframeUrl.trim() !== ''
    case 'image':
      return localConfig.value.imageUrl && localConfig.value.imageUrl.trim() !== ''
    case 'data':
      return true // Los widgets de datos siempre tienen contenido
    default:
      return false
  }
})

const widgetData = computed(() => {
  return props.data || {}
})

// Métodos
const applyConfig = () => {
  const newConfig = {
    ...props.config,
    ...localConfig.value,
    customHtml: editorContent.value.html,
    customCss: editorContent.value.css,
    customJs: editorContent.value.js
  }
  
  emit('update-config', props.cardId, newConfig)
  showConfigPanel.value = false
  
  // Aplicar auto-actualización si está habilitada
  setupAutoRefresh()
}

const cancelConfig = () => {
  localConfig.value = {
    title: 'Widget Personalizado',
    icon: 'pi pi-code',
    contentType: 'html',
    height: 300,
    iframeUrl: '',
    imageUrl: '',
    autoRefresh: false,
    refreshInterval: 30,
    editable: true,
    ...props.config
  }
  
  editorContent.value = {
    html: props.config?.customHtml || '',
    css: props.config?.customCss || '',
    js: props.config?.customJs || ''
  }
  
  showConfigPanel.value = false
}

const saveAndApplyCode = () => {
  // Actualizar la configuración con el nuevo código
  localConfig.value.customHtml = editorContent.value.html
  localConfig.value.customCss = editorContent.value.css
  localConfig.value.customJs = editorContent.value.js
  
  applyConfig()
  showEditor.value = false
  
  // Renderizar el contenido actualizado
  nextTick(() => {
    renderCustomContent()
  })
}

const clearEditor = () => {
  if (confirm('¿Estás seguro de que quieres limpiar todo el código?')) {
    editorContent.value = {
      html: '',
      css: '',
      js: ''
    }
  }
}

const applyTemplate = (template) => {
  editorContent.value = {
    html: template.html || '',
    css: template.css || '',
    js: template.js || ''
  }
  
  showTemplates.value = false
  
  // Cambiar a la tab de preview para ver el resultado
  activeTab.value = 'preview'
  
  nextTick(() => {
    updatePreview()
  })
}

const renderCustomContent = () => {
  if (!htmlContentRef.value || localConfig.value.contentType !== 'html') return
  
  try {
    loading.value = true
    error.value = null
    
    // Limpiar contenido anterior
    htmlContentRef.value.innerHTML = ''
    
    // Crear un contenedor para el contenido personalizado
    const container = document.createElement('div')
    container.innerHTML = editorContent.value.html
    
    // Aplicar estilos CSS
    if (editorContent.value.css) {
      const style = document.createElement('style')
      style.textContent = editorContent.value.css
      container.appendChild(style)
    }
    
    // Añadir el contenido al DOM
    htmlContentRef.value.appendChild(container)
    
    // Ejecutar JavaScript personalizado
    if (editorContent.value.js) {
      try {
        // Crear un scope limitado para el JavaScript
        const script = new Function('container', editorContent.value.js)
        script(container)
      } catch (jsError) {
        console.error('Error ejecutando JavaScript personalizado:', jsError)
        error.value = `Error en JavaScript: ${jsError.message}`
      }
    }
    
    loading.value = false
  } catch (err) {
    console.error('Error renderizando contenido personalizado:', err)
    error.value = `Error de renderizado: ${err.message}`
    loading.value = false
  }
}

const updatePreview = () => {
  if (!previewRef.value) return
  
  try {
    // Limpiar preview anterior
    previewRef.value.innerHTML = ''
    
    // Crear contenido de preview
    const container = document.createElement('div')
    container.innerHTML = editorContent.value.html
    
    // Aplicar estilos CSS
    if (editorContent.value.css) {
      const style = document.createElement('style')
      style.textContent = editorContent.value.css
      container.appendChild(style)
    }
    
    previewRef.value.appendChild(container)
    
    // Ejecutar JavaScript en preview (con precaución)
    if (editorContent.value.js) {
      try {
        const script = new Function('container', editorContent.value.js)
        script(container)
      } catch (jsError) {
        console.error('Error en preview JavaScript:', jsError)
        const errorDiv = document.createElement('div')
        errorDiv.className = 'text-red-600 p-2 bg-red-50 rounded'
        errorDiv.textContent = `Error JavaScript: ${jsError.message}`
        previewRef.value.appendChild(errorDiv)
      }
    }
  } catch (err) {
    console.error('Error actualizando preview:', err)
  }
}

const setupAutoRefresh = () => {
  // Limpiar intervalo anterior
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
  
  // Configurar nuevo intervalo si está habilitado
  if (localConfig.value.autoRefresh && localConfig.value.refreshInterval > 0) {
    refreshInterval = setInterval(() => {
      renderCustomContent()
    }, localConfig.value.refreshInterval * 1000)
  }
}

// Watchers
watch(() => props.config, (newConfig) => {
  localConfig.value = {
    ...localConfig.value,
    ...newConfig
  }
  
  editorContent.value = {
    html: newConfig?.customHtml || '',
    css: newConfig?.customCss || '',
    js: newConfig?.customJs || ''
  }
  
  nextTick(() => {
    renderCustomContent()
    setupAutoRefresh()
  })
}, { deep: true, immediate: true })

watch(() => props.configMode, (newValue) => {
  if (!newValue) {
    showConfigPanel.value = false
    showEditor.value = false
  }
})

watch(activeTab, (newTab) => {
  if (newTab === 'preview') {
    nextTick(() => {
      updatePreview()
    })
  }
})

// Lifecycle
onMounted(() => {
  console.log('CustomCard montada con config:', localConfig.value)
  
  nextTick(() => {
    renderCustomContent()
    setupAutoRefresh()
  })
})

onUnmounted(() => {
  // Limpiar intervalos
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.custom-card {
  background: transparent;
}

.custom-card-header {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.config-panel {
  border-radius: 6px;
  margin: 0.5rem;
}

.custom-card-content {
  overflow: hidden;
}

.custom-html-content {
  padding: 0.5rem;
}

/* Editor específico */
.custom-card-editor :deep(.p-dialog-content) {
  padding: 1.5rem;
  height: calc(80vh - 120px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-tabs {
  flex-shrink: 0;
}

.editor-tabs button {
  background: none;
  border: none;
  cursor: pointer;
}

.editor-tabs button:hover {
  background-color: #f1f5f9;
}

/* Preview container */
.preview-container {
  background: #f8fafc;
}

/* Template cards */
.template-card {
  transition: all 0.2s ease;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Contenido personalizado seguro */
.custom-html-content :deep(*) {
  max-width: 100%;
  word-wrap: break-word;
}

.custom-html-content :deep(script) {
  display: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-card-editor {
    width: 95vw !important;
    height: 90vh !important;
  }
  
  .config-panel {
    margin: 0.25rem;
    padding: 0.75rem;
  }
  
  .template-card {
    margin-bottom: 1rem;
  }
  
  .editor-tabs {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .editor-tabs button {
    min-width: 100px;
  }
}

/* Scrollbar para áreas de código */
.custom-html-content::-webkit-scrollbar,
.preview-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-html-content::-webkit-scrollbar-track,
.preview-container::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.custom-html-content::-webkit-scrollbar-thumb,
.preview-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-html-content::-webkit-scrollbar-thumb:hover,
.preview-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones */
.template-card {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos de seguridad para contenido personalizado */
.custom-html-content :deep(iframe) {
  max-width: 100%;
  max-height: 300px;
}

.custom-html-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.custom-html-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
}

.custom-html-content :deep(pre) {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
}

/* Estados del widget */
.loading-state {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>