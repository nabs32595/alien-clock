<template>
  <div class="digit-display" :class="[size, { 'pulse': pulse }]">
    <span class="text-center">{{ formattedValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  padZero?: boolean;
  minLength?: number;
  pulse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  padZero: true,
  minLength: 2,
  pulse: false
});

const formattedValue = computed(() => {
  const valueStr = props.value.toString();
  return props.padZero ? valueStr.padStart(props.minLength, '0') : valueStr;
});
</script>

<style scoped>
.digit-display {
  @apply bg-indigo-800 text-indigo-200 rounded-lg shadow-md flex items-center justify-center font-mono;
}

.sm {
  @apply text-lg px-2 py-1;
}

.md {
  @apply text-2xl px-3 py-2;
}

.lg {
  @apply text-4xl px-4 py-3;
}

.pulse {
  animation: pulse-animation 1s infinite;
}

@keyframes pulse-animation {
  0% {
    @apply bg-indigo-800;
  }
  50% {
    @apply bg-indigo-600;
  }
  100% {
    @apply bg-indigo-800;
  }
}
</style>
