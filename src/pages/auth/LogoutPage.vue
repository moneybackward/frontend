<template>
  <q-page class="col q-mx-md">
    <h3>You've succesfully logged out!</h3>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

function onSubmit() {
  $q.cookies.remove('jwt_token');

  setTimeout(() => {
    router.push('/auth/login');
  }, 1000);
}

onSubmit();
</script>
