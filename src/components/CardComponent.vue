<template>
  <q-item
    class="q-mb-md full-width"
    :class="props.bgClassName ?? ''"
    :style="{ 'background-color': props.bgColor ?? 'white' }"
  >
    <q-item-section @click="openNote" clickable v-ripple>
      <q-item-section>
        <q-item-label v-if="label !== null">
          {{ label }}
        </q-item-label>
        <q-item-label v-else>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label caption v-if="sublabel !== null">{{
          sublabel
        }}</q-item-label>
      </q-item-section>
    </q-item-section>
    <q-item-section side class="row" v-if="label !== null">
      <q-btn flat round dense icon="edit" @click="editNote" class="q-mr-sm" />
      <q-btn
        flat
        round
        dense
        icon="delete"
        @click="deleteNote"
        class="q-mr-sm"
      />
    </q-item-section>
    <q-item-section side class="row" v-else>
      <q-skeleton type="circle" size="2rem" />
      <q-skeleton type="circle" size="2rem" />
    </q-item-section>
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
