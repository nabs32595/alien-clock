<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useAlienClockStore } from '@/stores/alienClock'
import { useEarthClockStore } from '@/stores/earthClock'
import { useAlarmStore } from '@/stores/alarmStore'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

const alienClockStore = useAlienClockStore()
const earthClockStore = useEarthClockStore()
const alarmStore = useAlarmStore()

// Start the alarm monitor when component is mounted
onMounted(() => {
  // Make sure the clocks are running
  alienClockStore.startClock()
  earthClockStore.startClock()
  alarmStore.startAlarmMonitor()
})

// Stop the alarm monitor when component is unmounted
onBeforeUnmount(() => {
  alarmStore.stopAlarmMonitor()
})
</script>

<template>
  <DefaultLayout>
    <main class="alarm-view">
      <div class="alarm-content">
        <!-- Clock display -->
        <div class="header-section">
          <div class="time-display alien">
            <span>👽</span
            >{{
              alarmStore.formatTime(
                alienClockStore.hour,
                alienClockStore.minute,
                alienClockStore.second
              )
            }}
          </div>
<!--          <div class="time-display earth">-->
<!--            <span>🌎</span-->
<!--            >{{-->
<!--              alarmStore.formatTime(-->
<!--                earthClockStore.hour,-->
<!--                earthClockStore.minute,-->
<!--                earthClockStore.second-->
<!--              )-->
<!--            }}-->
<!--          </div>-->
        </div>

        <div class="compact-container">
          <h1 class="title">Alien Alarm</h1>

          <!-- Alarm form -->
          <div class="alarm-form">
            <div class="time-picker">
              <input
                type="number"
                v-model="alarmStore.newAlarm.hour"
                min="0"
                max="35"
                class="time-input"
                placeholder="HH"
              />
              <span>:</span>
              <input
                type="number"
                v-model="alarmStore.newAlarm.minute"
                min="0"
                max="89"
                class="time-input"
                placeholder="MM"
              />
              <span>:</span>
              <input
                type="number"
                v-model="alarmStore.newAlarm.second"
                min="0"
                max="89"
                class="time-input"
                placeholder="SS"
              />
              <button @click="alarmStore.addAlarm" class="add-button">⏰</button>
            </div>
          </div>

          <!-- Alarms list -->
          <div v-if="alarmStore.alarms.length > 0" class="alarms-list">
            <transition-group name="alarm-list" tag="ul">
              <li v-for="(alarm, index) in alarmStore.alarms" :key="index" class="alarm-item">
                <div class="alarm-time">
                  {{ alarmStore.formatTime(alarm.hour, alarm.minute, alarm.second) }}
                </div>
                <div class="alarm-controls">
                  <button
                    @click="alarmStore.toggleAlarm(index)"
                    class="toggle-button"
                    :class="{ on: alarm.enabled, off: !alarm.enabled }"
                  >
                    {{ alarm.enabled ? '🔔' : '🔕' }}
                  </button>
                  <button @click="alarmStore.deleteAlarm(index)" class="delete-button">🗑️</button>
                </div>
              </li>
            </transition-group>
          </div>

          <div v-else class="no-alarms">No alarms set</div>
        </div>
      </div>

      <!-- Alarm popup -->
      <Transition name="alarm-popup">
        <div v-if="alarmStore.alarmTriggered" class="alarm-alert">
          <div class="alert-content">
            <div class="alert-icon">⏰</div>
            <h2>WAKE UP!</h2>
            <button @click="alarmStore.dismissAlarm" class="dismiss-button">Snooze</button>
          </div>
        </div>
      </Transition>
    </main>
  </DefaultLayout>
</template>

<style scoped>
.alarm-view {
  @apply min-h-screen flex flex-col items-center justify-center w-full p-3;
}

.alarm-content {
  @apply flex flex-col items-center justify-center w-full max-w-sm mx-auto;
}

.header-section {
  @apply flex justify-center gap-3 mb-4 w-full;
}

.time-display {
  @apply flex items-center justify-center px-3 py-2 rounded-lg text-white font-mono text-center;
  backdrop-filter: blur(5px);
}

.time-display.alien {
  @apply bg-indigo-900/40 border-l-4 border-indigo-500;
}

.time-display.earth {
  @apply bg-blue-900/40 border-l-4 border-blue-500;
}

.time-display span {
  @apply mr-2;
}

.compact-container {
  @apply flex flex-col items-center w-full bg-indigo-950/40 p-4 rounded-xl backdrop-blur-md;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  @apply text-xl font-bold text-indigo-200 tracking-wider mb-3 text-center;
}

.alarm-form {
  @apply w-full bg-indigo-900/30 rounded-lg p-3 mb-3;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.time-picker {
  @apply flex items-center justify-center gap-2;
}

.time-input {
  @apply bg-indigo-800/70 text-white rounded text-center py-1 w-14 text-lg;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.time-picker span {
  @apply text-indigo-400;
}

.add-button {
  @apply bg-indigo-600 text-white rounded-lg p-2 ml-1;
  transition: all 0.2s ease;
}

.add-button:hover {
  @apply bg-indigo-500;
}

.alarms-list {
  @apply w-full flex flex-col items-center;
}

.alarms-list ul {
  @apply w-full;
}

.alarm-item {
  @apply flex justify-between items-center mb-2 p-2 rounded-lg w-full;
  background: rgba(30, 27, 75, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.alarm-time {
  @apply text-indigo-100 font-mono text-center;
}

.alarm-controls {
  @apply flex gap-1;
}

.toggle-button,
.delete-button {
  @apply p-1 rounded-full;
  transition: all 0.2s ease;
}

.toggle-button:hover,
.delete-button:hover {
  @apply transform scale-110;
}

.toggle-button.on {
  @apply bg-green-600/40;
}

.toggle-button.off {
  @apply bg-gray-700/40;
}

.delete-button {
  @apply bg-red-600/40;
}

.no-alarms {
  @apply text-indigo-400 text-center py-3 w-full;
}

.alarm-alert {
  @apply fixed inset-0 flex items-center justify-center z-50;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.alert-content {
  @apply bg-gradient-to-br from-red-800 to-purple-900 text-white rounded-xl p-5 flex flex-col items-center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
  animation: pulse 1s infinite alternate;
}

.alert-icon {
  @apply text-4xl mb-2;
  animation: shake 0.5s infinite;
}

.alert-content h2 {
  @apply text-2xl font-bold mb-3;
}

.dismiss-button {
  @apply bg-red-700 px-5 py-2 rounded-lg font-bold;
}

/* Animations */
.alarm-popup-enter-active,
.alarm-popup-leave-active {
  transition: all 0.3s ease;
}

.alarm-popup-enter-from,
.alarm-popup-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.alarm-list-enter-active,
.alarm-list-leave-active {
  transition: all 0.5s ease;
}

.alarm-list-enter-from,
.alarm-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>
