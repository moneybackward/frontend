<template>
  <q-layout view="hHh LpR fFr">
    <navbar-component />

    <q-page-container>
      <back-button />
      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-tabs align="center">
        <q-route-tab to="/app/">
          <q-icon name="apps" size="md" />
        </q-route-tab>
        <q-route-tab to="/app/note/">
          <q-icon name="note" size="md" />
        </q-route-tab>
        <q-route-tab to="/app/profile">
          <q-icon name="person" size="md" />
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import BackButton from 'src/components/BackButton.vue';
import NavbarComponent from 'src/components/NavbarComponent.vue';
</script>
