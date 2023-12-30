<template>
  <q-page>
    <!-- Modal -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card>
        <q-card-section>
          <h5 class="text-bold">
            {{
              isEditModal
                ? `Edit ${categoryData.name}`
                : 'Create a new category'
            }}
          </h5>
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
            v-model="categoryData.name"
            label="Category name"
            filled
            dense
            clearable
          />

          <!-- Budget Input -->
          <q-input
            v-if="isExpenseView.value"
            v-model="categoryData.budget"
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
            @click="isModalOpen = false"
          />
          <q-btn
            label="Create"
            color="primary"
            push
            unelevated
            rounded
            ripple
            dense
            @click="isEditModal ? onEditCategory() : onCreateCategory()"
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
        @click="
          isModalOpen = true;
          isEditModal = false;
          categoryData = newCategoryData;
        "
      />
    </div>

    <section name="categories-list">
      <div class="">
        <q-list bordered v-if="categoriesList.length > 0">
          <card-component
            v-for="category in categoriesList"
            :bgClassName="category.is_expense ? 'bg-red-4' : 'bg-green-4'"
            :label="category.name"
            :key="category.id"
            :id="category.id"
            :on-edit="() => triggerEditCategory(category.id)"
            :on-delete="() => onDeleteCategory(category.id)"
          />
        </q-list>

        <div class="" v-else>
          <q-item>
            <q-item-section>
              <q-item-label>No categories yet</q-item-label>
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
  editCategory,
  IUpdateCategory,
  deleteCategory,
} from 'src/api/categories';
import CardComponent from 'src/components/CardComponent.vue';
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
  budget: undefined,
  priority: 0,
  is_expense: true,
});
const editCategoryData = ref<IUpdateCategory>({
  id: '',
  name: '',
  budget: undefined,
  priority: 0,
  is_expense: true,
});
const categoryData = ref<ICreateCategory | IUpdateCategory>({
  name: '',
  budget: undefined,
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

function triggerEditCategory(category_id: string) {
  isModalOpen.value = true;
  isEditModal.value = true;
  editCategoryData.value = categoriesList.value.find(
    (category) => category.id === category_id
  ) as ICategory;
  console.log(editCategoryData.value);
  categoryData.value = editCategoryData.value;
}

const isModalOpen = ref<boolean>(false);
// editing if true, creating if false
const isEditModal = ref<boolean>(false);

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
const isExpenseView = ref<IExpenseOptions>(
  editCategoryData.value.is_expense
    ? isExpenseOptions.value[1]
    : isExpenseOptions.value[0]
);
watch(
  () => isExpenseView.value,
  (val) => {
    newCategoryData.value.is_expense = val.value;
    editCategoryData.value.is_expense = val.value;
  }
);

function onCreateCategory() {
  createCategory(noteId, newCategoryData.value, { jwt_token })
    .then(() => {
      isModalOpen.value = false;
      fetchCategories();
    })
    .catch((error) => {
      console.error(error);
    });
}

function onEditCategory() {
  editCategory(noteId, editCategoryData.value, { jwt_token })
    .then(() => {
      isModalOpen.value = false;
      fetchCategories();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function onDeleteCategory(category_id: string) {
  try {
    await deleteCategory(noteId, category_id, { jwt_token });
    fetchCategories();
  } catch (error) {
    console.error(error);
  }
}

fetchNoteDetail();
fetchCategories();
</script>
