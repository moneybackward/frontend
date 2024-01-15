<template>
  <q-item class="transaction-item">
    <q-item-label
      :style="{ 'background-color': data.category?.color, width: '20px' }"
      class="category-color"
    ></q-item-label>
    <q-item-section>
      <q-item-label class="label text-weight-bold">{{
        data.label
      }}</q-item-label>
      <q-item-label caption class="category-name">
        {{ data.category?.name || 'Uncategorized' }}
      </q-item-label>
    </q-item-section>

    <q-item-label :class="textColor" class="amount">
      {{ formatCurrency(data.amount) }}
    </q-item-label>
    <q-item-section side top class="action-buttons">
      <q-btn
        flat
        round
        dense
        icon="edit"
        @click="editTransaction"
        class="edit-btn q-mr-sm"
      />
      <q-btn
        flat
        round
        dense
        icon="delete"
        @click="deleteTransaction"
        class="delete-btn q-mr-sm"
      />
    </q-item-section>
  </q-item>
</template>

<style scoped>
.transaction-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: background-color 0.3s;
  margin-bottom: 15px;
}

.transaction-item:hover {
  background-color: #f5f5f5;
}

.category-color {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-right: 10px;
}

.label {
  font-size: 18px;
}

.category-name {
  font-size: 14px;
  color: #777777;
}

.amount {
  font-size: 18px;
  font-weight: bold;
}

.action-buttons {
  margin-top: 10px;
}

.edit-btn,
.delete-btn {
  color: #777777;
}

.edit-btn:hover,
.delete-btn:hover {
  color: #333333;
}
</style>

<script setup lang="ts">
import { ITransaction } from 'src/api/transactions';
import { formatCurrency } from 'src/utils/formatNumber';

const props = defineProps<{
  data: ITransaction;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}>();
const textColor = props.data.is_expense ? 'text-red' : 'text-green';
function editTransaction() {
  if (props.onEdit) props.onEdit();
}

function deleteTransaction() {
  if (props.onDelete) props.onDelete();
}
</script>
