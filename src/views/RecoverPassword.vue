<template>
  <Card title="Recuperar contraseña">
    <div class="p-fluid">
      <div class="p-field">
        <label for="email">Email</label>
        <InputText id="email" v-model="form.email" type="email" />
      </div>
      <Button label="Enviar enlace" @click="onSubmit" :loading="loading" />
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { recoverPassword } from '@/services/auth.services.js';
import { useRouter } from 'vue-router';

const form = ref({ email: '' });
const loading = ref(false);
const router = useRouter();

async function onSubmit() {
  if (!form.value.email) return;
  loading.value = true;
  try {
    await recoverPassword(form.value.email);
    router.push('/recover-sent');
  } catch (error) {
    // Mostrar toast de error
  } finally {
    loading.value = false;
  }
}
</script>
