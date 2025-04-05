import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAlienClockStore } from './alienClock'

export interface Alarm {
  hour: number
  minute: number
  second: number
  enabled: boolean
}

export const useAlarmStore = defineStore('alarm', () => {
  const alienClockStore = useAlienClockStore()
  const alarms = ref<Alarm[]>([])
  const newAlarm = ref<Alarm>({ hour: 0, minute: 0, second: 0, enabled: true })
  const alarmTriggered = ref(false)
  const intervalId = ref<number | null>(null)

  // Format numbers with leading zeros
  const formatNumber = (num: number): string => num.toString().padStart(2, '0')

  // Format time for display
  const formatTime = (h: number, m: number, s: number): string =>
    `${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`

  // Add an alarm to the list
  const addAlarm = () => {
    alarms.value.push({ ...newAlarm.value })
    resetNewAlarm()
  }

  // Reset the new alarm form values
  const resetNewAlarm = () => {
    newAlarm.value = { hour: 0, minute: 0, second: 0, enabled: true }
  }

  // Toggle an alarm's enabled state
  const toggleAlarm = (index: number) => {
    alarms.value[index].enabled = !alarms.value[index].enabled
  }

  // Delete an alarm
  const deleteAlarm = (index: number) => {
    alarms.value.splice(index, 1)
  }

  // Dismiss the current alarm
  const dismissAlarm = () => {
    alarmTriggered.value = false
  }

  // Check if any alarms should be triggered
  const checkAlarms = () => {
    const { hour, minute, second } = alienClockStore

    for (const alarm of alarms.value) {
      if (
        alarm.enabled &&
        alarm.hour === hour &&
        alarm.minute === minute &&
        alarm.second === second
      ) {
        alarmTriggered.value = true
        break
      }
    }
  }

  // Start monitoring for alarms
  const startAlarmMonitor = () => {
    if (intervalId.value !== null) return

    // Update immediately
    checkAlarms()

    // Then check every 500ms
    intervalId.value = setInterval(checkAlarms, 500) as unknown as number
  }

  // Stop monitoring for alarms
  const stopAlarmMonitor = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  return {
    alarms,
    newAlarm,
    alarmTriggered,
    formatNumber,
    formatTime,
    addAlarm,
    resetNewAlarm,
    toggleAlarm,
    deleteAlarm,
    dismissAlarm,
    startAlarmMonitor,
    stopAlarmMonitor,
  }
})
