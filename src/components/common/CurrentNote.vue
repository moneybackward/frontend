<template>
  <section v-if="noteId" class="flex row items-center">
    <span class="text-h6 q-mr-lg">{{ noteDetail?.name }}</span>
    <q-btn
      label="Change Note"
      type="button"
      color="primary"
      icon="library_books"
      @click="$router.push('/app/note')"
    />
  </section>
</template>

<script setup lang="ts">
import { EventBus, useQuasar } from 'quasar';
import { INote, getNoteDetail } from 'src/api/notes';
import { watch } from 'vue';
import { ref } from 'vue';

const $q = useQuasar();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = ref<string>($q.cookies.get('last_opened_note') as string);
import { inject } from 'vue';

const eventBus: EventBus = inject('event-bus') as EventBus;
eventBus.on('note-changed', (newNoteId: string) => {
  noteId.value = newNoteId;
});

const noteDetail = ref<INote>();

function fetchNoteDetail() {
  getNoteDetail({ noteId: noteId.value }, { jwt_token })
    .then((res) => {
      noteDetail.value = res;
    })
    .catch((error) => {
      console.error(error);
    });
}

fetchNoteDetail();
watch(noteId, () => {
  fetchNoteDetail();
});
</script>
