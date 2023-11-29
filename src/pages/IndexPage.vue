<template>
  <q-page class="flex column">
    <q-input
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      class="q-ma-md"
      color="teal"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

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
import { ITransactionItem } from 'src/components/models';
import TransactionItem from 'src/components/TransactionItem.vue';

const date = new Date().toString();

const transactions: ITransactionItem[] = [
  {
    label: 'Gaji',
    category: 'Gaji',
    description: 'Gaji untuk bulan September',
    amount: 58_600_000,
    type: 'income',
    date: new Date('2021-09-01'),
  },
  {
    label: 'Nasi goreng',
    category: 'Makanan',
    description: 'Beli makanan hari ini',
    amount: 15_000,
    type: 'expense',
    date: new Date('2021-09-01'),
  },
];

const today = new Date('2021-09-01');

const todayTransactions = transactions.filter(
  (t) => t.date.getDate() === today.getDate()
);
const todayTotalIncome = todayTransactions
  .filter((t) => t.type === 'income')
  .reduce((acc, curr) => acc + curr.amount, 0);
const todayTotalExpense = todayTransactions
  .filter((t) => t.type === 'expense')
  .reduce((acc, curr) => acc + curr.amount, 0);
const todayTotal = todayTotalIncome - todayTotalExpense;
const total = todayTotal;
</script>
