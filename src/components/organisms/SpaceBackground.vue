<template>
  <div class="space-background">
    <!-- Stars -->
    <div
      v-for="(star, index) in stars"
      :key="`star-${index}`"
      class="star"
      :style="{
        left: `${star.x}px`,
        top: `${star.y}px`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        opacity: star.opacity,
      }"
    ></div>

    <!-- Comets -->
    <div
      v-for="(comet, index) in comets"
      :key="`comet-${index}`"
      class="comet"
      :style="{
        left: `${comet.x}px`,
        top: `${comet.y}px`,
        width: `${comet.size}px`,
        height: `${comet.size}px`,
        boxShadow: `0 0 ${comet.trail}px ${comet.trail / 8}px rgba(255, 255, 255, 0.8)`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
}

interface Comet {
  x: number
  y: number
  size: number
  angle: number
  speed: number
  trail: number
}

// Props for customization
interface Props {
  starDensity?: number // stars per 1000px²
  cometFrequency?: number // 0-1 chance per frame
}

const props = withDefaults(defineProps<Props>(), {
  starDensity: 0.33, // Default: 1 star per 3000px²
  cometFrequency: 0.01, // Default: 1% chance per frame
})

// Background elements
const stars = ref<Star[]>([])
const comets = ref<Comet[]>([])

// Size tracking
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

// Animation frame
const animationFrameId = ref<number | null>(null)

// Generate stars for background
const generateStars = () => {
  stars.value = []
  const starCount = Math.floor((width.value * height.value * props.starDensity) / 1000)

  for (let i = 0; i < starCount; i++) {
    stars.value.push({
      x: Math.random() * width.value,
      y: Math.random() * height.value,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1,
    })
  }
}

// Generate occasional comets
const generateComet = () => {
  if (comets.value.length < 3 && Math.random() < props.cometFrequency) {
    comets.value.push({
      x: Math.random() * width.value,
      y: 0,
      size: Math.random() * 2 + 1,
      angle: Math.PI / 4 + (Math.random() * Math.PI) / 4,
      speed: Math.random() * 3 + 2,
      trail: Math.random() * 100 + 50,
    })
  }
}

// Animate background elements
const animateBackground = () => {
  // Update stars (twinkle effect)
  stars.value.forEach((star) => {
    star.opacity = 0.3 + (Math.sin(Date.now() * 0.001 * star.twinkleSpeed) + 1) * 0.35
  })

  // Update comets
  comets.value.forEach((comet, index) => {
    comet.x += Math.cos(comet.angle) * comet.speed
    comet.y += Math.sin(comet.angle) * comet.speed

    // Remove comets that go offscreen
    if (comet.x > width.value || comet.y > height.value) {
      comets.value.splice(index, 1)
    }
  })

  // Generate new comets randomly
  generateComet()

  // Continue animation loop
  animationFrameId.value = requestAnimationFrame(animateBackground)
}

// Handle window resize
const handleResize = () => {
  width.value = window.innerWidth
  height.value = window.innerHeight
  generateStars()
}

// Watch for prop changes
watch(() => props.starDensity, generateStars)

// Start animations on mount
onMounted(() => {
  // Generate initial elements
  generateStars()

  // Start animation loop
  animateBackground()

  // Handle window resize
  window.addEventListener('resize', handleResize)
})

// Clean up on unmount
onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.space-background {
  @apply absolute inset-0 overflow-hidden;
  z-index: 0;
}

.star {
  @apply absolute rounded-full bg-white pointer-events-none;
}

.comet {
  @apply absolute rounded-full bg-white pointer-events-none;
}
</style>
