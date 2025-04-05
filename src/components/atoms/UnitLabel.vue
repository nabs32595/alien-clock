<template>
  <div class="unit-label" :class="size">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  size: 'md'
});
</script>

<style scoped>
.unit-label {
  @apply text-indigo-300 text-center font-semibold;
}

.sm {
  @apply text-xs;
}

.md {
  @apply text-sm;
}

.lg {
  @apply text-base;
}
</style>
