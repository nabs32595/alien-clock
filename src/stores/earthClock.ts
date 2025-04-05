import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEarthClockStore = defineStore('earthClock', () => {
  const year = ref(0)
  const month = ref(0)
  const day = ref(0)
  const hour = ref(0)
  const minute = ref(0)
  const second = ref(0)
  const intervalId = ref<number | null>(null)

  const updateEarthTime = () => {
    const now = new Date()
    year.value = now.getFullYear()
    month.value = now.getMonth() + 1 // JavaScript months are 0-based
    day.value = now.getDate()
    hour.value = now.getHours()
    minute.value = now.getMinutes()
    second.value = now.getSeconds()
  }

  const startClock = () => {
    if (intervalId.value !== null) return

    // Update immediately
    updateEarthTime()

    // Then update every second
    intervalId.value = setInterval(updateEarthTime, 1000) as unknown as number
  }

  const stopClock = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const formattedTime = computed(() => {
    return `${hour.value.toString().padStart(2, '0')}:${minute.value.toString().padStart(2, '0')}:${second.value.toString().padStart(2, '0')}`
  })

  const formattedDate = computed(() => {
    return `${year.value}-${month.value.toString().padStart(2, '0')}-${day.value.toString().padStart(2, '0')}`
  })

  // Get the name of the current month
  const monthName = computed(() => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return monthNames[month.value - 1]
  })

  // Get the number of days in the current month
  const daysInCurrentMonth = computed(() => {
    return new Date(year.value, month.value, 0).getDate()
  })

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    formattedTime,
    formattedDate,
    monthName,
    daysInCurrentMonth,
    startClock,
    stopClock,
    updateEarthTime,
  }
})
