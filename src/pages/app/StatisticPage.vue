<template>
  <q-page>
    <q-toolbar>
      <q-btn
        flat
        round
        dense
        icon="fa-solid fa-arrow-left"
        @click="$router.back()"
      />
      <q-toolbar-title>Statistics</q-toolbar-title>
    </q-toolbar>

    <q-list bordered>
      <!-- TODO: use graphs (pie chart) -->
      <q-item>
        <q-item-section>
          <q-item-label header>Category</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label header>Amount / Budget</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label header>Count</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-for="statistic in statistics"
        :key="statistic.id"
        :class="statistic.is_expense ? 'text-red' : 'text-green'"
      >
        <q-item-section>
          <q-item-label>{{ statistic.name }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ statistic.total }}
            <span v-if="statistic.is_expense && statistic.budget">
              / {{ statistic.budget }}
            </span>
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ statistic.count }}</q-item-label>
        </q-item-section>
      </q-item>

      <!-- Aggregates -->
      <q-item>
        <q-item-section>
          <q-item-label header>Total</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label header>
            {{ statistics?.reduce((acc, cur) => acc + cur.total, 0) }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label header>
            {{ statistics?.reduce((acc, cur) => acc + cur.count, 0) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ICategoryStatistic, getStatistics } from 'src/api/categories';

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
</script>
