<template>
  <q-page class="col q-mx-md">
    <h1>Login Page</h1>
    <section>
      <q-form @submit="onSubmit">
        <q-input filled v-model="email" label="Email" />
        <q-input filled v-model="password" label="Password" />
        <q-btn label="Login" type="submit" color="primary" />
      </q-form>
    </section>
    <footer>
      Don't have an account yet?
      <router-link to="/auth/register">Register</router-link>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { login } from 'src/api/auth';
import { ref } from 'vue';

const email = ref('');
const password = ref('');

async function onSubmit() {
  const resp = await login({
    email: email.value,
    password: password.value,
  });
  console.log(resp);
}
</script>
