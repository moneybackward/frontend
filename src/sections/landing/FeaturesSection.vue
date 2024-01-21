<template>
  <div class="full-width flex col">
    <div
      v-for="(feature, index) in features"
      :key="index"
      class="text-center flex row justify-center items-center q-my-md full-width q-py-xl gap-2"
      :class="index % 2 === 0 ? 'bg-pink-1' : ''"
    >
      <q-img
        v-if="index % 2 === 0"
        :src="feature.image"
        style="
          max-height: 100rem;
          height: 100%;
          width: 15rem;
          margin-right: 20px;
        "
      />
      <section>
        <div class="text-h6">{{ feature.title }}</div>
        <div class="text-weight-light">{{ feature.description }}</div>
      </section>
      <q-img
        v-if="index % 2 === 1"
        :src="feature.image"
        style="
          max-height: 100rem;
          height: 100%;
          width: 15rem;
          margin-right: 20px;
        "
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const features = [
  {
    image: 'screenshots/transactions.jpg',
    title: 'Income and Expenditure Tracking',
    description: 'Track your income and expenditure with ease',
  },
  {
    image: 'screenshots/ocr.gif',
    title: 'OCR',
    description: 'Use OCR to help scan your receipts and bills amount',
  },
  {
    image: 'screenshots/statistics.jpg',
    title: 'Statistics',
    description: 'View your income and expenditure statistics',
  },
  {
    image: 'screenshots/expenditure_breakdown.jpg',
    title: 'Graphical Expenditure Breakdown',
    description: 'View your expenditure breakdown and usage of budget',
  },
  {
    image: 'screenshots/notes.jpg',
    title: 'Multiple Notes',
    description: 'Multiple notes for different needs',
  },
];
</script>
<style scoped>
.gap-2 {
  gap: 2rem;
}
</style>
