import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Earth time reference point: 1970-1-1 12:00:00am
// Alien time reference point: Year 2804, Month 18, Day 31, Hour 2, Minute 2, Second 88
// 1 alien second = 0.5 earth second (alien time runs twice as fast)

// Alien time units
// 1 minute = 90 seconds
// 1 hour = 90 minutes
// 1 day = 36 hours
// 1 year = 18 months
const ALIEN_DAYS_IN_MONTH = [44, 42, 48, 40, 48, 44, 40, 44, 42, 40, 40, 42, 44, 48, 42, 40, 44, 38]
const SECONDS_IN_MINUTE = 90
const MINUTES_IN_HOUR = 90
const HOURS_IN_DAY = 36
const MONTHS_IN_YEAR = 18

// Earth epoch in milliseconds (1970-1-1 00:00:00)
const EARTH_EPOCH = new Date('1970-01-01T00:00:00Z').getTime()

// Alien epoch values
const ALIEN_EPOCH_YEAR = 2804
const ALIEN_EPOCH_MONTH = 18 // (1-based, like Earth months)
const ALIEN_EPOCH_DAY = 31
const ALIEN_EPOCH_HOUR = 2
const ALIEN_EPOCH_MINUTE = 2
const ALIEN_EPOCH_SECOND = 88

export const useAlienClockStore = defineStore('alienClock', () => {
  const year = ref(0)
  const month = ref(0)
  const day = ref(0)
  const hour = ref(0)
  const minute = ref(0)
  const second = ref(0)
  const intervalId = ref<number | null>(null)

  // Earth milliseconds per alien second
  const earthMillisecondsPerAlienSecond = 500 // 0.5 seconds * 1000

  const updateAlienTime = () => {
    const now = Date.now()
    const earthMillisecondsSinceEpoch = now - EARTH_EPOCH

    // Convert to alien seconds
    const alienSecondsSinceEpoch = Math.floor(earthMillisecondsSinceEpoch / earthMillisecondsPerAlienSecond)

    // Calculate alien time units
    let remainingSeconds = alienSecondsSinceEpoch

    // Calculate seconds, minutes, hours
    const currentSecond = remainingSeconds % SECONDS_IN_MINUTE
    remainingSeconds = Math.floor(remainingSeconds / SECONDS_IN_MINUTE)

    const currentMinute = remainingSeconds % MINUTES_IN_HOUR
    remainingSeconds = Math.floor(remainingSeconds / MINUTES_IN_HOUR)

    const currentHour = remainingSeconds % HOURS_IN_DAY
    remainingSeconds = Math.floor(remainingSeconds / HOURS_IN_DAY)

    // Calculate days and months (more complex due to variable days per month)
    let totalDays = remainingSeconds

    // Add the reference point values
    let currentYear = ALIEN_EPOCH_YEAR
    let currentMonth = ALIEN_EPOCH_MONTH - 1 // Convert to 0-based for calculations
    let currentDay = ALIEN_EPOCH_DAY
    let currentHourFinal = (ALIEN_EPOCH_HOUR + currentHour) % HOURS_IN_DAY
    let currentMinuteFinal = (ALIEN_EPOCH_MINUTE + currentMinute) % MINUTES_IN_HOUR
    const currentSecondFinal = (ALIEN_EPOCH_SECOND + currentSecond) % SECONDS_IN_MINUTE

    // Handle overflow of seconds to minutes
    if (currentSecondFinal < currentSecond) {
      currentMinuteFinal += 1
    }

    // Handle overflow of minutes to hours
    if (currentMinuteFinal >= MINUTES_IN_HOUR) {
      currentMinuteFinal %= MINUTES_IN_HOUR
      currentHourFinal += 1
    }

    // Handle overflow of hours to days
    if (currentHourFinal >= HOURS_IN_DAY) {
      currentHourFinal %= HOURS_IN_DAY
      currentDay += 1
    }

    // Adjust days, months, and years
    while (totalDays > 0) {
      const daysInMonth = ALIEN_DAYS_IN_MONTH[currentMonth]
      if (currentDay > daysInMonth) {
        currentDay = 1
        currentMonth += 1
        if (currentMonth >= MONTHS_IN_YEAR) {
          currentMonth = 0
          currentYear += 1
        }
      } else {
        totalDays -= 1
        currentDay += 1
        if (currentDay > ALIEN_DAYS_IN_MONTH[currentMonth]) {
          currentDay = 1
          currentMonth += 1
          if (currentMonth >= MONTHS_IN_YEAR) {
            currentMonth = 0
            currentYear += 1
          }
        }
      }
    }

    year.value = currentYear
    month.value = currentMonth + 1 // Convert back to 1-based for display
    day.value = currentDay
    hour.value = currentHourFinal
    minute.value = currentMinuteFinal
    second.value = currentSecondFinal
  }

  const startClock = () => {
    if (intervalId.value !== null) return

    // Update immediately
    updateAlienTime()

    // Then update every alien second (0.5 earth seconds)
    intervalId.value = setInterval(updateAlienTime, earthMillisecondsPerAlienSecond) as unknown as number
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
    return `Year ${year.value}, Month ${month.value}, Day ${day.value}`
  })

  const daysInCurrentMonth = computed(() => {
    return ALIEN_DAYS_IN_MONTH[month.value - 1]
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
    daysInCurrentMonth,
    startClock,
    stopClock,
    updateAlienTime
  }
})
