<template>
  <q-page>
    <!-- Modal -->
    <q-dialog v-model="createNewModalOpen" persistent>
      <q-card>
        <q-card-section>
          <h5 class="text-bold">Create a new category</h5>
          <!-- Category Type Selection -->
          <q-select
            v-model="isExpenseView"
            :options="isExpenseOptions"
            label="Type"
            filled
            dense
          />

          <!-- Label Input -->
          <q-input
            v-model="newCategoryData.name"
            label="Category name"
            filled
            dense
            clearable
          />

          <!-- Budget Input -->
          <q-input
            v-if="isExpenseView.value"
            v-model="newCategoryData.budget"
            label="Budget"
            type="number"
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
            @click="onCreateCategory"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Content -->
    <h3>{{ noteDetail?.name }} | Categories</h3>
    <div class="">
      <q-btn
        label="+ Create new"
        type="button"
        color="primary"
        @click="toggleCreateModal"
      />
    </div>

    <section name="categories-list">
      <div class="">
        <q-list bordered v-if="categoriesList.length > 0">
          <note-card-component
            v-for="category in categoriesList"
            :label="category.name"
            :key="category.id"
            :onEditNote="editNote"
            :onDeleteNote="deleteNote"
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
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import {
  ICategory,
  getCategoriesList,
  createCategory,
  ICreateCategory,
} from 'src/api/categories';
import NoteCardComponent from 'src/components/NoteCardComponent.vue';
import { INote, getNoteDetail } from 'src/api/notes';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $router.currentRoute.value.params.id as string;

const noteDetail = ref<INote>();

function fetchNoteDetail() {
  getNoteDetail({ noteId }, { jwt_token })
    .then((res) => {
      noteDetail.value = res;
    })
    .catch((error) => {
      console.error(error);
    });
}

const newCategoryData = ref<ICreateCategory>({
  name: '',
  budget: 0,
  priority: 0,
  is_expense: true,
});

const categoriesList = ref<ICategory[]>([]);
function fetchCategories() {
  getCategoriesList({ noteId }, { jwt_token })
    .then((res) => {
      categoriesList.value = res;
    })
    .catch((error) => {
      console.error(error);
    });
}

function editNote() {
  console.log('edit note');
}
function deleteNote() {
  console.log('delete note');
}

const createNewModalOpen = ref<boolean>(false);
function toggleCreateModal() {
  createNewModalOpen.value = !createNewModalOpen.value;
}

const isExpenseOptions = ref<
  {
    label: string;
    value: boolean;
  }[]
>([
  {
    label: 'Income',
    value: false,
  },
  {
    label: 'Expense',
    value: true,
  },
]);

export interface IExpenseOptions {
  label: string;
  value: boolean;
}
const isExpenseView = ref<IExpenseOptions>(isExpenseOptions.value[0]);
watch(
  () => isExpenseView.value,
  (val) => {
    newCategoryData.value.is_expense = val.value;
  }
);

function onCreateCategory() {
  createCategory(newCategoryData.value, noteId, { jwt_token })
    .then(() => {
      createNewModalOpen.value = false;
      fetchCategories();
    })
    .catch((error) => {
      console.error(error);
    });
}

fetchNoteDetail();
fetchCategories();
</script>
