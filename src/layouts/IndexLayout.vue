<template>
  <q-layout view="lHh Lpr lFf">
    <navbar-component />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NavbarComponent from 'src/components/NavbarComponent.vue';
</script>
