<template>
  <q-page class="transaction-page">
    <transaction-modal-section
      :data="transactionData"
      :is-edit="isEditModal"
      v-model:is-open="isModalOpen"
      :submit-callback="fetchTransactions"
    />

    <section class="content">
      <div class="center-header">
        <h4>Transaction</h4>
      </div>

      <div class="button-group">
        <q-btn
          label="+ Create new"
          type="button"
          color="primary"
          @click="
            () => {
              isModalOpen = true;
              isEditModal = false;
              transactionData = undefined;
            }
          "
          class="create-new-btn"
        />
        <q-btn
          label="Categories"
          type="button"
          color="secondary"
          @click="$router.push(`/app/note/category`)"
          class="categories-btn"
        />
      </div>

      <section>
        <q-tabs
          v-model="tab"
          class="bg-primary text-white shadow-2 date-filter-input"
          align="center"
        >
          <q-tab
            v-for="option in tabOptions"
            :key="option.value"
            :label="option.label"
            :name="option.value"
          />
        </q-tabs>
      </section>

      <section name="transactions" class="transactions-section">
        <section v-if="Object.keys(transactionsListByDate).length === 0">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h5 text-center"
                >No Transactions Recorded!</q-item-label
              >
            </q-item-section>
          </q-item>
        </section>
        <section v-else>
          <div
            class="transaction-item"
            v-for="date in Object.keys(transactionsListByDate)"
            :key="date"
          >
            <div class="date-header">
              <span class="date">{{ formatDate(date) }}</span>
            </div>
            <div class="transaction-list">
              <TransactionItem
                v-for="transaction in transactionsListByDate[date]"
                :key="transaction.id"
                :data="transaction"
                :on-edit="() => triggerEditTransaction(transaction.id)"
                :on-delete="() => onDeleteTransaction(transaction.id)"
              />
            </div>

            <section class="totals-row">
              <q-item class="total-item col-6 q-px-md" color="green">
                <q-item-section class="total-label">
                  <q-item-label class="text-weight-bold">Income</q-item-label>
                </q-item-section>
                <q-item-section side class="text-bold">
                  {{
                    formatCurrency(
                      transactionsListByDate[date]
                        .filter((transaction) => !transaction.is_expense)
                        .reduce((result, current) => result + current.amount, 0)
                    )
                  }}
                </q-item-section>
              </q-item>
              <q-item class="total-item col-6 q-px-sm" color="red">
                <q-item-section class="total-label">
                  <q-item-label class="text-weight-bold">Expense</q-item-label>
                </q-item-section>
                <q-item-section side class="text-bold">
                  {{
                    formatCurrency(
                      transactionsListByDate[date]
                        .filter((transaction) => transaction.is_expense)
                        .reduce((result, current) => result + current.amount, 0)
                    )
                  }}
                </q-item-section>
              </q-item>
            </section>
          </div>

          <section name="totals" class="totals-section">
            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold"
                  >Total Harian</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-black">{{ dateTotal }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="text-weight-bold"
                  >Total Tabungan</q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="text-black">{{ total }}</q-item-label>
              </q-item-section>
            </q-item>
          </section>
        </section>
      </section>
    </section>
  </q-page>
</template>

<style scoped>
.totals-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}

@media screen and (max-width: 768px) {
  .totals-row {
    flex-direction: column;
  }
}

.total-item {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: background-color 0.3s;
}

.total-item:hover {
  background-color: #f5f5f5;
}

.total-label {
  font-size: 18px;
  text-align: left;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
}

.date-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.transaction-list {
  margin-bottom: 10px;
}

.col-6 {
  flex: 0 0 48%;
  text-align: center;
  font-size: 14px;
  padding: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
}

.header-buttons q-btn {
  margin-left: 10px;
}
.transaction-page {
  padding: 20px;
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transactions-section {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.totals-section {
  margin-top: 20px;
  margin-left: 20%;
  margin-right: 20%;
}

.create-new-btn,
.categories-btn {
  margin-right: 10px;
}

.transaction-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.date-filter-input {
  width: 90vw;
  max-width: 500px;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.button-group q-btn {
  margin-left: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  max-width: 70rem;
  margin: 0 auto;
  gap: 1rem;
}

@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}

.gap {
  gap: 1rem;
}
</style>

<script setup lang="ts">
import { useMeta, useQuasar } from 'quasar';
import {
  deleteTransaction,
  getTransactionsList,
  ITransaction,
} from 'src/api/transactions';
import TransactionItem from 'src/components/TransactionItem.vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from 'src/utils/formatDate';
import { formatCurrency } from 'src/utils/formatNumber';
import { getNoteDetail, INote } from 'src/api/notes';
import TransactionModalSection from 'src/sections/transaction/ModalSection.vue';

// get note id from route params
const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $q.cookies.get('last_opened_note') as string;

if (!noteId) {
  $router.push('/app/note');
}

useMeta({
  title: 'Transaction | Money Backward',
});

const noteDetail = ref<INote>();

function fetchNoteDetail() {
  getNoteDetail({ noteId }, { jwt_token })
    .then((res) => {
      noteDetail.value = res;
    })
    .catch((error) => {
      console.error(error);
    });
}

const transactionsListByDate = ref<{ [key: string]: ITransaction[] }>({});
function fetchTransactions(startDate?: string, endDate?: string) {
  getTransactionsList(
    noteId,
    { jwt_token },
    { dateFilter: { start: startDate, end: endDate } }
  )
    .then((transactions) => {
      const groupedByDate: { [key: string]: ITransaction[] } = {};
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const dateStr = formatDate(date);

        if (!groupedByDate[dateStr]) {
          groupedByDate[dateStr] = [];
        }
        groupedByDate[dateStr].push(transaction);
      });

      transactionsListByDate.value = groupedByDate;
    })
    .catch((error) => {
      console.error(error);
    });
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const today = new Date();
let tabOptions: { label: string; value: string }[] = [];
for (let i = 0; i < 6; i++) {
  const date = new Date(today);
  date.setMonth(date.getMonth() - i);
  tabOptions.push({
    label: `${months[date.getMonth()]} ${date.getFullYear()}`,
    value: `${date.getFullYear()}-${date.getMonth() + 1}`,
  });
}
tabOptions = tabOptions.reverse();

const tab = ref<string>(tabOptions.at(-1)?.value as string);
function getStartEndDate(tab: string) {
  const [year, month] = tab.split('-');
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0);
  return { startDate, endDate };
}
watch(
  () => tab.value,
  (val) => {
    const { startDate, endDate } = getStartEndDate(val);
    fetchTransactions(
      formatDate(startDate, '-', true),
      formatDate(endDate, '-', true)
    );
  }
);

const dateTotal = ref<number>(0);
const total = ref<number>(0);

const isModalOpen = ref<boolean>(false);
// editing if true, creating if false
const isEditModal = ref<boolean>(false);

const transactionData = ref<ITransaction>();

async function onDeleteTransaction(transaction_id: string) {
  $q.dialog({
    title: 'Delete Transaction',
    message: 'Are you sure you want to delete this transaction?',
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteTransaction(noteId, transaction_id, { jwt_token })
        .then(() => {
          $q.notify({
            position: 'top',
            icon: 'check',
            message: 'Transaction deleted successfully',
            color: 'positive',
          });
          fetchTransactions();
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .onCancel(() => {
      console.log('cancel');
    });
}

function triggerEditTransaction(transaction_id: string) {
  isModalOpen.value = true;
  isEditModal.value = true;

  const targetTransactionData = Object.values(transactionsListByDate.value)
    .flatMap((group) => group)
    .find((transaction) => transaction.id === transaction_id) as ITransaction;

  transactionData.value = targetTransactionData;
}

fetchNoteDetail();
fetchTransactions();
</script>
