<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div v-if="error" class="error-alert">
      <Icon name="ph:warning-circle" class="alert-icon" />
      <span>{{ error }}</span>
    </div>

    <div class="form-group">
      <label for="email" class="form-label">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="form-input"
        placeholder="your@email.com"
        autocomplete="email"
        :disabled="isLoading"
      />
    </div>

    <div class="form-group">
      <label for="password" class="form-label">
        Password
        <NuxtLink to="/auth/reset-password" class="forgot-link">
          Forgot password?
        </NuxtLink>
      </label>
      <div class="password-input-wrapper">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="form-input pr-10"
          placeholder="••••••••"
          autocomplete="current-password"
          :disabled="isLoading"
        />
        <button
          type="button"
          class="password-toggle"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <Icon :name="showPassword ? 'ph:eye-slash' : 'ph:eye'" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="remember-me">
      <label class="remember-label">
        <input type="checkbox" v-model="rememberMe" :disabled="isLoading" />
        <span>Remember me</span>
      </label>
    </div>

    <button
      type="submit"
      class="submit-button"
      :disabled="isLoading || !isFormValid"
    >
      <span v-if="!isLoading">Sign In</span>
      <Icon v-else name="svg-spinners:90-ring-with-bg" class="w-5 h-5" />
    </button>

    <div class="auth-divider">
      <span>Or continue with</span>
    </div>

    <div class="social-buttons">
      <button
        type="button"
        class="social-button"
        @click="handleSocialLogin('google')"
        :disabled="isLoading"
      >
        <Icon name="logos:google-icon" class="w-5 h-5" />
        <span>Google</span>
      </button>

      <button
        type="button"
        class="social-button"
        @click="handleSocialLogin('github')"
        :disabled="isLoading"
      >
        <Icon name="mdi:github" class="w-5 h-5" />
        <span>GitHub</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/composables/state/useAuthStore'
import { validateEmail } from '~/utils/validation'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')

// Validation
const isFormValid = computed(() => {
  return validateEmail(email.value) && password.value.length >= 6
})

// Form submission
const handleSubmit = async () => {
  try {
    error.value = ''
    await authStore.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    })

    // Redirect to home page or previous route
    const redirectPath = router.currentRoute.value.query.redirect as string || '/'
    router.push(redirectPath)
  } catch (err: any) {
    // Extract error message
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'An error occurred during login. Please try again.'
    }
    console.error('Login error:', err)
  }
}

// Social login handlers
const handleSocialLogin = async (provider: 'google' | 'github') => {
  try {
    await authStore.socialLogin(provider)
  } catch (err) {
    error.value = `Failed to login with ${provider}. Please try again.`
    console.error(`${provider} login error:`, err)
  }
}
</script>

<style scoped>
.auth-form {
  @apply space-y-5;
}

.error-alert {
  @apply p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400;
  @apply flex items-center gap-2 text-sm;
}

.alert-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300;
}

.forgot-link {
  @apply text-primary-600 dark:text-primary-400 hover:underline text-xs font-normal;
}

.form-input {
  @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-normal;
}

.password-input-wrapper {
  @apply relative;
}

.password-toggle {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400;
  @apply hover:text-gray-700 dark:hover:text-gray-300 transition-colors;
}

.remember-me {
  @apply flex items-center;
}

.remember-label {
  @apply flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none;
}

.submit-button {
  @apply w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg;
  @apply hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500;
  @apply transition-normal flex items-center justify-center gap-2 text-sm font-medium;
  @apply disabled:opacity-70 disabled:cursor-not-allowed;
}

.auth-divider {
  @apply relative text-center text-xs text-gray-500 dark:text-gray-400;
}

.auth-divider::before,
.auth-divider::after {
  @apply absolute top-1/2 w-1/4 h-px bg-gray-300 dark:bg-gray-600;
  content: '';
}

.auth-divider::before {
  @apply left-0;
}

.auth-divider::after {
  @apply right-0;
}

.social-buttons {
  @apply grid grid-cols-2 gap-3;
}

.social-button {
  @apply flex items-center justify-center gap-2 px-4 py-2 rounded-lg;
  @apply border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700;
  @apply hover:bg-gray-50 dark:hover:bg-gray-600 transition-normal;
  @apply text-sm font-medium text-gray-700 dark:text-gray-300;
  @apply disabled:opacity-70 disabled:cursor-not-allowed;
}
</style>
