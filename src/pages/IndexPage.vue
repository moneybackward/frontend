<template>
  <q-page class="flex column">
    <q-input
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      class="q-ma-md"
      color="teal"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>

    <!-- Pengeluaran X -->
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Gaji</q-item-label>
        <q-item-label caption> Gaji untuk bulan September </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label class="text-green">58.600.000</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Nasi goreng</q-item-label>
        <q-item-label caption> Beli makanan hari ini </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item-label class="text-red">15.000</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Total Harian</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label class="text-black">58.585.000</q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold">Total Tabungan</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label class="text-black">550.585.000</q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
});
</script>
