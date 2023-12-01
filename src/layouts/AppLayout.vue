<template>
  <q-layout view="hHh LpR fFr">
    <navbar-component />

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-tabs align="center">
        <q-route-tab to="/">
          <q-icon name="fa-solid fa-house" />
        </q-route-tab>
        <q-route-tab to="/home">
          <q-icon name="fa-solid fa-sack-dollar" />
        </q-route-tab>
        <q-route-tab to="/home">
          <q-icon name="fa-solid fa-user" />
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import NavbarComponent from 'src/components/NavbarComponent.vue';
</script>
