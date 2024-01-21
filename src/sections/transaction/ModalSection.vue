<template>
  <!-- Modal -->
  <q-dialog v-model="isModalOpen" persistent>
    <q-card>
      <q-card-section class="flex column gap">
        <h5 class="text-bold">
          {{
            isEdit
              ? `Edit ${transactionData.label}`
              : 'Create a new transaction'
          }}
        </h5>
        <!-- Date Picker -->
        <q-input
          class="fit"
          v-model="dateInput"
          :mask="dateMask"
          id="date-input"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="formattedDate"
                  :mask="dateFormat"
                  v-close-popup="dateClosePopup"
                  @update:model-value="
                      (val: string) => {
                        dateInput = val;
                        transactionData.date = new Date(val).toISOString();
                        dateClosePopup = true;
                      }
                    "
                  no-unset
                  today-btn
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model="transactionData.label"
          label="Transaction label"
          filled
          dense
          clearable
        />
        <q-select
          v-model="isExpenseView"
          :options="isExpenseOptions"
          label="Type"
          filled
          dense
        />
        <q-select
          v-model="categoryView"
          :options="categoriesView"
          label="Category"
          filled
          dense
        />

        <video
          v-show="isUseOcr"
          ref="video"
          id="video"
          :width="vidWidth"
          :height="vidHeight"
          autoplay
        ></video>
        <section class="flex row items-start full-width">
          <q-input
            v-model.number="transactionData.amount"
            :rules="[(val) => val > 0 || 'Amount must be greater than 0']"
            class="hide-spin-button"
            type="number"
            label="Amount"
            filled
            dense
            clearable
          />
          <q-btn
            :label="isUseOcr ? 'Stop OCR' : 'Use OCR'"
            :color="isUseOcr ? 'negative' : 'secondary'"
            ripple
            @click="useOcr()"
          />
        </section>
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
          :label="isEdit ? 'Edit' : 'Create'"
          color="primary"
          push
          unelevated
          rounded
          ripple
          dense
          @click="isEdit ? onEditTransaction() : onCreateTransaction()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
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

<script setup lang="ts">
import { useMeta, useQuasar } from 'quasar';
import { getCategoriesList } from 'src/api/categories';
import {
  createTransaction,
  editTransaction,
  ICreateTransaction,
  ITransaction,
  IUpdateTransaction,
} from 'src/api/transactions';
import { watch } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IExpenseOptions } from '../../pages/app/CategoryPage.vue';
import { ILabelValue } from 'src/models/IBase';
import { formatCurrency } from 'src/utils/formatNumber';
import TesseractService from 'src/services/tesseractService';
import { extractAmount } from 'src/utils/extractor';
import { computed } from 'vue';

const props = defineProps<{
  data?: ITransaction;
  isOpen: boolean;
  isEdit: boolean;
  submitCallback: () => void;
}>();
const emits = defineEmits(['update:isOpen']);

const isModalOpen = computed({
  get: () => props.isOpen,
  set: (val) => {
    emits('update:isOpen', val);
  },
});

const newTransactionData = ref<ICreateTransaction>({
  amount: 0,
  category_id: '',
  date: new Date().toISOString(),
  is_expense: true,
  label: '',
});
const editTransactionData = ref<IUpdateTransaction>({
  id: '',
  amount: 0,
  category_id: '',
  date: new Date().toISOString(),
  is_expense: true,
  label: '',
});
const transactionData = ref<IUpdateTransaction | ICreateTransaction>(
  newTransactionData.value
);

const isExpenseOptions = ref<IExpenseOptions[]>([
  {
    label: 'Expense',
    value: true,
  },
  {
    label: 'Income',
    value: false,
  },
]);
const isExpenseView = computed({
  get: () => {
    return (
      isExpenseOptions.value.find(
        (option) => option.value === transactionData.value.is_expense
      ) ?? isExpenseOptions.value[0]
    );
  },
  set: (val) => {
    transactionData.value.is_expense = val.value;
  },
});

const $q = useQuasar();
const $router = useRouter();
const jwt_token = $q.cookies.get('jwt_token') || undefined;
const noteId = $q.cookies.get('last_opened_note') as string;

if (!noteId) {
  $router.push('/app/note');
}

useMeta({
  title: 'Transaction | Money Backward',
});

// Create new transaction
const dateFormat = 'YYYY-MM-DD';
const dateMask = dateFormat.replace(/[DMY]/g, '#');
const dateClosePopup = ref<boolean>(false);

const dateInput = ref<string>(props.data?.date ?? new Date().toISOString());
const formattedDate = ref<string>('');

const categories = await getCategoriesList({ noteId }, { jwt_token });
const categoriesView = computed(() => {
  return categories
    .filter((c) => c.is_expense === transactionData.value.is_expense)
    .map((c) => ({
      label: c.name,
      value: c.id,
    }));
});
const categoryView = computed({
  get: () => {
    let category = categoriesView.value.find(
      (category) => category.value === transactionData.value.category_id
    );
    if (!category) {
      category = categoriesView.value[0];
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      transactionData.value.category_id = category.value;
    }
    return category;
  },
  set: (val) => {
    transactionData.value.category_id = val.value;
  },
});

async function onCreateTransaction() {
  try {
    await createTransaction(
      noteId,
      transactionData.value as ICreateTransaction,
      { jwt_token }
    );
    $q.notify({
      position: 'top',
      icon: 'check',
      message: 'Transaction created successfully',
      color: 'positive',
    });
    isModalOpen.value = false;
    props.submitCallback();
  } catch (error) {
    console.error(error);
  }
}

async function onEditTransaction() {
  try {
    await editTransaction(noteId, transactionData.value as IUpdateTransaction, {
      jwt_token,
    });
    $q.notify({
      position: 'top',
      icon: 'check',
      message: 'Transaction edited successfully',
      color: 'positive',
    });
    isModalOpen.value = false;
    props.submitCallback();
  } catch (error) {
    console.error(error);
  }
}

watch(
  () => props.isEdit && props.data,
  () => {
    if (!props.isEdit) {
      transactionData.value = newTransactionData.value;
    }

    transactionData.value = props.data ?? {
      amount: 0,
      category_id: '',
      date: new Date().toISOString(),
      is_expense: false,
      label: '',
    };
    dateInput.value = transactionData.value.date;

    isExpenseView.value =
      isExpenseOptions.value.find(
        (option) => option.value === transactionData.value.is_expense
      ) ?? isExpenseOptions.value[0];

    categoryView.value =
      categoriesView.value.find(
        (category) => category.value === transactionData.value.category_id
      ) ?? categoriesView.value[0];
  }
);

watch(
  () => isExpenseView.value,
  async (val) => {
    if (!val) return;

    newTransactionData.value.is_expense = val.value;
    editTransactionData.value.is_expense = val.value;

    newTransactionData.value.category_id = categoryView.value.value;
    editTransactionData.value.category_id = categoryView.value.value;
  }
);

watch(
  () => categoryView.value,
  (val) => {
    if (!val) return;
    newTransactionData.value.category_id = val.value;
    editTransactionData.value.category_id = val.value;
  }
);

// VIDEO / OCR
watch(
  () => isModalOpen.value,
  () => {
    if (!isModalOpen.value) {
      stopVideo();
      isUseOcr.value = false;
    }
  }
);

// video config
const vidWidth = 320; // can be controlled
const vidHeight = 240; // can be controlled

// indicator config
const marginX = 0; // margin left and right, can be controlled
const indWidth = vidWidth - marginX; // 100% width - margin, can be changed if you want
const indHeight = 400; // can be controlled

function getVideo() {
  const video = document.getElementById('video') as HTMLVideoElement;
  if (!video) return;

  const tick = async () => {
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      // canvas
      const canvas = document.createElement('canvas');
      canvas.width = indWidth;
      canvas.height = indHeight;

      // source
      const sx = marginX / 2 / 2;
      const sy = vidHeight - indHeight;
      const sWidth = indWidth * 2;
      const sHeight = indHeight * 2;
      // destination
      const dx = 0;
      const dy = 0;
      const dWidth = indWidth;
      const dHeight = indHeight;

      canvas
        .getContext('2d')
        ?.drawImage(video, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

      // tesseract
      const {
        data: { text },
      } = await TesseractService.recognize(canvas);
      const amount = extractAmount(text);
      console.log(text, amount);

      if (amount) {
        transactionData.value.amount = amount;
      }
    }

    requestAnimationFrame(tick);
  };

  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: 'environment',
      },
      audio: false,
    })
    .then(async (stream) => {
      video.srcObject = stream;
      video.play();

      requestAnimationFrame(tick);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(async () => {
      await TesseractService.stop();
    });
}

function stopVideo() {
  const video = document.getElementById('video') as HTMLVideoElement;
  if (!video) return;

  const stream = video.srcObject as MediaStream;
  if (!stream) return;
  const tracks = stream.getTracks();

  tracks.forEach((track) => {
    track.stop();
  });

  video.srcObject = null;
}

const isUseOcr = ref<boolean>(false);
function useOcr() {
  isUseOcr.value = !isUseOcr.value;
  if (isUseOcr.value) {
    getVideo();
  } else {
    stopVideo();
  }
}
</script>
