<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ data.label }}</q-item-label>
      <q-item-label caption>{{ data.category }}</q-item-label>
      <q-item-label caption>{{ data.description }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label class="text-green">{{ data.amount }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ITransactionItem } from './models';

defineProps<{
  data: ITransactionItem;
}>();
</script>
