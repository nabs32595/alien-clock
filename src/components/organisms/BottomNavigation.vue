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
      <span>Clock</span>
    </router-link>

    <router-link to="/alarm" class="nav-item" :class="{ active: isActive('alarm').value }">
      <div class="icon">🔔</div>
      <span>Alarm</span>
    </router-link>

    <router-link to="/settings" class="nav-item" :class="{ active: isActive('settings').value }">
      <div class="icon">⚙️</div>
      <span>Settings</span>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  @apply fixed bottom-4 left-8 right-8 h-16 bg-indigo-950/90 backdrop-blur-md flex justify-around items-center z-50 border-t border-indigo-800 rounded-2xl shadow-lg;
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
  @apply mb-1 transition-transform duration-300 text-2xl;
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
