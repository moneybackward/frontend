<template>
  <q-page class="q-mx-md">
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
            v-model.number="categoryData.budget"
            label="Budget"
            type="number"
            class="hide-spin-button"
            filled
            dense
            clearable
          />

          <q-input filled v-model="categoryData.color" class="my-input">
            <template v-slot:append>
              <span
                :style="{
                  'background-color': categoryData.color,
                  width: 'auto',
                  height: '100%',
                  aspectRatio: '1/1',
                }"
              ></span>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-color
                    no-header-tabs
                    no-footer
                    :model-value="categoryData.color"
                    @change="
                      (val) => {
                        categoryData.color = val;
                      }
                    "
                    style="max-width: 250px"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:hint> Field hint </template>
          </q-input>
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
            :label="isEditModal ? 'Edit' : 'Create'"
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
    <section class="content">
      <div class="transaction-header">
        <h4>Categories</h4>
      </div>
      <div class="">
        <q-btn
          label="+ Create new"
          type="button"
          color="primary"
          @click="
            () => {
              isModalOpen = true;
              isEditModal = false;
              categoryData = newCategoryData;
            }
          "
        />
      </div>

      <section name="categories-list" class="full-width q-my-xl">
        <div class="">
          <q-list v-if="categoriesList.length > 0">
            <card-component
              v-for="category in categoriesList"
              :bg-color="category.color"
              :label="category.name"
              :sublabel="category.is_expense ? 'Expense' : 'Income'"
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
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { useMeta, useQuasar } from 'quasar';
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
import { generateRandomColorHex } from 'src/utils/color';

const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $router.currentRoute.value.params.id as string;

useMeta({
  title: 'Category | Money Backward',
});

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
  color: generateRandomColorHex(),
});
const editCategoryData = ref<IUpdateCategory>({
  id: '',
  name: '',
  budget: undefined,
  priority: 0,
  is_expense: true,
  color: generateRandomColorHex(),
});
const categoryData = ref<ICreateCategory | IUpdateCategory>({
  name: '',
  budget: undefined,
  priority: 0,
  is_expense: true,
  color: generateRandomColorHex(),
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
    categoryData.value.is_expense = val.value;

    if (isEditModal.value) {
      editCategoryData.value.is_expense = val.value;
    } else {
      newCategoryData.value.is_expense = val.value;
    }
  }
);

watch(
  () => categoryData.value.is_expense,
  (val) => {
    isExpenseView.value = val
      ? isExpenseOptions.value[1]
      : isExpenseOptions.value[0];
  }
);

function onCreateCategory() {
  createCategory(noteId, newCategoryData.value, { jwt_token })
    .then(() => {
      $q.notify({
        position: 'top',
        message: 'Category created',
        color: 'positive',
        icon: 'check',
      });
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
      $q.notify({
        position: 'top',
        message: 'Category edited',
        color: 'positive',
        icon: 'check',
      });
      isModalOpen.value = false;
      fetchCategories();
    })
    .catch((error) => {
      console.error(error);
    });
}

async function onDeleteCategory(category_id: string) {
  $q.dialog({
    title: 'Delete category',
    message: 'Are you sure you want to delete this category?',
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteCategory(noteId, category_id, { jwt_token }).then(() => {
        $q.notify({
          position: 'top',
          icon: 'check',
          message: 'Transaction deleted successfully',
          color: 'positive',
        });
        fetchCategories();
      });
    })
    .onCancel(() => {
      console.log('Cancel');
    });
  try {
  } catch (error) {
    console.error(error);
  }
}

fetchNoteDetail();
fetchCategories();
</script>

<style scoped>
.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  max-width: 70rem;
  margin: 0 auto;
}

@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}

.hide-spin-button :deep(input[type='number']) {
  -moz-appearance: textfield;
}
.hide-spin-button :deep(input::-webkit-outer-spin-button),
.hide-spin-button :deep(input::-webkit-inner-spin-button) {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
