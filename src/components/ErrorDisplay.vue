<template>
  <p class="errorDisplay">{{ error }}</p>
</template>

<script setup lang="ts">
const props = defineProps({
  error: {
    type: String || undefined,
  },
});
</script>

<style scoped>
.errorDisplay {
  display: block;
  text-align: center;
  color: var(--color-red);
  font-weight: 900;
  font-style: italic;
  background: #3333;
  width: 80%;
  margin-inline: auto;
  padding: var(--size-value-normal);
  text-shadow: 2px 2px 5px hsla(0, 87.5%, 50%, 0.5);
}
</style>
