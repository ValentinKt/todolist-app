import { defineNuxtPlugin } from '#app'
import PocketBase from 'pocketbase'
import { useAuthStore } from '~/composables/state/useAuthStore'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const pb = new PocketBase(config.public.pocketbaseUrl)

  // Enable auto-refresh
  pb.autoCancellation(false)

  // Load stored auth data if available
  const authCookie = useCookie('pb_auth')
  if (authCookie.value) {
    pb.authStore.loadFromCookie(authCookie.value)
  }

  // Initialize auth store
  const authStore = useAuthStore()
  nuxtApp.hook('app:created', () => {
    authStore.init()
  })

  // Handle auth state changes
  pb.authStore.onChange((token, model) => {
    // Update cookie
    authCookie.value = pb.authStore.exportToCookie() || ''

    // Handle auth redirect
    if (!pb.authStore.isValid) {
      const route = useRoute()
      if (process.client && !['/auth/login', '/auth/signup'].includes(route.path)) {
        navigateTo('/auth/login')
      }
    }
  }, true)

  // Provide pocketbase instance to the app
  return {
    provide: {
      pb
    }
  }
})
