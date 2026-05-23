<template>
  <header class="header" role="banner">
    <ThemeSelectDropdown />
  </header>
</template>

<script setup lang="ts">
import ThemeSelectDropdown from "@/components/ThemeSelectDropdown.vue";
</script>

<style scoped>
header.header {
  text-align: center;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  padding: var(--size-value-small);
  justify-content: flex-end;
}

.header * {
  padding: var(--size-value-small) 0;
}
</style>
