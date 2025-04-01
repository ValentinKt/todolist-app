<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Get started with your task management</p>

      <form @submit.prevent="handleSignup" class="auth-form">
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
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            class="form-input"
            placeholder="••••••••"
            minlength="8"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="isLoading || password !== confirmPassword"
        >
          <span v-if="!isLoading">Sign Up</span>
          <Icon v-else name="svg-spinners:90-ring-with-bg" class="w-5 h-5" />
        </button>
      </form>

      <div class="auth-footer">
        <p class="footer-text">
          Already have an account?
          <NuxtLink to="/auth/login" class="footer-link">Sign in</NuxtLink>
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
const confirmPassword = ref('')
const error = ref('')

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    error.value = ''
    await authStore.signup(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = 'Failed to create account. Please try again.'
    console.error('Signup error:', err)
  }
}
</script>

<style scoped>
/* Reuses the same styles as login.vue */
.error-message {
  @apply text-sm text-red-500 dark:text-red-400 mt-2;
}

.submit-button:disabled {
  @apply opacity-70 cursor-not-allowed;
}
</style>