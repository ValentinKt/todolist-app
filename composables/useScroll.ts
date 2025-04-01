import { onMounted, onUnmounted, ref } from 'vue'

export const useScroll = () => {
  const isScrolled = ref(false)
  const scrollPosition = ref(0)

  const checkScroll = () => {
    scrollPosition.value = window.scrollY || document.documentElement.scrollTop
    isScrolled.value = scrollPosition.value > 100
  }

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll)
    checkScroll() // Initialize
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
  })

  return {
    isScrolled,
    scrollPosition,
    scrollToTop
  }
}
