<template>
  <q-page-container>
    <q-page class="flex flex-center bg-primary">
      <q-card class="q-pa-md shadow-2 my_card" bordered>
        <q-card-section class="text-center">
          <div class="text-grey-9 text-h5 text-weight-bold">Sign up</div>
          <div class="text-grey-8">Sign in below to access your account</div>
        </q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="email"
              label="Email Address"
              :rules="emailRule"
              lazy-rules
            />
            <q-input
              dense
              outlined
              v-model="name"
              label="Name"
              :rules="nameRule"
              lazy-rules
            />
            <q-input
              dense
              outlined
              v-model="password"
              label="Password"
              :type="!isPeekPwd ? 'password' : 'text'"
              :rules="passwordRule"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="!isPeekPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPeekPwd = !isPeekPwd"
                />
              </template>
            </q-input>
            <q-input
              dense
              outlined
              v-model="passwordConf"
              label="Password Confirmation"
              :type="!isPeekPwdConf ? 'password' : 'text'"
              :rules="passwordConfRule"
              lazy-rules
            >
              <template v-slot:append>
                <q-icon
                  :name="!isPeekPwdConf ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPeekPwdConf = !isPeekPwdConf"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-btn
              style="border-radius: 8px"
              color="primary"
              rounded
              size="md"
              label="Sign up"
              no-caps
              class="full-width"
              type="submit"
            ></q-btn>
          </q-card-section>
        </q-form>
        <q-card-section class="text-center q-pt-none">
          <div class="text-grey-8">
            Already have an account?
            <a
              href="/auth/login"
              class="text-accent text-weight-bold"
              style="text-decoration: none"
              >Sign in.</a
            >
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { register } from 'src/api/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { emailRule, nameRule, passwordRule } from 'src/rules/auth';

const name = ref('');
const password = ref('');
const passwordConf = ref('');
const email = ref('');
const isPeekPwd = ref(false);
const isPeekPwdConf = ref(false);

const passwordConfRule = [
  (v: string) => !!v || 'Password Confirmation is required',
  (v: string) => v === password.value || 'Password Confirmation must match',
];

const $q = useQuasar();
const router = useRouter();

async function onSubmit() {
  await register({
    email: email.value,
    name: name.value,
    password: password.value,
    password_confirmation: passwordConf.value,
  })
    .then(() => {
      $q.notify({
        message: 'Register success',
        position: 'top',
        type: 'positive',
      });

      setTimeout(() => {
        router.push('/auth/login');
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
