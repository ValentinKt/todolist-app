<template>
  <div class="empty-state">
    <div class="empty-icon">
      <Icon name="ph:clipboard-text" class="icon" />
    </div>
    <h3 class="empty-title">No tasks yet</h3>
    <p class="empty-text">Add your first task to get started!</p>
    <button @click="$emit('add-todo')" class="empty-button">
      <Icon name="ph:plus" class="button-icon" />
      Create Task
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits(['add-todo'])
</script>

<style scoped>
.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-icon {
  @apply p-6 rounded-full bg-gray-100 dark:bg-gray-700 mb-4;
}

.icon {
  @apply w-10 h-10 text-gray-400 dark:text-gray-500;
}

.empty-title {
  @apply text-xl font-semibold text-gray-800 dark:text-white mb-2;
}

.empty-text {
  @apply text-gray-500 dark:text-gray-400 mb-6 max-w-xs;
}

.empty-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg;
  @apply bg-primary-600 hover:bg-primary-700 text-white;
  @apply transition-colors duration-200;
}

.button-icon {
  @apply w-4 h-4;
}
</style>
