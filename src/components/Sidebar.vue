<template>
  <aside>
    <q-drawer v-model="isOpen" side="right" overlay elevated :width="283">
      <!-- drawer content -->
      <q-list bordered>
        <q-item
          v-for="linkItem in links"
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

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SidebarComponent",
  data() {
    return {
      isOpen: false,
    };
  },
  setup() {
    let links = [
      {
        name: "About",
        icon: "help",
        to: "/about",
      },
    ];

    // TODO: login check
    const isAuth = false;
    if (isAuth) {
      links = [
        ...links,
        {
          name: "Logout",
          icon: "logout",
          to: "/auth/logout",
        },
      ];
    } else {
      links = [
        ...links,
        {
          name: "Login/Register",
          icon: "auth",
          to: "/auth/login",
        },
      ];
    }

    return {
      links,
    };
  },
});
</script>
