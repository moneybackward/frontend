<template>
  <q-item class="q-mb-md bg-grey-2" style="max-width: 400px">
    <q-item-section @click="openNote" clickable v-ripple>
      <q-item-label v-if="note">{{ note.name }}</q-item-label>
      <q-item-label v-else>
        <q-skeleton type="text" />
      </q-item-label>
    </q-item-section>
    <q-item-section side class="row" v-if="note">
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
import { INote } from 'src/api/notes';

const props = defineProps<{
  note?: INote;
  onOpenNote?: () => void;
  onEditNote?: () => void;
  onDeleteNote?: () => void;
}>();

function openNote() {
  if (props.onOpenNote) {
    props.onOpenNote();
  }
}

function editNote() {
  if (props.onEditNote) {
    props.onEditNote();
  }
}

function deleteNote() {
  if (props.onDeleteNote) {
    props.onDeleteNote();
  }
}
</script>
