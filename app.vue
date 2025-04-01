<template>
  <div class="app-container" :class="themeClasses">
    <!-- Global notification system -->
    <NotificationsContainer />

    <!-- Main content with transition animations -->
    <NuxtPage />

    <!-- Global floating action buttons -->
    <div class="fab-container">
      <ThemeToggleButton />
      <ScrollToTopButton v-if="showScrollToTop" />
    </div>

    <!-- Celebration overlay (for confetti effects) -->
    <CelebrationOverlay v-if="showCelebration" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted } from 'vue'
import { usePocketBase } from './composables/api/usePocketBase'
import { useCelebration } from './composables/effects/useCelebration'
import { useScroll } from './composables/useScroll'

const router = useRouter()
const { pb } = usePocketBase()
const { showCelebration } = useCelebration()
const { isScrolled } = useScroll()

// Theme management
const colorMode = useColorMode()
const themeClasses = computed(() => ({
  'theme-light': colorMode.value === 'light',
  'theme-dark': colorMode.value === 'dark',
  'theme-system': colorMode.value === 'system'
}))

// Scroll to top button visibility
const showScrollToTop = ref(false)
watch(isScrolled, (val) => {
  showScrollToTop.value = val
})

// Handle auth changes
watch(() => pb.authStore.isValid, (isAuthenticated) => {
  if (!isAuthenticated && !['/login', '/signup'].includes(router.currentRoute.value.path)) {
    router.push('/login')
  }
})

// Initialize auth state
onMounted(async () => {
  // Load auth from cookie if available
  const cookie = useCookie('pb_auth')
  if (cookie.value) {
    pb.authStore.loadFromCookie(cookie.value)
  }

  // Refresh auth if expired
  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  } catch (err) {
    pb.authStore.clear()
  }

  // Setup global error handler
  window.addEventListener('unhandledrejection', handleGlobalError)
})

// Cleanup
onUnmounted(() => {
  window.removeEventListener('unhandledrejection', handleGlobalError)
})

// Global error handling
const handleGlobalError = (event: PromiseRejectionEvent) => {
  console.error('Unhandled promise rejection:', event.reason)
  // You could add a notification here
}
</script>

<style>
/* Base styles */
.app-container {
  @apply min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300;
}

.theme-dark .app-container {
  @apply bg-gray-900 text-gray-100;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Floating action buttons */
.fab-container {
  @apply fixed bottom-6 right-6 space-y-3 z-50;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-track {
  @apply bg-gray-200 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}

/* Selection styling */
::selection {
  @apply bg-primary-500/20 text-primary-600 dark:text-primary-400;
}

/* Focus styles */
:focus-visible {
  @apply outline-2 outline-offset-2 outline-primary-500;
}

/* Print styles */
@media print {
  .app-container {
    background: none !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
