<template>
  <div class="time-unit">
    <DigitDisplay :value="value" :size="size" :pulse="pulse" />
    <UnitLabel :label="label" :size="size" />
  </div>
</template>

<script setup lang="ts">
import DigitDisplay from '@/components/atoms/DigitDisplay.vue';
import UnitLabel from '@/components/atoms/UnitLabel.vue';

interface Props {
  value: number;
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  pulse: false
});
</script>

<style scoped>
.time-unit {
  @apply flex flex-col items-center gap-0.5 sm:gap-1;
}
</style>
