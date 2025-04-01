<template>
  <div class="error-page">
    <div class="error-content">
      <!-- Animated error icon with proper conditional rendering -->
      <div class="error-icon" :class="{ 'pulse-animation': !is404 }">
        <Icon v-if="is404" name="ph:compass" class="icon" />
        <Icon v-else-if="isServerError" name="ph:server" class="icon" />
        <Icon v-else-if="isAuthError" name="ph:lock" class="icon" />
        <Icon v-else name="ph:warning-octagon" class="icon" />
      </div>

      <!-- Error details with proper error ref access -->
      <h1 class="error-code">{{ error?.statusCode || 'Error' }}</h1>
      <h2 class="error-title">{{ errorMessage }}</h2>
      <p class="error-description">{{ errorDescription }}</p>

      <!-- Technical details for developers (collapsible) -->
      <div v-if="error?.stack && showDetails" class="error-details">
        <pre>{{ formatErrorDetails() }}</pre>
      </div>

      <!-- Error reporting form -->
      <div v-if="showReportForm" class="error-report-form">
        <h3 class="report-title">Report this issue</h3>
        <p class="report-description">Help us improve by describing what you were trying to do:</p>

        <textarea
          v-model="reportDescription"
          class="report-input"
          placeholder="I was trying to..."
          rows="3"
        ></textarea>

        <div class="report-actions">
          <button
            @click="submitErrorReport"
            class="report-button"
            :disabled="isSubmitting"
          >
            <Icon v-if="!isSubmitting" name="ph:paper-plane-right" class="button-icon" />
            <Icon v-else name="svg-spinners:90-ring-with-bg" class="button-icon spinner" />
            {{ isSubmitting ? 'Sending...' : 'Send Report' }}
          </button>
          <button @click="showReportForm = false" class="cancel-button">
            Cancel
          </button>
        </div>

        <div v-if="reportSuccess" class="report-success">
          <Icon name="ph:check-circle" class="success-icon" />
          Thank you for your report! We'll look into this issue.
        </div>
      </div>

      <!-- Action buttons -->
      <div class="error-actions">
        <button @click="handleRetry" class="retry-button">
          <Icon name="ph:arrow-clockwise" class="button-icon" />
          Try Again
        </button>

        <button @click="navigateHome" class="home-button">
          <Icon name="ph:house" class="button-icon" />
          Go Home
        </button>
      </div>

      <!-- Additional helper actions -->
      <div class="helper-actions">
        <button @click="toggleDetails" class="helper-button">
          <Icon :name="showDetails ? 'ph:eye-slash' : 'ph:eye'" class="helper-icon" />
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>

        <button v-if="!showReportForm && !reportSuccess" @click="showReportForm = true" class="helper-button">
          <Icon name="ph:flag" class="helper-icon" />
          Report Issue
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

// Define error prop type correctly
interface ErrorObject {
  statusCode?: number
  statusMessage?: string
  message?: string
  stack?: string
  url?: string
  data?: any
}

// Get the error with proper typing
const props = defineProps<{
  error: ErrorObject
}>()

const router = useRouter()
const route = useRoute()

// State for error reporting and details
const showDetails = ref(false)
const showReportForm = ref(false)
const reportDescription = ref('')
const isSubmitting = ref(false)
const reportSuccess = ref(false)

// Computed properties for error type determination
const is404 = computed(() => props.error?.statusCode === 404)
const isServerError = computed(() => props.error?.statusCode && props.error.statusCode >= 500)
const isAuthError = computed(() =>
  props.error?.statusCode === 401 || props.error?.statusCode === 403
)

// Enhanced error message with more detailed feedback
const errorMessage = computed(() => {
  if (is404.value) {
    return 'Page Not Found'
  }
  if (isServerError.value) {
    return 'Server Error'
  }
  if (isAuthError.value) {
    return props.error?.statusCode === 401
      ? 'Authentication Required'
      : 'Access Denied'
  }
  return props.error?.message || 'Something went wrong'
})

// More user-friendly error descriptions
const errorDescription = computed(() => {
  if (is404.value) {
    return "We couldn't find the page you're looking for. The page may have been moved or deleted."
  }

  switch (props.error?.statusCode) {
    case 401:
      return 'You need to be logged in to access this page. Please sign in and try again.'
    case 403:
      return 'You don\'t have permission to access this resource. Please contact your administrator if you believe this is an error.'
    case 500:
      return 'Our server encountered an error while processing your request. Our team has been notified and is working to fix the issue.'
    case 502:
      return 'We\'re having trouble communicating with our servers. This might be due to maintenance or a temporary outage.'
    case 503:
      return 'Our service is temporarily unavailable. This is usually due to maintenance or high traffic. Please try again later.'
    case 504:
      return 'The server took too long to respond. This might be due to network issues or high server load.'
    default:
      return 'An unexpected error occurred. Please try again later or contact support if the problem persists.'
  }
})

// Format error details for developers
const formatErrorDetails = () => {
  const details = [
    `Error: ${props.error?.message || 'Unknown error'}`,
    `Status: ${props.error?.statusCode || 'N/A'}`,
    `URL: ${props.error?.url || route.fullPath}`,
    `Time: ${new Date().toISOString()}`
  ]

  if (props.error?.stack) {
    details.push('\nStack Trace:')
    details.push(props.error.stack)
  }

  return details.join('\n')
}

// Toggle technical details visibility
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

// Submit error report to your backend/analytics service
const submitErrorReport = async () => {
  try {
    isSubmitting.value = true

    // Collect error information
    const reportData = {
      errorInfo: {
        statusCode: props.error?.statusCode,
        message: props.error?.message,
        url: route.fullPath,
        timestamp: new Date().toISOString()
      },
      userDescription: reportDescription.value,
      userAgent: navigator.userAgent,
      // Add other useful context you might want to collect
      referrer: document.referrer
    }

    // Simulating API call - replace with actual implementation
    // You would typically send this to your backend or a service like Sentry
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo purposes - log to console
    console.log('Error report submitted:', reportData)

    // Show success message
    reportSuccess.value = true
    showReportForm.value = false
    reportDescription.value = ''

  } catch (err) {
    console.error('Failed to submit error report:', err)
  } finally {
    isSubmitting.value = false
  }
}

// Handle retry action with correct implementation
const handleRetry = () => {
  // Check if we have the current route
  if (route && route.fullPath) {
    clearError({ redirect: route.fullPath })
  } else {
    // Fallback to refreshing the page
    window.location.reload()
  }
}

// Navigate to home page with improved implementation
const navigateHome = () => {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(249, 250, 251);
  padding: 1rem;
}

:global(.dark) .error-page {
  background-color: rgb(17, 24, 39);
}

.error-content {
  max-width: 32rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  border-radius: 9999px;
  background-color: rgba(254, 226, 226, 0.5);
}

:global(.dark) .error-icon {
  background-color: rgba(153, 27, 27, 0.2);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.icon {
  width: 4rem;
  height: 4rem;
  color: rgb(239, 68, 68);
}

:global(.dark) .icon {
  color: rgb(248, 113, 113);
}

.error-code {
  font-size: 3.75rem;
  font-weight: 700;
  color: rgb(31, 41, 55);
  margin-bottom: 0.5rem;
}

:global(.dark) .error-code {
  color: rgb(255, 255, 255);
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(31, 41, 55);
  margin-bottom: 1rem;
}

:global(.dark) .error-title {
  color: rgb(255, 255, 255);
}

.error-description {
  color: rgb(75, 85, 99);
  margin-bottom: 2rem;
  max-width: 28rem;
}

:global(.dark) .error-description {
  color: rgb(156, 163, 175);
}

.error-details {
  background-color: rgb(243, 244, 246);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: left;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  color: rgb(55, 65, 81);
}

:global(.dark) .error-details {
  background-color: rgb(31, 41, 55);
  color: rgb(209, 213, 219);
}

.error-details pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.error-report-form {
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

:global(.dark) .error-report-form {
  background-color: rgb(31, 41, 55);
}

.report-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgb(31, 41, 55);
}

:global(.dark) .report-title {
  color: rgb(255, 255, 255);
}

.report-description {
  font-size: 0.875rem;
  color: rgb(75, 85, 99);
  margin-bottom: 0.75rem;
}

:global(.dark) .report-description {
  color: rgb(156, 163, 175);
}

.report-input {
  width: 100%;
  border: 1px solid rgb(209, 213, 219);
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  background-color: white;
  color: rgb(31, 41, 55);
  resize: vertical;
}

:global(.dark) .report-input {
  background-color: rgb(55, 65, 81);
  border-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.report-input:focus {
  border-color: rgb(59, 130, 246);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

:global(.dark) .report-input:focus {
  border-color: rgb(96, 165, 250);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

.report-actions {
  display: flex;
  gap: 0.75rem;
}

.report-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgb(59, 130, 246);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.report-button:hover:not(:disabled) {
  background-color: rgb(37, 99, 235);
}

.report-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: rgb(229, 231, 235);
  color: rgb(55, 65, 81);
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

:global(.dark) .cancel-button {
  background-color: rgb(75, 85, 99);
  color: rgb(229, 231, 235);
}

.cancel-button:hover {
  background-color: rgb(209, 213, 219);
}

:global(.dark) .cancel-button:hover {
  background-color: rgb(107, 114, 128);
}

.report-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: rgb(220, 252, 231);
  color: rgb(22, 101, 52);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-top: 1rem;
}

:global(.dark) .report-success {
  background-color: rgba(22, 101, 52, 0.2);
  color: rgb(134, 239, 172);
}

.success-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .error-actions {
    flex-direction: row;
  }
}

.retry-button, .home-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
}

.retry-button {
  background-color: rgb(37, 99, 235);
  color: white;
}

.retry-button:hover {
  background-color: rgb(29, 78, 216);
}

.retry-button:focus {
  ring: 2px;
  ring-offset: 2px;
  ring-color: rgb(37, 99, 235);
}

.home-button {
  background-color: rgb(229, 231, 235);
  color: rgb(31, 41, 55);
}

:global(.dark) .home-button {
  background-color: rgb(55, 65, 81);
  color: rgb(229, 231, 235);
}

.home-button:hover {
  background-color: rgb(209, 213, 219);
}

:global(.dark) .home-button:hover {
  background-color: rgb(75, 85, 99);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.helper-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.helper-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: rgb(107, 114, 128);
  background-color: transparent;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

:global(.dark) .helper-button {
  color: rgb(156, 163, 175);
}

.helper-button:hover {
  background-color: rgb(243, 244, 246);
  color: rgb(55, 65, 81);
}

:global(.dark) .helper-button:hover {
  background-color: rgb(55, 65, 81);
  color: rgb(209, 213, 219);
}

.helper-icon {
  width: 1rem;
  height: 1rem;
}
</style>
