// frontend/composables/state/useAuthStore.ts
import { defineStore } from 'pinia'
import { usePocketBase } from '../api/usePocketBase'

export const useAuthStore   = defineStore('auth', () => {
  const { pb } = usePocketBase()
  const user = ref(pb.authStore.model)
  const isAuthenticated = computed(() => pb.authStore.isValid)


  const login = async (email: string, password: string) => {
    try {
      await pb.collection('users').authWithPassword(email, password)
      user.value = pb.authStore.model
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password
      })
      return login(email, password)
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = () => {
    pb.authStore.clear()
    user.value = null
  }

  // Initialize auth state
  const init = () => {
    pb.authStore.onChange(() => {
      user.value = pb.authStore.model
    }, true)
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    init
  }
})
