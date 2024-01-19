<template>
  <q-page class="q-pa-xl">
    <div class="center-header flex column">
      <h4>Statistics</h4>
    </div>

    <section class="diff-card q-mx-auto">
      <q-card bordered :class="difference > 0 ? 'text-green' : 'text-red'">
        <q-card-section>
          <div class="text-h6">{{ formatCurrency(difference) }}</div>
          <div class="text-subtitle2">
            {{ difference > 0 ? 'Surplus' : 'Deficit' }}
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section horizontal>
          <q-card-section class="full-width text-white bg-green-6">
            <div class="text-h6">{{ formatCurrency(totalIncome) }}</div>
            <div class="text-subtitle2">Income</div>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="full-width text-white bg-red-6">
            <div class="text-h6">{{ formatCurrency(totalExpense) }}</div>
            <div class="text-subtitle2">Expense</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </section>

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
      <h5 class="q-mb-md">Expenditure Breakdown</h5>
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
        <q-linear-progress
          size="25px"
          :value="bar.progress"
          :color="bar.color"
          rounded
        >
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
import { ref } from 'vue';
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
import { formatCurrency } from 'src/utils/formatNumber';
import CardComponent from 'src/components/CardComponent.vue';

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

const totalIncome = computed(() => {
  return incomeStatistics.value?.reduce((acc, cur) => acc + cur.total, 0) ?? 0;
});
const totalExpense = computed(() => {
  return expenseStatistics.value?.reduce((acc, cur) => acc + cur.total, 0) ?? 0;
});
const difference = computed(() => {
  return totalIncome.value - totalExpense.value;
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
        ? `${Math.round(
            (statistic.total / statistic.budget) * 100
          )}% (${formatCurrency(statistic.total)} / ${formatCurrency(
            statistic.budget
          )})`
        : 'No Budget',
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
.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts {
  width: 90%;
  margin: 0 auto;
}

.diff-card {
  width: 40%;
}

@media screen and (max-width: 768px) {
  .diff-card {
    width: 90%;
  }
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
