<template>
  <aside>
    <!-- Maybe have to v-model? -->
    <q-drawer v-model="isOpenModal" side="right" overlay elevated :width="283">
      <!-- drawer content -->
      <q-list bordered>
        <q-item
          v-for="linkItem in localLinks"
          :key="linkItem.to"
          :to="linkItem.to"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="linkItem.icon" size="md" class="text-primary" />
          </q-item-section>
          <q-item-section class="text-h6 text-primary text-weight-bold">
            {{ linkItem.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </aside>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';

const $q = useQuasar();
const props = defineProps<{
  isOpen: boolean;
}>();

const isOpenModal = computed<boolean>({
  get() {
    return props.isOpen;
  },
  set(value) {
    console.log(value);
  },
});

let localLinks = [
  {
    name: 'About',
    icon: 'help',
    to: '/about',
  },
];

// TODO: check if token is valid
const isAuth = $q.cookies.has('jwt_token');
if (isAuth) {
  localLinks = [
    ...localLinks,
    {
      name: 'App',
      icon: 'apps',
      to: '/app',
    },
    {
      name: 'Notes',
      icon: 'note',
      to: '/app/note',
    },
    {
      name: 'Logout',
      icon: 'logout',
      to: '/auth/logout',
    },
  ];
} else {
  localLinks = [
    ...localLinks,
    {
      name: 'Login/Register',
      icon: 'login',
      to: '/auth/login',
    },
  ];
}
</script>
