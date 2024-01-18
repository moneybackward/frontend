<template>
  <q-item
    class="q-mb-md full-width card-item"
    :class="props.bgClassName ?? ''"
    :style="{ 'background-color': props.bgColor ?? 'white' }"
  >
    <section class="full-width rounded-borders card-item-content q-pa-sm flex">
      <q-item-section @click="openNote" clickable v-ripple>
        <q-item-section>
          <q-item-label v-if="label !== null" class="text-h6">
            {{ label }}
          </q-item-label>
          <q-item-label v-else>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label caption v-if="sublabel !== null">
            {{ sublabel }}
          </q-item-label>
        </q-item-section>
      </q-item-section>
      <q-item-section side class="row" v-if="label !== null">
        <q-btn
          flat
          round
          dense
          icon="edit"
          @click="editNote"
          class="q-mr-sm text-warning"
        />
        <q-btn
          flat
          round
          dense
          icon="delete"
          @click="deleteNote"
          class="q-mr-sm text-negative"
        />
      </q-item-section>
      <q-item-section side class="row" v-else>
        <q-skeleton type="circle" size="2rem" />
        <q-skeleton type="circle" size="2rem" />
      </q-item-section>
    </section>
  </q-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: string;
  label?: string;
  sublabel?: string;
  bgClassName?: string;
  bgColor?: string;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}>();

function openNote() {
  if (props.onOpen) props.onOpen();
}

function editNote() {
  if (props.onEdit) props.onEdit();
}

function deleteNote() {
  if (props.onDelete) props.onDelete();
}
</script>

<style scoped>
.card-item {
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: background-color 0.3s;
  margin-bottom: 15px;
  cursor: pointer;
}

.card-item:hover {
  background-color: #f5f5f5;
}

.card-item-content {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
