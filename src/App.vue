<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <RouterView />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.app-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}
</style>
