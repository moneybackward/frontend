<template>
  <q-item :href="link" clickable v-ripple>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="md" />
    </q-item-section>
    <q-item-section class="text-h6 text-weight-bold">
      {{ label }}
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface SidebarLinkProps {
  label: string;
  icon?: string;
  link?: string;
}
withDefaults(defineProps<SidebarLinkProps>(), {
  label: '',
  icon: '',
  link: '#',
});
</script>
