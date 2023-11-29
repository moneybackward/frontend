<template>
  <q-page class="flex flex-center">
    <h1>Register Page</h1>
    <section>
      <q-form>
        <q-input filled v-model="username" label="Username" />
        <q-input filled v-model="password" label="Password" />
        <q-input filled v-model="passwordConf" label="Password Confirmation" />
        <q-input filled v-model="email" label="Email" />
        <q-btn label="Register" color="primary" />
      </q-form>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const passwordConf = ref('');
const email = ref('');
</script>
