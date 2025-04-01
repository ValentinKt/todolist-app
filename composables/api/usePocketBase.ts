// frontend/composables/api/usePocketBase.ts
import type { CookieRef } from '#app'
import { navigateTo, useCookie, useRuntimeConfig } from '#imports'
import PocketBase from 'pocketbase'
import type { User } from './types/types'

export const usePocketBase = () => {
  const config = useRuntimeConfig()
  const pb = new PocketBase()
  const authCookie: CookieRef<string> = useCookie('pb_auth', {
    secure: true,
    sameSite: 'strict',
    maxAge: 604800 // 1 week
  })

  // Enable auto-refresh and configure client
  pb.autoCancellation(false)

  // pb.autoRefresh = true

  // Initialize from cookie if available
  if (authCookie.value) {
    pb.authStore.loadFromCookie(authCookie.value)
  }

  // Handle auth state changes
  pb.authStore.onChange((token, model) => {
    authCookie.value = token || ''

    if (!pb.authStore.isValid) {
      // Redirect to login if token becomes invalid
      if (pb.client && !['/login', '/signup'].includes(window.location.pathname)) {
        navigateTo('/login')
      }
    }
  }, true)

  // Custom methods
  const getFileUrl = (collection: string, id: string, filename: string): string => {
    return pb.files.getUrl(collection, id, filename)
  }

  const getCurrentUser = (): User | null => {
    return pb.authStore.model as User | null
  }

  const refreshAuth = async (): Promise<void> => {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh()
      }
    } catch (err) {
      pb.authStore.clear()
      throw err
    }
  }

  const logout = (): void => {
    pb.authStore.clear()
    navigateTo('/login')
  }

  return {
    pb,
    getFileUrl,
    getCurrentUser,
    refreshAuth,
    logout,
    // Expose auth state for reactivity
    authStore: pb.authStore,
    user: computed(() => pb.authStore.model as User | null)
  }
}
