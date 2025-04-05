<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAlienClockStore } from '@/stores/alienClock'
import Card from '@/components/molecules/Card.vue'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

const alienClockStore = useAlienClockStore()

// Form values for setting alien time
const newYear = ref(alienClockStore.year)
const newMonth = ref(alienClockStore.month)
const newDay = ref(alienClockStore.day)
const newHour = ref(alienClockStore.hour)
const newMinute = ref(alienClockStore.minute)
const newSecond = ref(alienClockStore.second)

// For validation messages
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties for validation
const maxDaysInMonth = computed(() => {
  if (newMonth.value >= 1 && newMonth.value <= alienClockStore.MONTHS_IN_YEAR) {
    return alienClockStore.ALIEN_DAYS_IN_MONTH[newMonth.value - 1]
  }
  return 0
})

// Update form values to current time
const updateFormValues = () => {
  newYear.value = alienClockStore.year
  newMonth.value = alienClockStore.month
  newDay.value = alienClockStore.day
  newHour.value = alienClockStore.hour
  newMinute.value = alienClockStore.minute
  newSecond.value = alienClockStore.second
}

// Submit the form
const submitForm = () => {
  try {
    // Clear messages
    errorMessage.value = ''
    successMessage.value = ''

    // Validate
    if (newMonth.value < 1 || newMonth.value > alienClockStore.MONTHS_IN_YEAR) {
      errorMessage.value = `Month must be between 1 and ${alienClockStore.MONTHS_IN_YEAR}`
      return
    }

    if (newDay.value < 1 || newDay.value > maxDaysInMonth.value) {
      errorMessage.value = `Day must be between 1 and ${maxDaysInMonth.value} for month ${newMonth.value}`
      return
    }

    if (newHour.value < 0 || newHour.value >= alienClockStore.HOURS_IN_DAY) {
      errorMessage.value = `Hour must be between 0 and ${alienClockStore.HOURS_IN_DAY - 1}`
      return
    }

    if (newMinute.value < 0 || newMinute.value >= alienClockStore.MINUTES_IN_HOUR) {
      errorMessage.value = `Minute must be between 0 and ${alienClockStore.MINUTES_IN_HOUR - 1}`
      return
    }

    if (newSecond.value < 0 || newSecond.value >= alienClockStore.SECONDS_IN_MINUTE) {
      errorMessage.value = `Second must be between 0 and ${alienClockStore.SECONDS_IN_MINUTE - 1}`
      return
    }

    // Set the alien time
    alienClockStore.setAlienDateTime(
      newYear.value,
      newMonth.value,
      newDay.value,
      newHour.value,
      newMinute.value,
      newSecond.value
    )

    successMessage.value = 'Alien time has been set successfully. Running in manual mode.'
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}

// Reset to Earth time
const resetToAutomatic = () => {
  try {
    alienClockStore.setAutomaticMode()
    successMessage.value = 'Clock reset to automatic mode.'
    errorMessage.value = ''
    updateFormValues()
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}

// Update form when component mounts
onMounted(() => {
  updateFormValues()
})
</script>

<template>
  <DefaultLayout>
    <main class="settings-view">
      <div class="settings-container">
        <h1 class="title">Alien Clock Settings</h1>

        <div class="grid-layout">
          <!-- Current Mode Card -->
          <Card class="compact-card">
            <h2 class="card-title">Current Mode</h2>
            <div class="mode-indicator">
              <span class="mode-label">Clock Mode:</span>
              <span
                class="mode-value"
                :class="{
                  'text-green-400': alienClockStore.isAutomatic,
                  'text-amber-400': !alienClockStore.isAutomatic,
                }"
              >
                {{ alienClockStore.isAutomatic ? 'Automatic (Synced)' : 'Manual' }}
              </span>
            </div>
          </Card>

          <!-- Alien Time Units Card -->
          <Card class="compact-card">
            <h2 class="card-title">Alien Time Units</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">1 min:</span>
                <span class="info-value">{{ alienClockStore.SECONDS_IN_MINUTE }}s</span>
              </div>
              <div class="info-item">
                <span class="info-label">1 hour:</span>
                <span class="info-value">{{ alienClockStore.MINUTES_IN_HOUR }}m</span>
              </div>
              <div class="info-item">
                <span class="info-label">1 day:</span>
                <span class="info-value">{{ alienClockStore.HOURS_IN_DAY }}h</span>
              </div>
              <div class="info-item">
                <span class="info-label">1 year:</span>
                <span class="info-value">{{ alienClockStore.MONTHS_IN_YEAR }}mo</span>
              </div>
            </div>
          </Card>
        </div>

        <!-- Set Time Card -->
        <Card class="mt-3 set-time-card">
          <h2 class="card-title">Set Alien Date & Time</h2>

          <form @submit.prevent="submitForm" class="time-form">
            <div class="form-content">
              <!-- Date inputs -->
              <div class="form-col">
                <div class="form-group">
                  <label for="year">Year:</label>
                  <input
                    id="year"
                    v-model.number="newYear"
                    type="number"
                    min="1"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="month"
                    >Month:
                    <span class="range-hint">(1-{{ alienClockStore.MONTHS_IN_YEAR }})</span></label
                  >
                  <input
                    id="month"
                    v-model.number="newMonth"
                    type="number"
                    min="1"
                    :max="alienClockStore.MONTHS_IN_YEAR"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="day"
                    >Day:
                    <span class="range-hint" v-if="maxDaysInMonth > 0"
                      >(1-{{ maxDaysInMonth }})</span
                    ></label
                  >
                  <input
                    id="day"
                    v-model.number="newDay"
                    type="number"
                    min="1"
                    :max="maxDaysInMonth"
                    required
                    class="form-input"
                  />
                </div>
              </div>

              <!-- Time inputs -->
              <div class="form-col">
                <div class="form-group">
                  <label for="hour"
                    >Hour:
                    <span class="range-hint"
                      >(0-{{ alienClockStore.HOURS_IN_DAY - 1 }})</span
                    ></label
                  >
                  <input
                    id="hour"
                    v-model.number="newHour"
                    type="number"
                    min="0"
                    :max="alienClockStore.HOURS_IN_DAY - 1"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="minute"
                    >Minute:
                    <span class="range-hint"
                      >(0-{{ alienClockStore.MINUTES_IN_HOUR - 1 }})</span
                    ></label
                  >
                  <input
                    id="minute"
                    v-model.number="newMinute"
                    type="number"
                    min="0"
                    :max="alienClockStore.MINUTES_IN_HOUR - 1"
                    required
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="second"
                    >Second:
                    <span class="range-hint"
                      >(0-{{ alienClockStore.SECONDS_IN_MINUTE - 1 }})</span
                    ></label
                  >
                  <input
                    id="second"
                    v-model.number="newSecond"
                    type="number"
                    min="0"
                    :max="alienClockStore.SECONDS_IN_MINUTE - 1"
                    required
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" class="submit-button">Set Time</button>
              <button type="button" @click="resetToAutomatic" class="reset-button">Reset</button>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </form>
        </Card>
      </div>
    </main>
  </DefaultLayout>
</template>

<style scoped>
.settings-view {
  @apply min-h-screen flex items-center justify-center overflow-hidden relative p-3 w-full h-screen;
}

.settings-container {
  @apply flex flex-col w-full max-w-xl mx-auto overflow-y-auto;
  z-index: 1;
}

.title {
  @apply text-2xl font-bold text-indigo-200 tracking-wider text-center mb-3;
  text-shadow: 0 0 15px rgba(165, 180, 252, 0.5);
}

.grid-layout {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
}

.compact-card {
  @apply p-3;
}

.set-time-card {
  @apply p-3;
}

.card-title {
  @apply text-lg text-indigo-100 mb-2 font-semibold;
}

.mode-indicator {
  @apply flex items-center gap-2;
}

.mode-label {
  @apply text-indigo-300 font-medium text-sm;
}

.mode-value {
  @apply font-bold text-sm;
}

.info-grid {
  @apply grid grid-cols-2 gap-x-4 gap-y-1;
}

.info-item {
  @apply flex items-center justify-between;
}

.info-label {
  @apply text-indigo-300 text-sm;
}

.info-value {
  @apply text-indigo-100 text-sm;
}

.time-form {
  @apply flex flex-col gap-3;
}

.form-content {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-3;
}

.form-col {
  @apply flex flex-col gap-2;
}

.form-group {
  @apply flex flex-col;
}

.form-group label {
  @apply text-indigo-300 mb-1 text-sm flex items-center;
}

.range-hint {
  @apply text-indigo-400 text-xs ml-1;
}

.form-input {
  @apply bg-indigo-800 text-indigo-100 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm;
}

.form-actions {
  @apply flex gap-2 mt-2;
}

.submit-button {
  @apply bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm;
}

.reset-button {
  @apply bg-indigo-800 text-white rounded px-3 py-1 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm;
}

.error-message {
  @apply bg-red-900/50 text-red-200 rounded p-2 mt-3 text-sm;
}

.success-message {
  @apply bg-green-900/50 text-green-200 rounded p-2 mt-3 text-sm;
}

@media (max-width: 640px) {
  .info-grid {
    @apply grid-cols-2;
  }
}
</style>
