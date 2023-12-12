<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ data.label }}</q-item-label>
      <q-item-label caption>{{ data.category?.name || '' }}</q-item-label>
    </q-item-section>

    <q-item-section side top>
      <q-item-label :class="textColor">{{ data.amount }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ITransaction } from 'src/api/transactions';

const props = defineProps<{
  data: ITransaction;
}>();
const textColor = props.data.is_expense ? 'text-red' : 'text-green';
</script>
