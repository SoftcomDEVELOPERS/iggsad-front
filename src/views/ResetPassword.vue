<template>
  <Card title="Cambiar contraseña">
    <div class="p-fluid">
      <div class="p-field">
        <label for="newPassword">Nueva contraseña</label>
        <Password id="newPassword" v-model="form.newPassword" />
      </div>
      <div class="p-field">
        <label for="confirmPassword">Confirmar contraseña</label>
        <Password id="confirmPassword" v-model="form.confirmPassword" />
      </div>
      <Button label="Cambiar contraseña" @click="onSubmit" :loading="loading" />
    </div>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Password from 'primevue/password';
import Button from 'primevue/button';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '@/services/auth.services.js';

const route = useRoute();
const router = useRouter();
const token = ref('');
const form = ref({ newPassword: '', confirmPassword: '' });
const loading = ref(false);

onMounted(() => {
  token.value = route.query.token || '';
  if (!token.value) {
    router.replace('/login');
  }
});

async function onSubmit() {
  if (form.value.newPassword !== form.value.confirmPassword) {
    // Mostrar validación
    return;
  }
  loading.value = true;
  try {
    await resetPassword(token.value, form.value.newPassword, form.value.confirmPassword);
    router.push('/login');
  } catch (error) {
    // Mostrar toast de error
  } finally {
    loading.value = false;
  }
}
</script>
