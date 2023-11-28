<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/money_backward.png" alt="money backward logo" />
          </q-avatar>
          Money Backward
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleSidebar" />
      </q-toolbar>
    </q-header>

    <SidebarComponent :isOpen="sidebarRefOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarComponent from 'src/components/SidebarComponent.vue';

const sidebarRefOpen = ref(true);

function toggleSidebar() {
  sidebarRefOpen.value = !sidebarRefOpen.value;
  console.log(sidebarRefOpen.value);
}
</script>
