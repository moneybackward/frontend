<template>
  <q-page>
    <!-- Modal -->
    <p>a</p>
    <q-dialog v-model="createNewModalOpen" persistent>
      <q-card>
        <q-card-section>
          <h5 class="text-bold">Create a new note</h5>
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
            v-model="newTransactionData.label"
            label="Transaction label"
            filled
            dense
            clearable
          />
          <!-- Category Selection -->
          <q-select
            v-model="newTransactionData.category_id"
            :options="categories"
            label="Category"
            filled
            dense
            clearable
          />

          <!-- Amount Input -->
          <q-input
            v-model="newTransactionData.amount"
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
            @click="toggleCreateModal"
          />
          <q-btn
            label="Create"
            color="primary"
            push
            unelevated
            rounded
            ripple
            dense
            @click="onCreateTransaction"
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
        @click="toggleCreateModal"
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
import { watch } from 'fs';
import { useQuasar } from 'quasar';
import {
  createTransaction,
  getCategories,
  getTransactionsList,
  ICreateTransaction,
  ITransaction,
} from 'src/api/transactions';
import TransactionItem from 'src/components/TransactionItem.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// get note id from route params
const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $router.currentRoute.value.params.id as string;

const transactionsList = ref<ITransaction[] | null>(null);
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

const createNewModalOpen = ref<boolean>(false);
function toggleCreateModal() {
  createNewModalOpen.value = !createNewModalOpen.value;
}

const newTransactionData = ref<ICreateTransaction>({
  amount: 0,
  category_id: '',
  date: new Date(),
  is_expense: false,
  label: '',
});
const dateInput = ref<string>('');
const formattedDate = ref<string>('');
const categories = ref<
  {
    label: string;
    value: string;
  }[]
>([]);

function fetchCategories() {
  getCategories({ noteId }, { jwt_token })
    .then((res) => {
      categories.value = res.map((c) => ({
        label: c.name,
        value: c.id,
      }));
    })
    .catch((error) => {
      console.error(error);
    });
}

function onCreateTransaction() {
  createTransaction(newTransactionData.value, { jwt_token })
    .then(() => {
      createNewModalOpen.value = false;
      fetchTransactions();
    })
    .catch((error) => {
      console.error(error);
    });
}

fetchCategories();
fetchTransactions();
filterTransactions();
</script>
