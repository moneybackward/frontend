<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <h1>Welcome to Money Backward</h1>
    <p>
      Login or Register to get started
      <a href="/auth/login" class="q-pa-sm rounded-borders bg-red"> Login </a>
      <a href="/auth/register" class="q-pa-sm rounded-borders bg-red"
        >Register</a
      >
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
