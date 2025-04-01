<template>
  <div class="notifications-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-${notification.type}`"
      >
        <Icon :name="notificationIcon(notification.type)" class="icon" />
        <div class="content">
          <h4 v-if="notification.title" class="title">
            {{ notification.title }}
          </h4>
          <p class="message">{{ notification.message }}</p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="close-button"
          aria-label="Close notification"
        >
          <Icon name="ph:x" class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from './composables/useNotification'

const { notifications, removeNotification } = useNotification()

const notificationIcon = (type: string) => {
  const icons = {
    success: 'ph:check-circle',
    error: 'ph:warning-circle',
    info: 'ph:info',
    warning: 'ph:warning'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.notifications-container {
  @apply fixed top-4 right-4 z-[1000] space-y-3 w-full max-w-xs;
}

.notification {
  @apply relative flex items-start gap-3 p-4 pr-8 rounded-lg shadow-lg;
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300;
}

.notification-success {
  @apply border-green-500/30 bg-green-50/80 dark:bg-green-900/20;
}

.notification-error {
  @apply border-red-500/30 bg-red-50/80 dark:bg-red-900/20;
}

.notification-info {
  @apply border-blue-500/30 bg-blue-50/80 dark:bg-blue-900/20;
}

.notification-warning {
  @apply border-yellow-500/30 bg-yellow-50/80 dark:bg-yellow-900/20;
}

.icon {
  @apply w-5 h-5 mt-0.5 flex-shrink-0;
}

.notification-success .icon {
  @apply text-green-600 dark:text-green-400;
}

.notification-error .icon {
  @apply text-red-600 dark:text-red-400;
}

.notification-info .icon {
  @apply text-blue-600 dark:text-blue-400;
}

.notification-warning .icon {
  @apply text-yellow-600 dark:text-yellow-400;
}

.content {
  @apply flex-1;
}

.title {
  @apply font-medium text-sm mb-1;
}

.message {
  @apply text-sm text-gray-700 dark:text-gray-300;
}

.close-button {
  @apply absolute top-2 right-2 p-1 rounded-full;
  @apply hover:bg-black/10 dark:hover:bg-white/10 transition-colors;
}

.notification-enter-from,
.notification-leave-to {
  @apply opacity-0 translate-x-10;
}

.notification-leave-active {
  @apply absolute;
}

.notification-move {
  @apply transition-transform duration-300;
}
</style>
