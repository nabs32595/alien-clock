<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import TimeUnit from '@/components/molecules/TimeUnit.vue'
import TimeSeparator from '@/components/atoms/TimeSeparator.vue'
import Card from '@/components/molecules/Card.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'
import { useAlienClockStore } from '@/stores/alienClock'
import { useEarthClockStore } from '@/stores/earthClock'
import { useWindowSize } from '@/composables/useWindowSize'

// Animation control
const showTitle = ref(false)
const showDateTime = ref(false)

// Stores
const alienClockStore = useAlienClockStore()
const earthClockStore = useEarthClockStore()

// Window size
const { width, height } = useWindowSize()

// Responsive title
const titleSize = computed(() => {
  if (height.value < 500) return 'compact'
  if (width.value < 640) return 'small'
  return 'normal'
})

// Responsive size for time units
const responsiveSize = computed(() => {
  if (width.value < 480) {
    return 'xs'
  } else if (width.value < 640) {
    return 'sm'
  } else if (width.value < 1024) {
    return 'md'
  }
  return 'lg'
})

// Expose alien clock data
const alienYear = computed(() => alienClockStore.year)
const alienMonth = computed(() => alienClockStore.month)
const alienDay = computed(() => alienClockStore.day)
const alienHour = computed(() => alienClockStore.hour)
const alienMinute = computed(() => alienClockStore.minute)
const alienSecond = computed(() => alienClockStore.second)
const alienDaysInMonth = computed(() => alienClockStore.daysInCurrentMonth)

// Expose earth clock data
const earthYear = computed(() => earthClockStore.year)
const earthDay = computed(() => earthClockStore.day)
const earthHour = computed(() => earthClockStore.hour)
const earthMinute = computed(() => earthClockStore.minute)
const earthSecond = computed(() => earthClockStore.second)
const earthMonthName = computed(() => earthClockStore.monthName)

// Start the clocks on mount
onMounted(() => {
  alienClockStore.startClock()
  earthClockStore.startClock()

  // Staggered animations
  setTimeout(() => {
    showTitle.value = true
  }, 300)

  setTimeout(() => {
    showDateTime.value = true
  }, 800)
})
</script>

<template>
  <DefaultLayout>
    <main class="home-view">
      <div class="clock-container">
        <Transition name="fade">
          <div v-if="showTitle" class="title-area" :class="titleSize">
            <h1 class="title">Galactic Clock</h1>
          </div>
        </Transition>

        <Transition name="slide-up">
          <div class="datetime-area" v-if="showDateTime">
            <!-- Alien Time Card -->
            <Card class="mb-3 md:mb-4">
              <h2 class="card-title">Alien Time</h2>
              <div class="datetime-content">
                <!-- Date section -->
                <div class="date-section">
                  <div class="date-info">
                    <span class="date-value">
                      <span class="emoji">👽</span> Month {{ alienMonth }} {{ alienDay }},
                      {{ alienYear }}
                      <span class="text-indigo-300 text-xs ml-1 md:ml-2"
                        >({{ alienDaysInMonth }} days/month)</span
                      >
                    </span>
                  </div>
                </div>

                <!-- Time section -->
                <div class="time-section">
                  <div class="flex items-center justify-center flex-wrap gap-1 sm:gap-2">
                    <TimeUnit :value="alienHour" label="Hour" :size="responsiveSize" />
                    <TimeSeparator :size="responsiveSize" />
                    <TimeUnit :value="alienMinute" label="Minute" :size="responsiveSize" />
                    <TimeSeparator :size="responsiveSize" />
                    <TimeUnit :value="alienSecond" label="Second" :size="responsiveSize" />
                  </div>
                </div>
              </div>
            </Card>

            <!-- Earth Time Card -->
            <Card>
              <h2 class="card-title">Earth Time</h2>
              <div class="datetime-content">
                <!-- Date section -->
                <div class="date-section">
                  <div class="date-info">
                    <span class="date-value">
                      <span class="emoji">🌎</span> {{ earthMonthName }} {{ earthDay }},
                      {{ earthYear }}
                    </span>
                  </div>
                </div>

                <!-- Time section -->
                <div class="time-section">
                  <div class="flex items-center justify-center flex-wrap gap-1 sm:gap-2">
                    <TimeUnit :value="earthHour" label="Hour" :size="responsiveSize" />
                    <TimeSeparator :size="responsiveSize" />
                    <TimeUnit :value="earthMinute" label="Minute" :size="responsiveSize" />
                    <TimeSeparator :size="responsiveSize" />
                    <TimeUnit :value="earthSecond" label="Second" :size="responsiveSize" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Transition>
      </div>
    </main>
  </DefaultLayout>
</template>

<style scoped>
.home-view {
  @apply min-h-screen flex items-start justify-center overflow-visible relative p-1.5 sm:p-4 w-full pt-3 sm:pt-4;
}

.clock-container {
  @apply flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-0 sm:py-2;
  z-index: 1;
}

.title-area {
  @apply text-center mb-2 sm:mb-4 md:mb-6;
}

.title {
  @apply text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-200 tracking-wider;
  text-shadow: 0 0 15px rgba(165, 180, 252, 0.5);
}

.card-title {
  @apply text-base sm:text-xl text-indigo-100 mb-1 sm:mb-3 font-semibold;
}

.datetime-area {
  @apply w-full px-1 sm:px-2 flex flex-col items-center;
}

.datetime-content {
  @apply flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center;
}

.date-section {
  @apply flex flex-col w-full sm:w-2/5 items-center;
  border-bottom: 1px solid rgba(165, 180, 252, 0.2);
  border-right: none;
  padding-bottom: 0.25rem;
  margin-bottom: 0.25rem;

  @screen sm {
    border-bottom: none;
    border-right: 1px solid rgba(165, 180, 252, 0.2);
    padding-right: 1rem;
    padding-bottom: 0;
    margin-bottom: 0;
  }
}

.date-info {
  @apply flex items-center justify-center gap-1 sm:gap-2 py-0.5 sm:py-1;
}

.date-value {
  @apply text-indigo-100 font-mono text-xs sm:text-base md:text-lg font-bold text-center;
}

.time-section {
  @apply w-full sm:w-1/2 flex items-center justify-center;
}

/* Compact mode for small heights */
.compact .title {
  @apply text-lg;
}

/* Small mode for narrow screens */
.small .title {
  @apply text-xl;
}

.emoji {
  @apply mr-1;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
