<template>
  <div class="q-mb-md">
    <div class="text-center q-mr-md" style="flex: 1">
      <div class="text-h5 text-weight-bold q-mt-lg">SCREENSHOT</div>
      <q-img
        v-for="(screenshot, index) in screenshots"
        :key="index"
        :src="screenshot"
        style="max-width: 300px; height: auto; margin-right: 20px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const screenshots = [
  'src/assets/screenshot/4.svg',
  'src/assets/screenshot/3.svg',
  'src/assets/screenshot/5.svg',
];
</script>
