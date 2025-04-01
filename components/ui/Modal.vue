<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-backdrop">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button @click="$emit('close')" class="modal-close">
              <Icon name="ph:x" class="w-5 h-5" />
            </button>
          </div>
          <div class="modal-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-backdrop {
  @apply fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4;
}

.modal-container {
  @apply w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden;
}

.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-lg font-semibold text-gray-800 dark:text-white;
}

.modal-close {
  @apply p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.modal-content {
  @apply p-6;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
