<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAlienClockStore } from '@/stores/alienClock'

const alienClockStore = useAlienClockStore()

const alarmHour = ref(0)
const alarmMinute = ref(0)
const alarmSecond = ref(0)
const alarmEnabled = ref(false)
const alarmTriggered = ref(false)
const alarms = ref<{ hour: number; minute: number; second: number; enabled: boolean }[]>([])

// Format numbers with leading zeros
const formatNumber = (num: number) => num.toString().padStart(2, '0')

// Add an alarm to the list
const addAlarm = () => {
  alarms.value.push({
    hour: alarmHour.value,
    minute: alarmMinute.value,
    second: alarmSecond.value,
    enabled: true,
  })
  // Reset form
  alarmHour.value = 0
  alarmMinute.value = 0
  alarmSecond.value = 0
}

// Toggle an alarm's enabled state
const toggleAlarm = (index: number) => {
  alarms.value[index].enabled = !alarms.value[index].enabled
}

// Delete an alarm
const deleteAlarm = (index: number) => {
  alarms.value.splice(index, 1)
}

// Check if any alarms should be triggered
const checkAlarms = () => {
  const currentHour = alienClockStore.hour
  const currentMinute = alienClockStore.minute
  const currentSecond = alienClockStore.second

  alarms.value.forEach((alarm) => {
    if (
      alarm.enabled &&
      alarm.hour === currentHour &&
      alarm.minute === currentMinute &&
      alarm.second === currentSecond
    ) {
      alarmTriggered.value = true
      playAlarmSound()
    }
  })
}

// Play alarm sound
const playAlarmSound = () => {
  // In a real app, would play a sound here
  console.log('ALARM TRIGGERED!')
  setTimeout(() => {
    alarmTriggered.value = false
  }, 5000)
}

// Watch for time changes to check alarms
let intervalId: number | null = null

onMounted(() => {
  intervalId = setInterval(checkAlarms, 500) as unknown as number
})

// Clean up interval on component unmount
const onBeforeUnmount = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
}
</script>

<template>
  <div class="alarm-view">
    <div class="alarm-container">
      <h1 class="title">Alien Alarm</h1>

      <div class="current-time">
        <p>
          Current Time: {{ formatNumber(alienClockStore.hour) }}:{{
            formatNumber(alienClockStore.minute)
          }}:{{ formatNumber(alienClockStore.second) }}
        </p>
      </div>

      <div class="alarm-form">
        <h2>Set New Alarm</h2>
        <div class="time-inputs">
          <div class="input-group">
            <label for="hour">Hour</label>
            <input
              id="hour"
              type="number"
              v-model="alarmHour"
              min="0"
              max="35"
              class="time-input"
            />
          </div>
          <div class="input-group">
            <label for="minute">Minute</label>
            <input
              id="minute"
              type="number"
              v-model="alarmMinute"
              min="0"
              max="89"
              class="time-input"
            />
          </div>
          <div class="input-group">
            <label for="second">Second</label>
            <input
              id="second"
              type="number"
              v-model="alarmSecond"
              min="0"
              max="89"
              class="time-input"
            />
          </div>
        </div>
        <button @click="addAlarm" class="add-button">Add Alarm</button>
      </div>

      <div class="alarms-list" v-if="alarms.length > 0">
        <h2>Your Alarms</h2>
        <ul>
          <li v-for="(alarm, index) in alarms" :key="index" class="alarm-item">
            <div class="alarm-time">
              {{ formatNumber(alarm.hour) }}:{{ formatNumber(alarm.minute) }}:{{
                formatNumber(alarm.second)
              }}
            </div>
            <div class="alarm-controls">
              <button
                @click="toggleAlarm(index)"
                :class="{ enabled: alarm.enabled, disabled: !alarm.enabled }"
              >
                {{ alarm.enabled ? 'ON' : 'OFF' }}
              </button>
              <button @click="deleteAlarm(index)" class="delete-button">Delete</button>
            </div>
          </li>
        </ul>
      </div>

      <div v-else class="no-alarms">
        <p>No alarms set</p>
      </div>
    </div>

    <div v-if="alarmTriggered" class="alarm-alert">
      <div class="alert-content">
        <h2>ALARM!</h2>
        <button @click="alarmTriggered = false">Dismiss</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alarm-view {
  @apply min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-950 to-black overflow-hidden relative p-4 w-full h-full pb-20;
}

.alarm-container {
  @apply flex flex-col items-center justify-start w-full max-w-md mx-auto overflow-y-auto h-full pt-8;
}

.title {
  @apply text-3xl font-bold text-indigo-200 tracking-wider mb-6;
}

.current-time {
  @apply text-xl text-indigo-300 mb-8;
}

.alarm-form {
  @apply w-full bg-indigo-900/40 rounded-xl p-4 mb-6;
}

.alarm-form h2 {
  @apply text-xl text-indigo-200 mb-4;
}

.time-inputs {
  @apply flex justify-between gap-2 mb-4;
}

.input-group {
  @apply flex flex-col;
}

.input-group label {
  @apply text-indigo-300 mb-1 text-sm;
}

.time-input {
  @apply bg-indigo-800 text-white rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500;
}

.add-button {
  @apply w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors;
}

.alarms-list {
  @apply w-full bg-indigo-900/40 rounded-xl p-4;
}

.alarms-list h2 {
  @apply text-xl text-indigo-200 mb-4;
}

.alarm-item {
  @apply flex justify-between items-center bg-indigo-800/50 rounded-lg p-3 mb-2;
}

.alarm-time {
  @apply text-xl text-indigo-200 font-mono;
}

.alarm-controls {
  @apply flex gap-2;
}

.alarm-controls button {
  @apply px-3 py-1 rounded text-sm font-medium;
}

.alarm-controls button.enabled {
  @apply bg-green-600 text-white;
}

.alarm-controls button.disabled {
  @apply bg-gray-600 text-white;
}

.delete-button {
  @apply bg-red-600 text-white;
}

.no-alarms {
  @apply text-indigo-400 italic mt-4;
}

.alarm-alert {
  @apply fixed inset-0 bg-red-900/80 flex items-center justify-center z-50;
  animation: pulse 1s infinite;
}

.alert-content {
  @apply bg-red-800 p-6 rounded-xl text-center;
}

.alert-content h2 {
  @apply text-3xl text-white mb-4;
}

.alert-content button {
  @apply bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>
