<template>
  <q-page class="col q-mx-md">
    <h1>Login Page</h1>
    <section>
      <q-form @submit="onSubmit">
        <q-input
          filled
          v-model="email"
          label="Email"
          :rules="emailRule"
          lazy-rules
        />
        <q-input
          filled
          v-model="password"
          label="Password"
          :rules="passwordRule"
          type="password"
          lazy-rules
        />
        <q-btn label="Login" type="submit" color="primary" />
      </q-form>
    </section>
    <footer>
      <div class="not-registered">
        Don't have an account yet?
        <router-link to="/auth/register">Register</router-link>
      </div>
      <div class="forget-password">
        <router-link to="/auth/forget-password">Forget password?</router-link>
      </div>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { login } from 'src/api/auth';
import { ref } from 'vue';
import { emailRule, passwordRule } from 'src/rules/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');

const $q = useQuasar();
const router = useRouter();

async function onSubmit() {
  await login({
    email: email.value,
    password: password.value,
  })
    .then(() => {
      $q.notify({
        message: 'Register success',
        position: 'top',
        type: 'positive',
      });

      setTimeout(() => {
        router.push('/app');
      }, 1000);
    })
    .catch((err) => {
      $q.notify({
        message: err.response.data.error,
        position: 'top',
        type: 'negative',
      });
      return err;
    });
}
</script>
