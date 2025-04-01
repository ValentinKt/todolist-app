import type { Ref } from 'vue'
import { ref } from 'vue'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface Notification {
  id: number
  type: NotificationType
  title?: string
  message: string
  timeout?: number
}

const notifications: Ref<Notification[]> = ref([])
let idCounter = 0

export const useNotification = () => {
  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = ++idCounter
    const timeout = notification.timeout ?? (notification.type === 'error' ? 8000 : 5000)

    const newNotification: Notification = {
      id,
      ...notification
    }

    notifications.value.push(newNotification)

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }

    return id
  }

  const clearAll = () => {
    notifications.value = []
  }

  // Convenience methods
  const notify = {
    success: (message: string, title?: string, timeout?: number) =>
      addNotification({ type: 'success', message, title, timeout }),
    error: (message: string, title?: string, timeout?: number) =>
      addNotification({ type: 'error', message, title, timeout }),
    warning: (message: string, title?: string, timeout?: number) =>
      addNotification({ type: 'warning', message, title, timeout }),
    info: (message: string, title?: string, timeout?: number) =>
      addNotification({ type: 'info', message, title, timeout })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    notify
  }
}
