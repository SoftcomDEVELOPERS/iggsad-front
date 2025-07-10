<!-- src/components/ExpedientesDrawer.vue -->
<template>
  <Drawer 
    :visible="visible"
    @update:visible="updateVisible"
    position="bottom"
    :modal="!drawerFullscreen"
    :dismissable-mask="!drawerFullscreen"
    class="expedientes-drawer"
    :style="drawerFullscreen ? 'width:100vw; height:100vh;' : 'height:75vh;'"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h2 class="text-lg font-semibold">Resultados de Expedientes</h2>
        <div class="flex gap-2">
          <Button
            :icon="drawerFullscreen ? 'pi pi-compress' : 'pi pi-expand'"
            :label="drawerFullscreen ? 'Ventana' : 'Pantalla Completa'"
            size="small"
            outlined
            @click="toggleFullscreen"
          />
        </div>
      </div>
    </template>

    <ExpedientesTable
      :expedientes="expedientes"
      :loading="loading"
      :pagination="pagination"
      @page="onPage"
      @rowClick="onRowClick"
    />
  </Drawer>
</template>

<script setup>
import { ref } from 'vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import ExpedientesTable from '@/components/expedientes/ExpedientesTable.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  visible: Boolean,
  expedientes: Array,
  loading: Boolean,
  pagination: Object
})
const emit = defineEmits(['update:visible','page'])

function updateVisible(val) {
  emit('update:visible', val)
}

const drawerFullscreen = ref(false)
function toggleFullscreen() {
  drawerFullscreen.value = !drawerFullscreen.value
}

function onPage(newPage) {
  emit('page', newPage)
}

// Al hacer click en una fila, navegamos al detalle
const router = useRouter()
function onRowClick(row) {
  console.log("Fila seleccionada:", row);
  
  //router.push({ name: 'ExpedienteDetail', params: { id: row.id } })
}
</script>

<style scoped>
.expedientes-drawer .p-drawer-content {
  padding: 1rem;
}
</style>
