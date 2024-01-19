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
import { useQuasar } from 'quasar';
import { INote, getNoteDetail } from 'src/api/notes';
import { computed, watch } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = computed(() => $router.currentRoute.value.params.id as string);

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

watch(noteId, () => {
  fetchNoteDetail();
});
</script>
