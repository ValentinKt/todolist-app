<template>
  <div class="layout-default" :class="themeClasses">
    <!-- Header navigation -->
    <header class="header">
      <nav class="navbar">
        <NuxtLink to="/" class="logo">
          <img src="/logo.svg" alt="TodoList App" class="logo-icon" />
          <span class="logo-text">TodoList</span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">
            <Icon name="ph:house" class="link-icon" />
            <span class="link-text">Home</span>
          </NuxtLink>

          <NuxtLink to="/settings" class="nav-link">
            <Icon name="ph:gear" class="link-icon" />
            <span class="link-text">Settings</span>
          </NuxtLink>
        </div>

        <div class="nav-actions">
          <ThemeToggleButton />

          <button @click="handleLogout" class="logout-button">
            <Icon name="ph:sign-out" class="button-icon" />
            <span class="button-text">Logout</span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} TodoList App. All rights reserved.
        </p>
        <div class="footer-links">
          <a href="/terms" class="footer-link">Terms</a>
          <a href="/privacy" class="footer-link">Privacy</a>
          <a href="https://github.com/valentinkt/todolist-app" target="_blank" class="footer-link">
            <Icon name="mdi:github" class="link-icon" /> GitHub
          </a>
        </div>
      </div>
    </footer>

    <!-- Global components -->
    <ScrollToTopButton v-if="showScrollToTop" />
    <NotificationsContainer />
  </div>
</template>

<script setup lang="ts">
import { usePocketBase } from '~/composables/api/usePocketBase'
import { useScroll } from '~/composables/useScroll'
import { useAuthStore } from '~/composables/state/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const { isScrolled } = useScroll()

// Theme management
const colorMode = useColorMode()
const themeClasses = computed(() => ({
  'theme-light': colorMode.value === 'light',
  'theme-dark': colorMode.value === 'dark',
  'theme-system': colorMode.value === 'system'
}))

// Scroll to top button visibility
const showScrollToTop = computed(() => isScrolled.value)

// Logout handling
const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.layout-default {
  @apply min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900;
}

.header {
  @apply sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm;
  @apply transition-colors duration-300;
}

.navbar {
  @apply container mx-auto px-4 py-3 flex items-center justify-between;
}

.logo {
  @apply flex items-center gap-2 text-gray-900 dark:text-white;
}

.logo-icon {
  @apply h-8 w-8;
}

.logo-text {
  @apply text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600;
}

.nav-links {
  @apply hidden md:flex items-center space-x-2;
}

.nav-link {
  @apply flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium;
  @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

.link-icon, .button-icon {
  @apply w-5 h-5;
}

.nav-actions {
  @apply flex items-center space-x-2;
}

.logout-button {
  @apply flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium;
  @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

.button-text {
  @apply hidden sm:inline;
}

.main-content {
  @apply flex-1 container mx-auto px-4 py-6;
}

.footer {
  @apply mt-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700;
  @apply transition-colors duration-300;
}

.footer-content {
  @apply container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between;
}

.copyright {
  @apply text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-0;
}

.footer-links {
  @apply flex items-center space-x-4;
}

.footer-link {
  @apply flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400;
  @apply hover:text-gray-700 dark:hover:text-gray-300 transition-colors;
}
</style>
