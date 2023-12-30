<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{ data.label }}</q-item-label>
      <q-item-label caption>{{ data.category?.name || '' }}</q-item-label>
    </q-item-section>

    <q-item-label :class="textColor">{{ data.amount }}</q-item-label>
    <q-item-section side top class="row">
      <q-btn
        flat
        round
        dense
        icon="edit"
        @click="editTransaction"
        class="q-mr-sm"
      />
      <q-btn
        flat
        round
        dense
        icon="delete"
        @click="deleteTransaction"
        class="q-mr-sm"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { ITransaction } from 'src/api/transactions';

const props = defineProps<{
  data: ITransaction;
  onOpen?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}>();
const textColor = props.data.is_expense ? 'text-red' : 'text-green';
function editTransaction() {
  if (props.onEdit) {
    props.onEdit(props.data.id);
  }
}

function deleteTransaction() {
  if (props.onDelete) {
    props.onDelete();
  }
}
</script>
