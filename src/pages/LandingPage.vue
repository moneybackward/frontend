<template>
  <q-page class="q-pa-md">
    <!-- Title Section -->
    <div class="q-mb-md items-center justify-center row">
      <div class="q-mr-md">
        <div class="text-h2 q-mb-md text-weight-bold">Money Management</div>
        <div class="text-h2 q-mb-md text-weight-bold">Made Easy</div>
        <div class="text-h5 q-mb-md text-weight-light">
          Track, Budget, and Save with Our App
        </div>
        <q-btn color="primary" class="q-mr-md" label="Learn More" />
        <q-btn color="secondary" class="q-mr-md" label="Download" />
      </div>
      <q-img
        src="../assets/screenshot/1.svg"
        style="max-width: 400px; height: auto"
      />
    </div>

    <!-- Features Section -->
    <div class="q-mb-md row">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="text-center q-mr-md"
        style="flex: 1"
      >
        <q-avatar>
          <img :src="feature.image" />
        </q-avatar>
        <div class="text-h6">{{ feature.title }}</div>
        <div class="text-weight-light">{{ feature.description }}</div>
      </div>
    </div>

    <!-- Statistics Section -->
    <div class="q-mb-md row">
      <q-card
        v-for="(statistic, index) in statistics"
        :key="index"
        class="text-center q-mr-md q-pr-pd"
        style="flex: 1"
      >
        <q-card-section>
          <div class="text-h6">{{ statistic.label }}</div>
          <div>{{ formatCounter(index) }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- App Screenshots Section -->
    <div class="q-mb-md">
      <div class="text-center q-mr-md" style="flex: 1">
        <div class="text-h5 text-weight-bold q-mt-lg">SCREENSHOT</div>
        <q-img
          v-for="(screenshot, index) in screenshots"
          :key="index"
          :src="screenshot"
          style="max-width: 300px; height: auto; margin-right: 20px"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'MoneyManagementApp',
  data() {
    return {
      features: [
        {
          image: 'https://picsum.photos/200/300',
          title: 'Feature 1',
          description: 'Feature 1 Description',
        },
        {
          image: 'https://picsum.photos/200/300',
          title: 'Feature 2',
          description: 'Feature 2 Description',
        },
        {
          image: 'https://picsum.photos/200/300',
          title: 'Feature 3',
          description: 'Feature 3 Description',
        },
      ],
      statistics: [
        { label: 'Total Downloads', value: 1000, target: 10000 },
        { label: 'Total Reviews', value: 500, target: 5000 },
        { label: 'Active Users', value: 1000, target: 8000 },
      ],
      counterValues: [],
      counters: [],
      screenshots: [
        'src/assets/screenshot/4.svg',
        'src/assets/screenshot/3.svg',
        'src/assets/screenshot/5.svg',
      ],
    };
  },
  mounted() {
    this.initializeCounters();
  },
  methods: {
    initializeCounters() {
      this.statistics.forEach((statistic, index) => {
        this.counterValues[index] = statistic.value;
        const counter = setInterval(() => {
          if (this.counterValues[index] < statistic.target) {
            const increment = Math.ceil(
              (statistic.target - this.counterValues[index]) / 25
            );
            this.counterValues[index] += increment;
          } else {
            clearInterval(this.counters[index]);
          }
        }, 50);
        this.counters[index] = counter;
      });
    },
    // Convert to 'k' format
    formatCounter(index) {
      const value = this.counterValues[index];
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k++`;
      } else {
        return value;
      }
    },
  },
};
</script>
