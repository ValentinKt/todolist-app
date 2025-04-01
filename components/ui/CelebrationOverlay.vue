<template>
  <div class="celebration-overlay">
    <div class="particles">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :style="particle.style"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCelebration } from './composables/useCelebration'

const { showCelebration } = useCelebration()
const particles = ref<any[]>([])

watch(showCelebration, (val) => {
  if (val) {
    createParticles()
    setTimeout(() => {
      particles.value = []
    }, 2000)
  }
})

const createParticles = () => {
  particles.value = Array.from({ length: 50 }, (_, i) => ({
    style: {
      '--x': `${Math.random() * 100}vw`,
      '--y': `${Math.random() * 100}vh`,
      '--size': `${Math.random() * 0.5 + 0.5}rem`,
      '--duration': `${Math.random() * 1 + 1}s`,
      '--delay': `${Math.random() * 0.5}s`,
      '--color': `hsl(${Math.random() * 360}, 100%, 70%)`
    }
  }))
}
</script>

<style scoped>
.celebration-overlay {
  @apply fixed inset-0 pointer-events-none z-[999];
}

.particle {
  @apply absolute rounded-full;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background-color: var(--color);
  animation: float-up var(--duration) ease-out var(--delay) forwards;
  transform: translateY(0);
  opacity: 0.8;
}

@keyframes float-up {
  to {
    transform: translateY(-100vh);
    opacity: 0;
  }
}
</style>
