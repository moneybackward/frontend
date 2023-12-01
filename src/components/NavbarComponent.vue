<template>
  <q-header elevated>
    <nav>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/money_backward.png" alt="money backward logo" />
          </q-avatar>
          Money Backward
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
      <SidebarComponent :isOpen="sidebarRefOpen" />
    </nav>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarComponent from 'src/components/SidebarComponent.vue';

const sidebarRefOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
