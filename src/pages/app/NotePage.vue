<template>
  <section>
    <!-- Modal -->
    <q-dialog v-model="createNewModalOpen" persistent>
      <q-card>
        <q-card-section>
          <q-card-title>Create new note</q-card-title>
        </q-card-section>
        <q-card-section>
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
    <h3>Notes</h3>
    <div class="">
      <q-btn
        label="+ Create new"
        type="button"
        color="primary"
        @click="toggleCreateModal"
      />
    </div>

    <section name="notes-list">
      <div class="" v-if="notesList === null">
        <q-list bordered>
          <note-card-component />
        </q-list>
      </div>

      <div class="" v-else>
        <q-list bordered v-if="notesList.length > 0">
          <note-card-component
            v-for="note in notesList"
            :key="note.id"
            :note="note"
            @onOpenNote="openNote"
            @onEditNote="editNote"
            @onDeleteNote="deleteNote"
          />
        </q-list>

        <div class="" v-else>
          <q-item>
            <q-item-section>
              <q-item-label>No notes yet</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ICreateNote, INote, createNote } from 'src/api/notes';
import { getNotesList } from 'src/api/notes';
import { useQuasar } from 'quasar';
import NoteCardComponent from 'src/components/NoteCardComponent.vue';

const $q = useQuasar();
const jwt_token = $q.cookies.get('jwt_token') || undefined;

const createNewModalOpen = ref<boolean>(false);
function toggleCreateModal() {
  createNewModalOpen.value = !createNewModalOpen.value;
}
const notesList = ref<INote[] | null>(null);
async function fetchNotesList() {
  try {
    notesList.value = await getNotesList({ jwt_token });
    console.log(notesList.value);
  } catch (error) {
    console.error(error);
  }
}

function openNote() {
  console.log('open note');
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

function onCreateNote() {
  try {
    createNote(newNoteData.value, { jwt_token });
    createNewModalOpen.value = false;
    fetchNotesList();
  } catch (error) {
    console.error(error);
  }
}
</script>
