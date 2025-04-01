<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Sign in to manage your tasks</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="form-input"
            placeholder="your@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Sign In</span>
          <Icon v-else name="svg-spinners:90-ring-with-bg" class="w-5 h-5" />
        </button>
      </form>

      <div class="auth-footer">
        <p class="footer-text">
          Don't have an account?
          <NuxtLink to="/auth/signup" class="footer-link">Sign up</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password. Please try again.'
    console.error('Login error:', err)
  }
}
</script>

<style scoped>
.auth-page {
  @apply min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4;
}

.auth-container {
  @apply w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8;
}

.auth-title {
  @apply text-2xl font-bold text-center text-gray-800 dark:text-white mb-2;
}

.auth-subtitle {
  @apply text-center text-gray-600 dark:text-gray-400 mb-6;
}

.auth-form {
  @apply space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-normal;
}

.submit-button {
  @apply w-full px-4 py-2 bg-primary-600 text-white rounded-lg;
  @apply hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500;
  @apply transition-normal flex items-center justify-center gap-2;
  @apply disabled:opacity-70 disabled:cursor-not-allowed;
}

.auth-footer {
  @apply mt-6 text-center;
}

.footer-text {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.footer-link {
  @apply text-primary-600 dark:text-primary-400 hover:underline;
}
</style>