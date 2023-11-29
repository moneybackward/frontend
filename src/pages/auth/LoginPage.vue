<template>
  <q-page class="flex flex-center">
    <h1>Login Page</h1>
    <section>
      <q-form>
        <q-input filled v-model="username" label="Username" />
        <q-input filled v-model="password" label="Password" />
        <q-btn label="Login" color="primary" />
      </q-form>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
</script>
