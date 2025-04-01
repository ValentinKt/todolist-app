<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div v-if="error" class="error-alert">
      <Icon name="ph:warning-circle" class="alert-icon" />
      <span>{{ error }}</span>
    </div>

    <div class="form-group">
      <label for="name" class="form-label">Full Name</label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        class="form-input"
        placeholder="Your Name"
        autocomplete="name"
        :disabled="isLoading"
      />
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
      <p v-if="emailError" class="field-error">{{ emailError }}</p>
    </div>

    <div class="form-group">
      <label for="password" class="form-label">Password</label>
      <div class="password-input-wrapper">
        <input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="form-input pr-10"
          placeholder="••••••••"
          autocomplete="new-password"
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
      <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
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
        autocomplete="new-password"
        :disabled="isLoading"
      />
    </div>

    <div class="terms-agreement">
      <label class="terms-label">
        <input type="checkbox" v-model="agreeToTerms" :disabled="isLoading" />
        <span>I agree to the <a href="/terms" class="terms-link">Terms of Service</a> and <a href="/privacy" class="terms-link">Privacy Policy</a></span>
      </label>
    </div>

    <button
      type="submit"
      class="submit-button"
      :disabled="isLoading || !isFormValid"
    >
      <span v-if="!isLoading">Create Account</span>
      <Icon v-else name="svg-spinners:90-ring-with-bg" class="w-5 h-5" />
    </button>

    <div class="auth-divider">
      <span>Or sign up with</span>
    </div>

    <div class="social-buttons">
      <button
        type="button"
        class="social-button"
        @click="handleSocialSignup('google')"
        :disabled="isLoading"
      >
        <Icon name="logos:google-icon" class="w-5 h-5" />
        <span>Google</span>
      </button>

      <button
        type="button"
        class="social-button"
        @click="handleSocialSignup('github')"
        :disabled="isLoading"
      >
        <Icon name="mdi:github" class="w-5 h-5" />
        <span>GitHub</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/composables/state/useAuthStore'
import { validateEmail, validatePassword } from '~/utils/validation'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading } = storeToRefs(authStore)

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const showPassword = ref(false)
const error = ref('')

// Validation errors
const emailError = ref('')
const passwordError = ref('')

// Validate email on change
watch(email, (newEmail) => {
  if (newEmail && !validateEmail(newEmail)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
})

// Validate password on change
watch(password, (newPassword) => {
  if (newPassword) {
    const validation = validatePassword(newPassword)
    passwordError.value = validation.valid ? '' : validation.message || ''
  } else {
    passwordError.value = ''
  }
})

// Form validation
const isFormValid = computed(() => {
  return (
    name.value.trim().length > 0 &&
    validateEmail(email.value) &&
    validatePassword(password.value).valid &&
    password.value === confirmPassword.value &&
    agreeToTerms.value
  )
})

// Form submission
const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    error.value = ''
    await authStore.signup({
      name: name.value,
      email: email.value,
      password: password.value
    })

    // Redirect to home page
    router.push('/')
  } catch (err: any) {
    // Extract error message
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'An error occurred during signup. Please try again.'
    }
    console.error('Signup error:', err)
  }
}

// Social signup handlers
const handleSocialSignup = async (provider: 'google' | 'github') => {
  try {
    await authStore.socialLogin(provider)
  } catch (err) {
    error.value = `Failed to sign up with ${provider}. Please try again.`
    console.error(`${provider} signup error:`, err)
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
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-normal;
}

.field-error {
  @apply text-xs text-red-500 dark:text-red-400 mt-1;
}

.password-input-wrapper {
  @apply relative;
}

.password-toggle {
  @apply absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400;
  @apply hover:text-gray-700 dark:hover:text-gray-300 transition-colors;
}

.terms-agreement {
  @apply flex items-center;
}

.terms-label {
  @apply flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 select-none;
}

.terms-label input {
  @apply mt-1;
}

.terms-link {
  @apply text-primary-600 dark:text-primary-400 hover:underline;
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
