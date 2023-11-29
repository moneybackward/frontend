<template>
  <q-page class="col q-mx-md">
    <h1>Register Page</h1>
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
          v-model="name"
          label="Name"
          :rules="nameRule"
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
        <q-input
          filled
          v-model="passwordConf"
          label="Password Confirmation"
          :rules="passwordConfRule"
          type="password"
          lazy-rules
        />
        <q-btn label="Register" type="submit" color="primary" />
      </q-form>
    </section>
    <footer>
      Already have an account?
      <router-link to="/auth/login">Login</router-link>
    </footer>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { register } from 'src/api/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const password = ref('');
const passwordConf = ref('');
const email = ref('');

const emailRule = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+/.test(v) || 'Email must be valid',
];
const passwordRule = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
];
const passwordConfRule = [
  (v: string) => !!v || 'Password Confirmation is required',
  (v: string) => v === password.value || 'Password Confirmation must match',
];
const nameRule = [(v: string) => !!v || 'Username is required'];

const $q = useQuasar();
const router = useRouter();

async function onSubmit() {
  const resp = await register({
    email: email.value,
    name: name.value,
    password: password.value,
    password_confirmation: passwordConf.value,
  })
    .then((resp) => resp)
    .catch((err) => {
      $q.notify({
        message: err.response.data.error,
        position: 'top',
        type: 'negative',
      });
      return err;
    });

  if (resp.status === 201) {
    $q.notify({
      message: 'Register success',
      type: 'positive',
    });

    setTimeout(() => {
      router.push('/auth/login');
    }, 1000);
  }
}
</script>
