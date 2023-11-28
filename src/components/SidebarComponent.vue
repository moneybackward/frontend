<template>
  <aside>
    <!-- Maybe have to v-model? -->
    <q-drawer v-if="isOpen" side="right" overlay elevated :width="283">
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
            <q-icon :name="linkItem.icon" size="md" />
          </q-item-section>
          <q-item-section class="text-h6 text-weight-bold">
            {{ linkItem.name }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  links?: string[];
}>();

let localLinks = [
  {
    name: 'About',
    icon: 'help',
    to: '/about',
  },
];

// TODO: login check
const isAuth = false;
if (isAuth) {
  localLinks = [
    ...localLinks,
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
      icon: 'auth',
      to: '/auth/login',
    },
  ];
}
</script>
