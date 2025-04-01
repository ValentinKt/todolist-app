<template>
  <Transition name="fade">
    <div v-if="showCelebration" class="confetti-container">
      <div
        v-for="i in confettiCount"
        :key="i"
        class="confetti-particle"
        :style="getConfettiStyles(i)"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCelebration } from '~/composables/effects/useCelebration'

const {
  showCelebration,
  confettiCount,
  getConfettiStyles
} = useCelebration()
</script>

<style scoped>
.confetti-container {
  @apply fixed inset-0 pointer-events-none z-50 overflow-hidden;
}

.confetti-particle {
  @apply absolute top-0 left-[var(--x-start)];
  @apply text-xl opacity-90 z-50 pointer-events-none;
  animation: confetti-fall var(--duration) ease-out var(--delay) forwards;
  transform: rotate(var(--rotation));
}

.confetti-particle::before {
  content: var(--emoji);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-20vh) rotate(var(--rotation));
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(calc(var(--rotation) * 2));
    opacity: 0;
    left: var(--x-end);
  }
}
</style>