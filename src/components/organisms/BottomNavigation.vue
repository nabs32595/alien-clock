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
      <div class="icon">🕙</div>
      <span class="nav-label">Clock</span>
    </router-link>

    <router-link to="/alarm" class="nav-item" :class="{ active: isActive('alarm').value }">
      <div class="icon">🔔</div>
      <span class="nav-label">Alarm</span>
    </router-link>

    <router-link to="/settings" class="nav-item" :class="{ active: isActive('settings').value }">
      <div class="icon">⚙️</div>
      <span class="nav-label">Settings</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  @apply fixed bottom-1 sm:bottom-4 left-1 right-1 sm:left-8 sm:right-8 h-12 sm:h-16
    bg-indigo-950/90 backdrop-blur-md flex justify-around items-center z-50
    border-t border-indigo-800 rounded-xl sm:rounded-2xl shadow-lg;
}

.nav-item {
  @apply flex flex-col items-center justify-center w-full h-full text-indigo-400
    transition-all duration-300 ease-in-out relative py-0.5 sm:py-1;
  min-height: 44px; /* Minimum touch target size */
}

.nav-item.active {
  @apply text-indigo-200;
}

.nav-item.active::after {
  content: '';
  @apply absolute bottom-0 w-1/3 sm:w-1/2 h-1 bg-indigo-400 rounded-t-full;
  animation: fadeIn 0.3s ease-in-out;
}

.icon {
  @apply transition-transform duration-300 text-xl sm:text-2xl;
}

.nav-item.active .icon {
  @apply scale-110 text-white;
  animation: bounce 0.5s ease;
}

.nav-label {
  @apply text-xs transition-opacity duration-300 mt-0.5;
  font-size: 0.65rem;

  @screen sm {
    font-size: 0.75rem;
  }
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
