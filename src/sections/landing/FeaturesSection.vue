<template>
  <div class="q-mb-md row">
    <div
      v-for="(feature, index) in features"
      :key="index"
      class="text-center q-mr-md"
      style="flex: 1"
    >
      <q-avatar>
        <img :src="feature.image" />
      </q-avatar>
      <div class="text-h6">{{ feature.title }}</div>
      <div class="text-weight-light">{{ feature.description }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
const features = [
  {
    image: 'https://picsum.photos/200/300',
    title: 'Feature 1',
    description: 'Feature 1 Description',
  },
  {
    image: 'https://picsum.photos/200/300',
    title: 'Feature 2',
    description: 'Feature 2 Description',
  },
  {
    image: 'https://picsum.photos/200/300',
    title: 'Feature 3',
    description: 'Feature 3 Description',
  },
];
</script>
