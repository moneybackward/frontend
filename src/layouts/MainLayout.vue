<template>
  <q-layout view="hHh LpR fFr">
    <q-header reveal elevated class="bg-white text-black" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          M-BACK
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      overlay
      elevated
      :width="283"
    >
      <!-- drawer content -->
      <q-list bordered>
        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">
            Home
          </q-item-section>
        </q-item>
        <q-item to="/about" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">
            About
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <q-input
        filled
        v-model="date"
        mask="date"
        :rules="['date']"
        class="q-ma-md"
        color="teal"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Pengeluaran X -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Gaji</q-item-label>
          <q-item-label caption> Gaji untuk bulan September </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label class="text-green">58.600.000</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Nasi goreng</q-item-label>
          <q-item-label caption> Beli makanan hari ini </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label class="text-red">15.000</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Total Harian</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-black">58.585.000</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Total Tabungan</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label class="text-black">550.585.000</q-item-label>
        </q-item-section>
      </q-item>
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

<script>
import { ref } from "vue";

export default {
  setup() {
    const rightDrawerOpen = ref(false);
    const currentDate = new Date().toISOString().split("T")[0];

    return {
      date: ref(currentDate),
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },
};
</script>
