<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :aria-label="`Toggle ${nextTheme} mode`"
    :title="`Toggle ${nextTheme} mode`"
  >
    <Transition name="icon" mode="out-in">
      <Icon
        :key="activeIcon"
        :name="activeIcon"
        class="icon"
      />
    </Transition>
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const themes = [
  { name: 'light', icon: 'ph:sun' },
  { name: 'dark', icon: 'ph:moon' },
  { name: 'system', icon: 'ph:monitor' }
]

const nextTheme = computed(() => {
  const currentIndex = themes.findIndex(t => t.name === colorMode.preference)
  return themes[(currentIndex + 1) % themes.length].name
})

const activeIcon = computed(() => {
  return themes.find(t => t.name === colorMode.preference)?.icon || 'ph:monitor'
})

const toggleTheme = () => {
  colorMode.preference = nextTheme.value
}
</script>

<style scoped>
.theme-toggle {
  @apply p-3 rounded-full shadow-lg;
  @apply bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700;
  @apply transition-colors duration-200;
}

.icon {
  @apply w-5 h-5 text-gray-700 dark:text-gray-300;
}

.icon-enter-active,
.icon-leave-active {
  transition: all 0.2s ease;
}

.icon-enter-from,
.icon-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
