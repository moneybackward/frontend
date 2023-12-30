<template>
  <q-page>
    <!-- Modal -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card>
        <q-card-section>
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
                      (val) => {
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
          <!-- Label Input -->
          <q-input
            v-model="transactionData.label"
            label="Transaction label"
            filled
            dense
            clearable
          />
          <!-- Transaction Type Selection -->
          <q-select
            v-model="isExpenseView"
            :options="isExpenseOptions"
            label="Type"
            filled
            dense
          />
          <!-- Category Selection -->
          <q-select
            v-model="categoriesView"
            :options="categories"
            label="Category"
            filled
            dense
            clearable
          />

          <!-- Amount Input -->
          <q-input
            v-model.number="transactionData.amount"
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
            label="Create"
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

    <!-- Content -->
    <h3>Transactions</h3>
    <div class="">
      <q-btn
        label="+ Create new"
        type="button"
        color="primary"
        @click="
          isModalOpen = true;
          isEditModal = false;
          transactionData = newTransactionData;
        "
      />

      <q-btn
        label="Categories"
        type="button"
        color="primary"
        @click="$router.push(`/app/note/${noteId}/category`)"
      />
    </div>
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
        v-for="transaction in transactionsList"
        :key="transaction.label"
        :data="transaction"
        :on-edit="() => triggerEditTransaction(transaction.id)"
        :on-delete="() => onDeleteTransaction(transaction.id)"
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
import { useQuasar } from 'quasar';
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

// get note id from route params
const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $router.currentRoute.value.params.id as string;

const transactionsList = ref<ITransaction[]>([]);
function fetchTransactions() {
  getTransactionsList({ noteId }, { jwt_token })
    .then((res) => {
      transactionsList.value = res;
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
  if (!transactionsList.value) return;

  dateTransactions.value = transactionsList.value.filter((t) => {
    const dateFilter = new Date(dateFilterStr.value);
    dateFilter.setHours(0, 0, 0, 0);
    t.date.setHours(0, 0, 0, 0);
    return t.date.valueOf() == dateFilter.valueOf();
  });
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
const dateFormat = 'DD/MM/YYYY';
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
    isModalOpen.value = false;
    fetchTransactions();
  } catch (error) {
    console.error(error);
  }
}

async function onDeleteTransaction(transaction_id: string) {
  try {
    await deleteTransaction(noteId, transaction_id, { jwt_token });
    fetchTransactions();
  } catch (error) {
    console.error(error);
  }
}

function triggerEditTransaction(transaction_id: string) {
  isModalOpen.value = true;
  isEditModal.value = true;

  editTransactionData.value = transactionsList.value.find(
    (transaction) => transaction.id === transaction_id
  ) as ITransaction;

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

await fetchCategories();
fetchTransactions();
filterTransactions();
</script>
