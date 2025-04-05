<template>
  <Card>
    <div class="flex items-center justify-center flex-wrap gap-2">
      <TimeUnit :value="hour" label="Hour" :size="responsiveSize" />
      <TimeSeparator :size="responsiveSize" />
      <TimeUnit :value="minute" label="Minute" :size="responsiveSize" />
      <TimeSeparator :size="responsiveSize" />
      <TimeUnit :value="second" label="Second" :size="responsiveSize" :pulse="true" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import TimeUnit from '@/components/molecules/TimeUnit.vue';
import TimeSeparator from '@/components/atoms/TimeSeparator.vue';
import Card from '@/components/molecules/Card.vue';
import { computed } from 'vue';
import { useWindowSize } from '@/composables/useWindowSize';

interface Props {
  hour: number;
  minute: number;
  second: number;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

// Use window size composable
const { width } = useWindowSize();

// Responsive size based on screen width
const responsiveSize = computed(() => {
  if (width.value < 640) {
    return 'sm';
  } else if (width.value < 1024) {
    return 'md';
  }
  return props.size;
});
</script>

<style scoped>
/* Removed time-display class as it's now handled by the Card component */
</style>
