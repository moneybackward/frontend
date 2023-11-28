<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="../assets/money_backward.png" alt="money backward logo" />
          </q-avatar>
          Money Backward
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <SidebarComponent ref="sidebarRef" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import SidebarComponent from "../components/Sidebar.vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    SidebarComponent,
  },
  methods: {
    toggleRightDrawer() {
      this.$refs.sidebarRef.isOpen = !this.$refs.sidebarRef.isOpen;
    },
  },
});
</script>
