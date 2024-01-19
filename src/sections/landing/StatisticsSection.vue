<template>
  <div class="q-mb-md row">
    <q-card
      v-for="(statistic, index) in statistics"
      :key="index"
      class="text-center q-mr-md q-pr-pd"
      style="flex: 1"
    >
      <q-card-section>
        <div class="text-h6">{{ statistic.label }}</div>
        <div>{{ formatCounter(index) }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const statistics = [
  { label: 'Total Downloads', value: 1000, target: 10000 },
  { label: 'Total Reviews', value: 500, target: 5000 },
  { label: 'Active Users', value: 1000, target: 8000 },
];
const counterValues = ref<number[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const counters = ref<any[]>([]);

function initializeCounters() {
  statistics.forEach((statistic, index) => {
    counterValues.value[index] = statistic.value;
    const counter = setInterval(() => {
      if (counterValues.value[index] < statistic.target) {
        const increment = Math.ceil(
          (statistic.target - counterValues.value[index]) / 25
        );
        counterValues.value[index] += increment;
      } else {
        clearInterval(counters.value[index]);
      }
    }, 50);
    counters.value[index] = counter;
  });
}

function formatCounter(index: number) {
  const value = counterValues.value[index];
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k++`;
  } else {
    return value;
  }
}

onMounted(() => {
  initializeCounters();
});
</script>
