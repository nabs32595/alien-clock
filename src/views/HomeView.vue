<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TimeDisplay from '@/components/organisms/TimeDisplay.vue'
import DateDisplay from '@/components/organisms/DateDisplay.vue'
import SpaceBackground from '@/components/organisms/SpaceBackground.vue'
import { useAlienClockStore } from '@/stores/alienClock'
import { useWindowSize } from '@/composables/useWindowSize'

// Animation control
const showTitle = ref(false)
const showDate = ref(false)
const showTime = ref(false)

// Store
const alienClockStore = useAlienClockStore()

// Window size
const { width, height } = useWindowSize()

// Responsive title
const titleSize = computed(() => {
  if (height.value < 500) return 'compact'
  if (width.value < 640) return 'small'
  return 'normal'
})

// Expose clock data
const year = computed(() => alienClockStore.year)
const month = computed(() => alienClockStore.month)
const day = computed(() => alienClockStore.day)
const hour = computed(() => alienClockStore.hour)
const minute = computed(() => alienClockStore.minute)
const second = computed(() => alienClockStore.second)
const daysInMonth = computed(() => alienClockStore.daysInCurrentMonth)

// Start the clock on mount
onMounted(() => {
  alienClockStore.startClock()

  // Staggered animations
  setTimeout(() => {
    showTitle.value = true
  }, 300)
  setTimeout(() => {
    showDate.value = true
  }, 800)
  setTimeout(() => {
    showTime.value = true
  }, 1300)
})
</script>

<template>
  <main class="home-view">
    <!-- Space background component -->
    <SpaceBackground />

    <div class="clock-container">
      <Transition name="fade">
        <div v-if="showTitle" class="title-area" :class="titleSize">
          <h1 class="title">Alien Clock</h1>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div class="date-area" v-if="showDate">
          <DateDisplay :year="year" :month="month" :day="day" :daysInMonth="daysInMonth" />
        </div>
      </Transition>

      <Transition name="slide-up">
        <div class="time-area" v-if="showTime">
          <TimeDisplay :hour="hour" :minute="minute" :second="second" size="lg" />
        </div>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.home-view {
  @apply min-h-screen flex items-center justify-center overflow-hidden relative p-4 w-full h-screen pb-20;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  padding-bottom: 4rem; /* Space for bottom navigation */
}

.clock-container {
  @apply flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto;
  z-index: 1;
}

.title-area {
  @apply text-center mb-4 md:mb-6;
}

.title {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-200 tracking-wider;
  text-shadow: 0 0 15px rgba(165, 180, 252, 0.5);
}

.date-area {
  @apply mb-4 md:mb-6 w-full px-2;
}

.time-area {
  @apply mb-6 md:mb-8 w-full px-2;
}

/* Compact mode for small heights */
.compact .title {
  @apply text-xl;
}

.small .title {
  @apply text-2xl;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
