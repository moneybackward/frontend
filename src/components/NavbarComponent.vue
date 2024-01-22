<template>
  <q-header elevated>
    <nav>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn @click="$router.push('/')">
            <q-avatar class="q-mr-sm">
              <img
                src="../assets/money_backward_icon_main.png"
                alt="money backward logo"
              />
            </q-avatar>
            Money Backward
          </q-btn>
        </q-toolbar-title>

        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="isSidebarOpen = !isSidebarOpen"
        />
      </q-toolbar>
      <SidebarComponent :isOpen="isSidebarOpen" />
    </nav>
  </q-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SidebarComponent from 'src/components/SidebarComponent.vue';

const isSidebarOpen = ref<boolean>(false);
</script>
