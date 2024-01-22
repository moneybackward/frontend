<template>
  <q-item class="transaction-item" :class="customClass">
    <q-item-label
      :style="{
        'background-color': data.category?.color,
        width: '20px',
        marginBottom: 'auto',
      }"
      class="category-color"
    ></q-item-label>

    <section class="transaction-item-content">
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
    </section>

    <q-item-section side top class="action-buttons">
      <q-btn
        flat
        round
        dense
        icon="edit"
        @click="editTransaction"
        class="edit-btn q-mr-sm text-warning"
      />
      <q-btn
        flat
        round
        dense
        icon="delete"
        @click="deleteTransaction"
        class="delete-btn q-mr-sm text-negative"
      />
    </q-item-section>
  </q-item>
</template>

<style scoped>
.transaction-item {
  align-items: center;
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

.transaction-item-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
}

@media screen and (max-width: 600px) {
  .transaction-item-content {
    flex-direction: column;
    justify-content: space-between;
  }
}

.category-color {
  border-radius: 50%;
  width: 20px;
  aspect-ratio: 1/1;
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

@media screen and (max-width: 600px) {
  .label {
    font-size: 14px;
  }

  .category-name {
    font-size: 12px;
  }

  .amount {
    font-size: 14px;
  }
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
  customClass?: string;
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
