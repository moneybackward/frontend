<template>
  <q-page class="q-pa-md">
    <!-- Title Section -->
    <div class="q-mb-md items-center justify-center row">
      <div class="q-mr-md">
        <div class="text-h2 q-mb-md text-weight-bold">Expense Tracking</div>
        <div class="text-h3 q-mb-md text-weight-bold">Made Easy</div>
        <div class="text-h5 q-mb-md text-weight-light">
          Track, Budget, and Save with Our App
        </div>
        <!-- <q-btn color="primary" class="q-mr-md" label="Learn More" /> -->
        <q-btn
          color="secondary"
          class="q-mr-md"
          label="Open App"
          @click="$router.push('/app')"
        />
      </div>
      <q-img
        src="../assets/screenshot/1.svg"
        style="max-width: 400px; height: auto"
      />
    </div>

    <features-section />

    <statistic-section />

    <screenshots-section />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatisticSection from 'src/sections/landing/StatisticsSection.vue';
import ScreenshotsSection from 'src/sections/landing/ScreenshotsSection.vue';
import FeaturesSection from 'src/sections/landing/FeaturesSection.vue';

/** Install PWA Prompt - Begin */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let deferredPrompt: any = null;

const installable = ref<boolean>(false);
function addInstallEvent() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    // Update UI notify the user they can install the PWA
    installable.value = true;
  });

  window.addEventListener('appinstalled', () => {
    // Log install to analytics
    console.log('INSTALL: Success');
  });
}

function handleInstallClick() {
  // Hide the app provided install promotion
  installable.value = false;
  // Show the install prompt
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deferredPrompt.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('INSTALL: Accepted');
    } else {
      console.log('INSTALL: Rejected');
    }
    deferredPrompt = null;
  });
}
/** Install PWA Prompt - Begin */

addInstallEvent();
</script>
