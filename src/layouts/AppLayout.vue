<template>
  <q-layout view="hHh LpR fFr">
    <navbar-component />

    <q-page-container>
      <section class="container">
        <back-button />
        <current-note />
      </section>

      <router-view />
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-tabs align="center">
        <q-route-tab to="/app/note/stats">
          <q-icon name="bar_chart" size="md" />
        </q-route-tab>
        <q-route-tab :to="`/app/note/transaction`">
          <q-icon name="sync_alt" size="md" />
        </q-route-tab>
        <q-route-tab to="/app/profile">
          <q-icon name="person" size="md" />
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import BackButton from 'src/components/common/BackButton.vue';
import CurrentNote from 'src/components/common/CurrentNote.vue';
import NavbarComponent from 'src/components/NavbarComponent.vue';
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  max-width: 70rem;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}
</style>
