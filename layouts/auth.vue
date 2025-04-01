<template>
  <div class="auth-layout" :class="themeClasses">
    <div class="auth-container">
      <div class="auth-branding">
        <img src="/logo.svg" alt="TodoList App" class="logo" />
        <h1 class="app-name">TodoList App</h1>
        <p class="app-tagline">Organize your life, one task at a time</p>
      </div>

      <div class="auth-card">
        <slot />

        <div class="auth-footer">
          <p class="footer-text">
            {{ footerText }}
            <NuxtLink :to="footerLinkPath" class="footer-link">
              {{ footerLinkText }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <div class="theme-toggle-container">
        <ThemeToggleButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Theme management
const colorMode = useColorMode()
const themeClasses = computed(() => ({
  'theme-light': colorMode.value === 'light',
  'theme-dark': colorMode.value === 'dark',
  'theme-system': colorMode.value === 'system'
}))

// Dynamic footer text based on current route
const isLoginPage = computed(() => route.path === '/auth/login')
const footerText = computed(() => isLoginPage.value ? "Don't have an account?" : "Already have an account?")
const footerLinkText = computed(() => isLoginPage.value ? "Sign up" : "Sign in")
const footerLinkPath = computed(() => isLoginPage.value ? "/auth/signup" : "/auth/login")
</script>

<style scoped>
.auth-layout {
  @apply min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900;
  @apply transition-colors duration-300 p-4;
}

.auth-container {
  @apply w-full max-w-md relative;
}

.auth-branding {
  @apply mb-6 text-center;
}

.logo {
  @apply h-16 w-16 mx-auto mb-3;
}

.app-name {
  @apply text-2xl font-bold mb-1 text-gray-900 dark:text-white;
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600;
}

.app-tagline {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.auth-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8;
  @apply transition-colors duration-300;
}

.auth-footer {
  @apply mt-6 text-center;
}

.footer-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.footer-link {
  @apply font-medium text-primary-600 dark:text-primary-400 hover:underline;
}

.theme-toggle-container {
  @apply absolute top-4 right-4;
}

/* Animation for the card */
.auth-card {
  animation: fade-up 0.5s ease-out;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
