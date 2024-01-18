<template>
  <q-page class="transaction-page">
    <!-- Modal -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card>
        <q-card-section class="flex column gap">
          <h5 class="text-bold">
            {{
              isEditModal
                ? `Edit ${transactionData.label}`
                : 'Create a new transaction'
            }}
          </h5>
          <!-- Date Picker -->
          <q-input
            class="fit"
            v-model="dateInput"
            :mask="dateMask"
            id="date-input"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="formattedDate"
                    :mask="dateFormat"
                    v-close-popup="dateClosePopup"
                    @update:model-value="
                      (val: string) => {
                        dateInput = val;
                        newTransactionData.date = new Date(val);
                        dateClosePopup = true;
                      }
                    "
                    no-unset
                    today-btn
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="transactionData.label"
            label="Transaction label"
            filled
            dense
            clearable
          />
          <q-select
            v-model="isExpenseView"
            :options="isExpenseOptions"
            label="Type"
            filled
            dense
          />
          <q-select
            v-model="categoriesView"
            :options="categories"
            label="Category"
            filled
            dense
          />

          <q-input
            v-model.number="transactionData.amount"
            :rules="[(val) => val > 0 || 'Amount must be greater than 0']"
            class="hide-spin-button"
            type="number"
            label="Amount"
            filled
            dense
            clearable
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            color="red-4"
            flat
            dense
            @click="isModalOpen = false"
          />
          <q-btn
            :label="isEditModal ? 'Edit' : 'Create'"
            color="primary"
            push
            unelevated
            rounded
            ripple
            dense
            @click="isEditModal ? onEditTransaction() : onCreateTransaction()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <section class="content">
      <div class="transaction-header">
        <h3>{{ noteDetail?.name }} | Transaction</h3>
      </div>

      <q-toolbar class="transaction-toolbar">
        <q-input
          filled
          v-model="dateFilterStr"
          mask="date"
          :rules="['date']"
          class="date-filter-input"
          color="teal"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
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
      </q-toolbar>

      <div class="button-group">
        <q-btn
          label="+ Create new"
          type="button"
          color="primary"
          @click="
            () => {
              isModalOpen = true;
              isEditModal = false;
              transactionData = newTransactionData;
            }
          "
          class="create-new-btn"
        />
        <q-btn
          label="Categories"
          type="button"
          color="primary"
          @click="$router.push(`/app/note/${noteId}/category`)"
          class="categories-btn"
        />
      </div>

      <section name="transactions" class="transactions-section">
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
      </section>

      <section name="totals" class="totals-section">
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

.transaction-header {
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
  width: 100%;
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
}

@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}

.gap {
  gap: 1rem;
}

.hide-spin-button :deep(input[type='number']) {
  -moz-appearance: textfield;
}
.hide-spin-button :deep(input::-webkit-outer-spin-button),
.hide-spin-button :deep(input::-webkit-inner-spin-button) {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>

<script setup lang="ts">
import { useMeta, useQuasar } from 'quasar';
import { getCategoriesList } from 'src/api/categories';
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  getTransactionsList,
  ICreateTransaction,
  ITransaction,
  IUpdateTransaction,
} from 'src/api/transactions';
import TransactionItem from 'src/components/TransactionItem.vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IExpenseOptions } from './CategoryPage.vue';
import { ILabelValue } from 'src/models/IBase';
import { formatDate } from 'src/utils/formatDate';
import { formatCurrency } from 'src/utils/formatNumber';
import { getNoteDetail, INote } from 'src/api/notes';

// get note id from route params
const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $router.currentRoute.value.params.id as string;

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
function fetchTransactions() {
  getTransactionsList({ noteId }, { jwt_token })
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

const currDate = new Date();
const dateFilterStr = ref(currDate.toISOString());
const dateTransactions = ref<ITransaction[]>([]);
const dateTotal = ref<number>(0);
const total = ref<number>(0);

function filterTransactions() {
  if (!transactionsListByDate.value) return;

  const dateFilter = new Date(dateFilterStr.value);
  dateFilter.setHours(0, 0, 0, 0);

  dateTransactions.value = transactionsListByDate.value[formatDate(dateFilter)];
  if (!dateTransactions.value) return;

  const dateTotalIncome = dateTransactions.value
    .filter((t) => !t.is_expense)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const dateTotalExpense = dateTransactions.value
    .filter((t) => t.is_expense)
    .reduce((acc, curr) => acc + curr.amount, 0);
  dateTotal.value = dateTotalIncome - dateTotalExpense;
  total.value = dateTotal.value;
}

// Create new transaction
const dateFormat = 'YYYY-MM-DD';
const dateMask = dateFormat.replace(/[DMY]/g, '#');
const dateClosePopup = ref<boolean>(false);

const isModalOpen = ref<boolean>(false);
// editing if true, creating if false
const isEditModal = ref<boolean>(false);

const newTransactionData = ref<ICreateTransaction>({
  amount: 0,
  category_id: '',
  date: new Date(),
  is_expense: false,
  label: '',
});
const editTransactionData = ref<IUpdateTransaction>({
  id: '',
  amount: 0,
  category_id: '',
  date: new Date(),
  is_expense: false,
  label: '',
});
const transactionData = ref<ICreateTransaction | IUpdateTransaction>({
  amount: 0,
  category_id: '',
  date: new Date(),
  is_expense: false,
  label: '',
});

const dateInput = ref<string>('');
const formattedDate = ref<string>('');
const isExpenseOptions = ref<IExpenseOptions[]>([
  {
    label: 'Income',
    value: false,
  },
  {
    label: 'Expense',
    value: true,
  },
]);
const isExpenseView = ref<IExpenseOptions | undefined>(
  isExpenseOptions.value[0]
);
const categoriesView = ref<ILabelValue>();
const categories = ref<ILabelValue[]>([]);

async function fetchCategories() {
  const isExpense = newTransactionData.value.is_expense;
  try {
    const categoriesList = await getCategoriesList(
      { noteId, isExpense },
      { jwt_token }
    );
    categories.value = categoriesList.map((c) => ({
      label: c.name,
      value: c.id,
    }));
  } catch (error) {
    console.error(error);
  }
}

function onCreateTransaction() {
  createTransaction(noteId, newTransactionData.value, { jwt_token })
    .then(() => {
      $q.notify({
        position: 'top',
        icon: 'check',
        message: 'Transaction created successfully',
        color: 'positive',
      });
      isModalOpen.value = false;
      fetchTransactions();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function onEditTransaction() {
  try {
    await editTransaction(noteId, editTransactionData.value, { jwt_token });
    $q.notify({
      position: 'top',
      icon: 'check',
      message: 'Transaction edited successfully',
      color: 'positive',
    });
    isModalOpen.value = false;
    fetchTransactions();
  } catch (error) {
    console.error(error);
  }
}

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

  editTransactionData.value = targetTransactionData;
  transactionData.value = editTransactionData.value;
  isExpenseView.value = isExpenseOptions.value.find(
    (option) => option.value === editTransactionData.value.is_expense
  );

  // find the category that has the same id as the selected category
  if (isEditModal.value) {
    categoriesView.value = categories.value.find(
      (category) => category.value === editTransactionData.value.category_id
    );
  }
}

watch(
  () => isExpenseView.value,
  async (val) => {
    if (!val) return;

    newTransactionData.value.is_expense = val.value;
    editTransactionData.value.is_expense = val.value;
    await fetchCategories();

    // set default category once isExpenseView is changed
    categoriesView.value = categories.value[0];
    newTransactionData.value.category_id = categoriesView.value.value;
    editTransactionData.value.category_id = categoriesView.value.value;
  }
);

watch(
  () => categoriesView.value,
  (val) => {
    if (!val) return;
    newTransactionData.value.category_id = val.value;
    editTransactionData.value.category_id = val.value;
  }
);

fetchNoteDetail();
await fetchCategories();
fetchTransactions();
filterTransactions();
</script>
