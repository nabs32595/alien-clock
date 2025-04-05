<template>
  <Card>
    <div class="date-display">
      <div class="flex items-center justify-center">
        <div class="flex flex-col w-full">
          <div class="date-info">
            <span class="date-label">Year:</span>
            <span class="date-value">{{ year }}</span>
          </div>
          <div class="date-info">
            <span class="date-label">Month:</span>
            <span class="date-value">{{ month }}</span>
            <span class="text-indigo-300 text-xs">({{ daysInMonth }} days)</span>
          </div>
          <div class="date-info">
            <span class="date-label">Day:</span>
            <span class="date-value">{{ day }}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/molecules/Card.vue';

interface Props {
  year: number;
  month: number;
  day: number;
  daysInMonth: number;
}

defineProps<Props>();
</script>

<style scoped>
.date-display {
  @apply w-full;
}

.date-info {
  @apply flex items-center gap-2 py-1;
}

.date-label {
  @apply text-indigo-300 font-medium w-16 sm:w-20;
}

.date-value {
  @apply text-indigo-100 font-mono text-base sm:text-lg font-bold;
}

@media (max-height: 600px) {
  .date-info {
    @apply py-0.5;
  }

  .date-label {
    @apply text-sm w-14;
  }

  .date-value {
    @apply text-sm;
  }
}
</style>
