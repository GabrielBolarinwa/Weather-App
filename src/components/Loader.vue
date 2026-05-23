<template>
  <div aria-label="Weather Loading..." class="circle"></div>
</template>

<script setup lang="ts"></script>

<style lang="css" scoped>
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 10px solid;
  margin-inline: auto;
  border-top: 10px solid var(--color-blue);
  animation: animate 1.5s infinite linear;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
