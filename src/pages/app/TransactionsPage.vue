<template>
  <q-page>
    <q-input
      filled
      v-model="dateFilterStr"
      mask="date"
      :rules="['date']"
      class="q-ma-md"
      color="teal"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="dateFilterStr"
              @update:model-value="filterTransactions"
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <section name="transactions">
      <TransactionItem
        v-for="transaction in transactions"
        :key="transaction.label"
        :data="transaction"
      />
    </section>
    <section name="totals">
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold">Total Harian</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label class="text-black">{{ dateTotal }}</q-item-label>
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
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ITransactionItem } from 'src/components/models';
import TransactionItem from 'src/components/TransactionItem.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

// get note id from route params
const $route = useRoute();
const noteId = $route.params.id;

function fetchTransactions() {
  // fetch transactions from API
  console.log('fetching transactions for note', noteId);
}
fetchTransactions();

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
    date: new Date('2023-12-03'),
  },
];

const currDate = new Date();
const dateFilterStr = ref(currDate.toISOString());
const dateTransactions = ref<ITransactionItem[]>([]);
const dateTotal = ref<number>(0);
const total = ref<number>(0);

function filterTransactions() {
  dateTransactions.value = transactions.filter((t) => {
    const dateFilter = new Date(dateFilterStr.value);
    dateFilter.setHours(0, 0, 0, 0);
    t.date.setHours(0, 0, 0, 0);
    return t.date.valueOf() == dateFilter.valueOf();
  });
  const dateTotalIncome = dateTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const dateTotalExpense = dateTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
  dateTotal.value = dateTotalIncome - dateTotalExpense;
  total.value = dateTotal.value;
}

filterTransactions();
</script>
