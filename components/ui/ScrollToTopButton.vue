<template>
  <button
    @click="scrollToTop"
    class="scroll-to-top"
    aria-label="Scroll to top"
  >
    <Icon name="ph:arrow-up" class="icon" />
  </button>
</template>

<script setup lang="ts">
const { scrollToTop } = useScroll()
</script>

<style scoped>
.scroll-to-top {
  @apply p-3 rounded-full shadow-lg;
  @apply bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-all duration-200;
  @apply flex items-center justify-center;
}

.icon {
  @apply w-5 h-5 text-gray-700 dark:text-gray-300;
}

.scroll-to-top:hover .icon {
  @apply -translate-y-0.5;
}
</style>
