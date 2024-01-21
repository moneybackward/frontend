<template>
  <q-page-container>
    <q-page class="flex flex-center bg-grey-2">
      <q-card class="q-pa-md shadow-2 my_card" bordered>
        <q-card-section class="text-center">
          <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
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
          </q-card-section>
          <q-card-section>
            <q-btn
              style="border-radius: 8px"
              :disable="isClicked"
              color="dark"
              rounded
              size="md"
              label="Sign in"
              no-caps
              class="full-width"
              type="submit"
            ></q-btn>
          </q-card-section>
        </q-form>
        <q-card-section class="text-center q-pt-none">
          <div class="text-grey-8">
            Don't have an account yet?
            <a
              href="/auth/register"
              class="text-dark text-weight-bold"
              style="text-decoration: none"
              >Sign up.</a
            >
          </div>
          <div class="forget-password">
            <a
              href="/auth/forget-password"
              class="text-dark text-weight-bold"
              style="text-decoration: none"
              >Forget password?</a
            >
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import { login } from 'src/api/auth';
import { ref } from 'vue';
import { emailRule, passwordRule } from 'src/rules/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isPeekPwd = ref(false);

const $q = useQuasar();
const router = useRouter();

const isClicked = ref(false);
async function onSubmit() {
  isClicked.value = true;
  await login({
    email: email.value,
    password: password.value,
  })
    .then((res) => {
      $q.notify({
        message: 'Login success',
        position: 'top',
        type: 'positive',
      });

      // set cookie
      $q.cookies.set('jwt_token', res.data.data, {
        sameSite: 'None',
        secure: true,
      });

      setTimeout(() => {
        router.push('/app/note');
      }, 1000);
    })
    .catch((err) => {
      $q.notify({
        message: err.response.data.error,
        position: 'top',
        type: 'negative',
      });
      isClicked.value = false;
      return err;
    })
    .finally(() => {
      // in case something went wrong
      setTimeout(() => {
        isClicked.value = false;
      }, 1000);
    });
}
</script>
