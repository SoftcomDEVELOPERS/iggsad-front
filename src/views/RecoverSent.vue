<template>
  <Card>
    <p>Se ha enviado un correo con instrucciones para restablecer tu contraseña.</p>
    <Button label="Volver al login" @click="$router.push('/login')" />
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
</script>
