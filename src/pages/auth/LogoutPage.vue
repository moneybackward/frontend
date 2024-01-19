<template><div></div></template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

function onSubmit() {
  $q.cookies.remove('jwt_token');
  $q.notify({
    message: 'Logged out successfully',
    position: 'top',
    type: 'positive',
  });

  setTimeout(() => {
    router.push('/auth/login');
  }, 1000);
}

onSubmit();
</script>
