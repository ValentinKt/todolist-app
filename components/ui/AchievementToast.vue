<template>
  <Transition name="toast">
    <div
      v-if="achievement"
      class="achievement-toast"
      :class="toastClasses"
    >
      <div class="icon-container">
        <Icon :name="achievementIcon" class="icon" />
        <div class="level-badge" v-if="achievement.level">
          Lvl {{ achievement.level }}
        </div>
      </div>

      <div class="content">
        <h3 class="title">{{ achievement.title }}</h3>
        <p class="message">{{ achievement.message }}</p>
      </div>

      <button
        @click="$emit('close')"
        class="close-button"
        aria-label="Close achievement toast"
      >
        <Icon name="ph:x" class="w-5 h-5" />
      </button>

      <div class="progress-bar" v-if="achievement.progress">
        <div
          class="progress-fill"
          :style="{ width: `${achievement.progress}%` }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { TodoAchievement } from './types'

const props = defineProps({
  achievement: {
    type: Object as () => TodoAchievement | null,
    default: null
  }
})

defineEmits(['close'])

const achievementIcons = {
  milestone: 'ph:trophy',
  streak: 'ph:flame',
  productivity: 'ph:rocket',
  completion: 'ph:check-circle'
}

const achievementColors = {
  milestone: 'bg-gradient-to-r from-yellow-500 to-amber-600',
  streak: 'bg-gradient-to-r from-orange-500 to-red-600',
  productivity: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  completion: 'bg-gradient-to-r from-green-500 to-teal-600'
}

const achievementIcon = computed(() =>
  achievementIcons[props.achievement?.type || 'milestone']
)

const toastClasses = computed(() =>
  achievementColors[props.achievement?.type || 'milestone']
)
</script>

<style scoped>
.achievement-toast {
  @apply fixed bottom-6 right-6 max-w-sm w-full sm:w-96 p-4 rounded-xl shadow-xl;
  @apply text-white z-[100] overflow-hidden;
  @apply flex items-start gap-3;
}

.icon-container {
  @apply relative flex-shrink-0;
}

.icon {
  @apply w-8 h-8;
}

.level-badge {
  @apply absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full text-xs font-bold;
  @apply bg-white text-gray-900;
}

.content {
  @apply flex-1;
}

.title {
  @apply font-bold text-lg leading-tight;
}

.message {
  @apply text-sm opacity-90 mt-1;
}

.close-button {
  @apply p-1 rounded-full hover:bg-white/10 transition-colors;
}

.progress-bar {
  @apply absolute bottom-0 left-0 right-0 h-1 bg-black/10;
}

.progress-fill {
  @apply h-full bg-white/80;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(50%);
}

/* Animation for new achievements */
@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.achievement-toast {
  animation: pulse-glow 2s ease-out;
}
</style>
