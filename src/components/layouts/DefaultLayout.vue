<template>
  <div class="layout-container">
    <!-- Space background component -->
     <SpaceBackground />

    <!-- Main content area -->
    <div class="content-area">
      <slot></slot>
    </div>

    <!-- Bottom navigation -->
    <BottomNavigation />
  </div>
</template>

<script setup lang="ts">
import SpaceBackground from '@/components/organisms/SpaceBackground.vue'
import BottomNavigation from '@/components/organisms/BottomNavigation.vue'
</script>

<style scoped>
.layout-container {
  @apply min-h-screen w-full relative;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.content-area {
  @apply w-full pb-14 sm:pb-16;
  /* For iOS momentum scrolling */
  -webkit-overflow-scrolling: touch;
}
</style>
