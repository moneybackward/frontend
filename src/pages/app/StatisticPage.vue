<template>
  <q-page class="q-px-xl flex-gap-1">
    <div class="center-header flex column">
      <h4>Statistics</h4>
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

    <section class="diff-card q-mx-auto">
      <q-card
        bordered
        class="fit"
        :class="difference > 0 ? 'text-green' : 'text-red'"
      >
        <q-card-section class="fit">
          <div class="text-h6">{{ formatCurrency(difference) }}</div>
          <div class="text-subtitle2">
            {{ difference > 0 ? 'Surplus' : 'Deficit' }}
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section horizontal class="flex row fit">
          <q-card-section class="text-white bg-primary fit">
            <div class="sub-card-title">{{ formatCurrency(totalIncome) }}</div>
            <div class="text-subtitle2">Income</div>
          </q-card-section>
          <q-separator vertical />
          <q-card-section class="text-white bg-accent fit">
            <div class="sub-card-title">{{ formatCurrency(totalExpense) }}</div>
            <div class="text-subtitle2">Expense</div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </section>

    <section class="charts row q-mt-md q-mx-auto">
      <div class="graph col-5">
        <Doughnut
          v-if="incomeData"
          id="income-transactions-chart"
          :data="incomeData"
          :options="incomeOptions"
        />
      </div>
      <div class="graph col-5">
        <Doughnut
          v-if="expenseData"
          id="expense-transactions-chart"
          :data="expenseData"
          :options="expenseOptions"
        />
      </div>
    </section>

    <section class="budget-charts q-my-xl q-mt-xl q-mx-auto">
      <div class="q-mb-md text-h6">Expenditure Breakdown</div>
      <section class="expense-bar">
        <q-card
          flat
          bordered
          v-for="bar in expenseBars"
          :key="bar.categoryName"
          class="my-card bg-secondary q-mx-auto"
        >
          <q-card-section>
            <div class="text-h6">{{ bar.categoryName }}</div>
          </q-card-section>

          <q-card-section>
            <q-linear-progress
              size="2rem"
              :value="bar.progress"
              :color="bar.color"
              rounded
            >
              <div class="absolute-full flex flex-center col">
                <q-badge
                  :label="bar.label"
                  text-color="white"
                  color="transparent"
                  class="text-subtitle2"
                  rounded
                />
              </div>
            </q-linear-progress>
          </q-card-section>
        </q-card>
      </section>
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
import { formatCurrency } from 'src/utils/formatNumber';
import { formatDate, getStartEndDate, months } from 'src/utils/formatDate';

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
watch(
  () => tab.value,
  (val) => {
    const { startDate, endDate } = getStartEndDate(val);
    fetchStatistics(
      formatDate(startDate, '-', true),
      formatDate(endDate, '-', true)
    );
  }
);

const date = new Date();
const dateFilter = ref<{
  start: string;
  end: string;
}>({
  start: formatDate(
    new Date(date.getFullYear(), date.getMonth(), 1),
    '-',
    true
  ),
  end: formatDate(
    new Date(date.getFullYear(), date.getMonth() + 1, 0),
    '-',
    true
  ),
});

const statistics = ref<ICategoryStatistic[] | null>(null);
async function fetchStatistics(dateStart?: string, dateEnd?: string) {
  try {
    // must have noteId
    if (!lastOpenedNote) {
      console.warn("No note opened, can't fetch statistics");
      return;
    }

    statistics.value = await getStatistics(
      lastOpenedNote,
      { jwt_token },
      {
        dateFilter: {
          start: dateStart,
          end: dateEnd,
        },
      }
    );
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
  if (percentage < 0.5) return 'light-green';
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
.flex-gap-1 {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.charts {
  width: fit-content;
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
}

.budget-charts {
  max-width: 45rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.expense-bar {
  display: flex;
  width: auto;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.my-card {
  width: 20rem;
  height: 8rem;
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

.sub-card-title {
  font-size: 14px;
  font-weight: bold;
}

@media screen and (max-width: 576px) {
  .sub-card-title {
    font-size: 12px;
  }
}
</style>
