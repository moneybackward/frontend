<template>
  <q-page class="q-my-xl">
    <q-toolbar class="q-pa-md">
      <q-btn
        flat
        round
        dense
        icon="fa-solid fa-arrow-left"
        @click="$router.back()"
      />
      <q-toolbar-title class="statistics-title">STATISTICS</q-toolbar-title>
    </q-toolbar>

    <section class="charts row full-width q-mt-md">
      <div class="graph col-5 q-pa-md">
        <Doughnut
          v-if="incomeData"
          id="income-transactions-chart"
          :data="incomeData"
          :options="incomeOptions"
        />
      </div>
      <div class="graph col-5 q-pa-md">
        <Doughnut
          v-if="expenseData"
          id="expense-transactions-chart"
          :data="expenseData"
          :options="expenseOptions"
        />
      </div>
    </section>

    <section class="budget-charts q-m-xl">
      <h5 class="q-mb-md">Expenses Progress</h5>
      <div
        v-for="bar in expenseBars"
        :key="bar.categoryName"
        class="expense-bar q-mb-md"
      >
        <q-badge
          :label="bar.categoryName"
          :text-color="bar.color"
          color="transparent"
        />
        <q-linear-progress size="25px" :value="bar.progress" :color="bar.color">
          <div class="absolute-full flex flex-center col">
            <q-badge
              :label="bar.label"
              text-color="white"
              :color="bar.color"
              rounded
            />
          </div>
        </q-linear-progress>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMeta, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ICategoryStatistic, getStatistics } from 'src/api/categories';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
import { computed } from 'vue';

const $q = useQuasar();
const $router = useRouter();
const lastOpenedNote = $q.cookies.get('last_opened_note');
if (!lastOpenedNote) {
  // no note opened, redirect to note page
  $q.notify({
    message: 'No note opened, redirecting to note page',
    position: 'top',
    type: 'negative',
  });
  $router.push('/app/note');
}

useMeta({
  title: 'Statistics | Money Backward',
});

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const jwt_token = $q.cookies.get('jwt_token') || undefined;

const statistics = ref<ICategoryStatistic[] | null>(null);
async function fetchStatistics() {
  try {
    // must have noteId
    if (!lastOpenedNote) {
      console.warn("No note opened, can't fetch statistics");
      return;
    }

    statistics.value = await getStatistics(lastOpenedNote, { jwt_token });
  } catch (error) {
    console.error(error);
  }
}

fetchStatistics();

const incomeStatistics = computed(() => {
  return statistics.value?.filter((statistic) => !statistic.is_expense);
});
const expenseStatistics = computed(() => {
  return statistics.value?.filter((statistic) => statistic.is_expense);
});

const incomeTransactions = computed(() => {
  return incomeStatistics.value?.map((statistic) => {
    return {
      color: statistic.color,
      name: statistic.name,
      total: statistic.total,
    };
  });
});
const expenseTransactions = computed(() => {
  return expenseStatistics.value?.map((statistic) => {
    return {
      color: statistic.color,
      name: statistic.name,
      total: statistic.total,
    };
  });
});

function toQuasarColors(percentage: number) {
  if (percentage < 0.25) return 'positive';
  if (percentage < 0.5) return 'secondary';
  if (percentage < 0.75) return 'warning';
  if (percentage < 0.75) return 'deep-orange';
  if (percentage < 0.9) return 'negative';
  return 'red';
}

const expenseBars = computed(() => {
  return expenseStatistics.value?.map((statistic) => {
    return {
      categoryName: statistic.name,
      label: statistic.budget
        ? `${Math.round((statistic.total / statistic.budget) * 100)}% (${
            statistic.total
          } / ${statistic.budget})`
        : '',
      progress: statistic.budget ? statistic.total / statistic.budget : 1,
      color: toQuasarColors(
        statistic.budget ? statistic.total / statistic.budget : 1
      ),
    };
  });
});

const expenseData = computed<any>(() => {
  return {
    labels:
      expenseTransactions.value?.map((transaction) => transaction.name) ?? [],
    datasets: [
      {
        label: 'Expense Transactions',
        data:
          expenseTransactions.value?.map((transaction) => transaction.total) ??
          [],
        backgroundColor: expenseTransactions.value?.map(
          (transaction) => transaction.color
        ),
      },
    ],
  };
});

const incomeData = computed<any>(() => {
  return {
    labels:
      incomeTransactions.value?.map((transaction) => transaction.name) ?? [],
    datasets: [
      {
        label: 'Income Transactions',
        data:
          incomeTransactions.value?.map((transaction) => transaction.total) ??
          [],
        backgroundColor: incomeTransactions.value?.map(
          (transaction) => transaction.color
        ),
      },
    ],
  };
});

const incomeOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Income Transactions',
    },
  },
};

const expenseOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Expense Transactions',
    },
  },
};
</script>

<style scoped>
.charts {
  width: 90%;
  margin: 0 auto;
}

.graph {
  width: 100%;
  max-width: 20rem;
  margin: 0 auto;
}

.budget-charts {
  width: 80%;
  max-width: 50rem;
  margin: 0 auto;
}

.expense-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.q-mt-md {
  margin-top: 20px;
}

.q-pa-md {
  padding: 20px;
  text-align: center;
}

.q-mb-md {
  margin-bottom: 20px;
}

.statistics-title {
  font-size: 24px;
  font-weight: bold;
}
</style>
