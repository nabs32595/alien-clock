<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isActive = (routeName: string) => {
  return computed(() => route.name === routeName)
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link to="/" class="nav-item" :class="{ active: isActive('home').value }">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <span>Clock</span>
    </router-link>

    <router-link to="/alarm" class="nav-item" :class="{ active: isActive('alarm').value }">
      <div class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-6 h-6"
        >
          <path
            d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z"
          />
          <path
            d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
          />
        </svg>
      </div>
      <span>Alarm</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  @apply fixed bottom-4 left-4 right-4 h-16 bg-indigo-950/90 backdrop-blur-md flex justify-around items-center z-50 border-t border-indigo-800 rounded-2xl shadow-lg;
}

.nav-item {
  @apply flex flex-col items-center justify-center w-full h-full text-indigo-400 transition-all duration-300 ease-in-out relative;
}

.nav-item.active {
  @apply text-indigo-200;
}

.nav-item.active::after {
  content: '';
  @apply absolute bottom-0 w-1/2 h-1 bg-indigo-400 rounded-t-full;
  animation: fadeIn 0.3s ease-in-out;
}

.icon {
  @apply mb-1 transition-transform duration-300;
}

.nav-item.active .icon {
  @apply scale-110 text-white;
  animation: bounce 0.5s ease;
}

.nav-item span {
  @apply text-xs transition-opacity duration-300;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    width: 0;
  }
  to {
    opacity: 1;
    width: 50%;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) scale(1.1);
  }
  50% {
    transform: translateY(-3px) scale(1.1);
  }
}
</style>
