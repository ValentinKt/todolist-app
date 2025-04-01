// frontend/composables/effects/useCelebration.ts
import { useSound } from '@vueuse/sound'
import { ref } from 'vue'
import celebrationSfx from './assets/sounds/celebration.mp3'

type CelebrationType = 'task-completed' | 'milestone' | 'streak' | 'all-completed'

export const useCelebration = () => {
  const showCelebration = ref(false)
  const celebrationType = ref<CelebrationType>('task-completed')
  const confettiCount = ref(20)
  const emojis = ['🎉', '✨', '🌟', '🎊', '🥳', '👏', '💯', '🔥', '🚀', '🌈']

  const { play: playCelebrationSound } = useSound(celebrationSfx, {
    volume: 0.6,
    interrupt: true
  })

  const triggerCelebration = (
    type: CelebrationType = 'task-completed',
    duration = 2500
  ) => {
    celebrationType.value = type

    // Configure based on celebration type
    switch (type) {
      case 'milestone':
        confettiCount.value = 50
        break
      case 'streak':
        confettiCount.value = 75
        break
      case 'all-completed':
        confettiCount.value = 100
        break
      default:
        confettiCount.value = 30
    }

    // Visual celebration
    showCelebration.value = true
    playCelebrationSound()

    // Auto-hide after duration
    setTimeout(() => {
      showCelebration.value = false
    }, duration)
  }

  const getConfettiStyles = (index: number) => {
    const rotation = Math.random() * 360
    const delay = Math.random() * 0.5
    const duration = 1 + Math.random() * 2
    const xStart = Math.random() * 100
    const xEnd = xStart + (Math.random() * 20 - 10) // Slight horizontal movement

    return {
      '--rotation': `${rotation}deg`,
      '--delay': `${delay}s`,
      '--duration': `${duration}s`,
      '--x-start': `${xStart}vw`,
      '--x-end': `${xEnd}vw`,
      '--emoji': emojis[index % emojis.length]
    }
  }

  return {
    showCelebration,
    celebrationType,
    confettiCount,
    triggerCelebration,
    getConfettiStyles
  }
}
