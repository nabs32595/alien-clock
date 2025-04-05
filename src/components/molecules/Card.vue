<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // Add any props here if needed
}>();
</script>

<style scoped>
.card {
  @apply bg-indigo-900/30 rounded-xl p-3 md:p-4 backdrop-blur-sm shadow-lg w-full;
}

@media (max-height: 600px) {
  .card {
    @apply p-2 md:p-3;
  }
}
</style>