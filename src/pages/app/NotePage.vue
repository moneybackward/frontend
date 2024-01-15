<template>
  <section class="notes-container">
    <q-dialog v-model="createNewModalOpen" persistent>
      <q-card class="modal-card">
        <q-card-section>
          <p class="text-bold">Create a new note</p>
          <q-input
            v-model="newNoteData.name"
            label="Note name"
            filled
            dense
            clearable
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Cancel"
            color="red-4"
            flat
            dense
            @click="toggleCreateModal"
          />
          <q-btn
            label="Create"
            color="primary"
            push
            unelevated
            rounded
            ripple
            dense
            @click="onCreateNote"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Content -->
    <div class="notes-header">
      <h3>Notes</h3>
      <q-btn
        label="+ Create new"
        type="button"
        color="primary"
        @click="toggleCreateModal"
      />
    </div>

    <section name="notes-list" class="notes-list-section">
      <div class="no-notes" v-if="notesList === null || notesList.length === 0">
        <q-item class="centered-item">
          <q-item-section>
            <q-item-label class="text-weight-bold">No notes yet</q-item-label>
          </q-item-section>
        </q-item>
      </div>

      <div v-else>
        <div class="note-card">
          <card-component
            v-for="note in notesList"
            :id="note.id"
            :key="note.id"
            :label="note.name"
            :onOpen="() => openNote(note)"
            :onEdit="editNote"
            :onDelete="deleteNote"
            class="centered-card"
          />
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.notes-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.modal-card {
  max-width: 400px;
  margin: 0 auto;
}

.input-field {
  width: 100%;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notes-list-section {
  margin-bottom: 20px;
}

.centered-card {
  text-align: center;
  margin-bottom: 20px;
  max-width: 300px;
  width: 100%;
  word-wrap: break-word;
  margin-top: 10px;
}

.no-notes {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.note-card {
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { ICreateNote, INote, createNote, getNotesList } from 'src/api/notes';
import CardComponent from 'src/components/CardComponent.vue';

const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;

const createNewModalOpen = ref<boolean>(false);
function toggleCreateModal() {
  createNewModalOpen.value = !createNewModalOpen.value;
}
const notesList = ref<INote[] | null>(null);
async function fetchNotesList() {
  try {
    notesList.value = await getNotesList({ jwt_token });
  } catch (error) {
    console.error(error);
  }
}

// note item actions
const selectedNote = ref<INote | null>(null);

function openNote(note: INote) {
  selectedNote.value = note;

  // saving selected note to cookie
  $q.cookies.set('last_opened_note', selectedNote.value.id.toString(), {
    sameSite: 'Strict',
  });

  $router.push(`/app/note/${selectedNote.value.id}`);
}
function editNote() {
  console.log('edit note');
}
function deleteNote() {
  console.log('delete note');
}

fetchNotesList();

// Create new note
const newNoteData = ref<ICreateNote>({
  name: '',
});

async function onCreateNote() {
  try {
    createNote(newNoteData.value, { jwt_token });
    createNewModalOpen.value = false;
    await fetchNotesList();
  } catch (error) {
    console.error(error);
  }
}
</script>
