import { useSound } from '@vueuse/sound'

// Import sound files
import completeSound from '~/assets/sounds/complete.mp3'
import deleteSound from '~/assets/sounds/delete.mp3'
import notificationSound from '~/assets/sounds/notification.mp3'

export const useSoundEffects = () => {
  // Setup sound hooks with proper configuration
  const { play: playCompleteSound } = useSound(completeSound, {
    volume: 0.5,
    interrupt: true
  })

  const { play: playDeleteSound } = useSound(deleteSound, {
    volume: 0.4,
    interrupt: true
  })

  const { play: playNotificationSound } = useSound(notificationSound, {
    volume: 0.5,
    interrupt: true
  })

  // Return the play functions for use in components
  return {
    playCompleteSound,
    playDeleteSound,
    playNotificationSound
  }
}
