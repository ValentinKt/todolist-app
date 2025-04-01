// frontend/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const pb = usePocketBase()

  // Load auth from cookie
  const cookie = useCookie('pb_auth')
  if (cookie.value) pb.authStore.loadFromCookie(cookie.value)

  // Redirect logic
  if (!pb.authStore.isValid && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Refresh auth if expired
  try {
    if (pb.authStore.isValid) {
      await pb.collection('users').authRefresh()
    }
  } catch (err) {
    pb.authStore.clear()
    return navigateTo('/login')
  }
})
