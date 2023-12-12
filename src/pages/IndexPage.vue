<template>
  <q-page class="flex column">
    <!-- Pengeluaran X -->
    <section class="transaction">
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.label"
        :data="transaction"
      />
    </section>
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Total Harian</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label class="text-black">{{ todayTotal }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Total Tabungan</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label class="text-black">{{ total }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script setup lang="ts">
import { ITransaction } from 'src/api/transactions';
import TransactionItem from 'src/components/TransactionItem.vue';

const transactions: ITransaction[] = [
  {
    id: '1',
    label: 'Gaji',
    category_id: '1',
    amount: 58_600_000,
    is_expense: false,
    note_id: '1',
    date: new Date('2021-09-01'),
    created_at: new Date('2021-09-01').toISOString(),
    updated_at: new Date('2021-09-01').toISOString(),
  },
  {
    id: '2',
    label: 'Nasi goreng',
    note_id: '1',
    category_id: '2',
    amount: 15_000,
    is_expense: true,
    date: new Date('2021-09-01'),
    created_at: new Date('2021-09-01').toISOString(),
    updated_at: new Date('2021-09-01').toISOString(),
  },
];

const today = new Date('2021-09-01');

const todayTransactions = transactions.filter(
  (t) => t.date.getDate() === today.getDate()
);
const todayTotalIncome = todayTransactions
  .filter((t) => t.is_expense === false)
  .reduce((acc, curr) => acc + curr.amount, 0);
const todayTotalExpense = todayTransactions
  .filter((t) => t.is_expense === true)
  .reduce((acc, curr) => acc + curr.amount, 0);
const todayTotal = todayTotalIncome - todayTotalExpense;
const total = todayTotal;
</script>
