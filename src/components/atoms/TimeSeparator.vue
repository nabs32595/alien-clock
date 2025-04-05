<template>
  <div class="time-separator" :class="size">
    {{ symbol }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  symbol?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  symbol: ':',
  size: 'md'
});
</script>

<style scoped>
.time-separator {
  @apply text-indigo-400 font-mono flex items-center justify-center;
}

.xs {
  @apply text-base;
}

.sm {
  @apply text-lg;
}

.md {
  @apply text-2xl;
}

.lg {
  @apply text-4xl;
}
</style>
