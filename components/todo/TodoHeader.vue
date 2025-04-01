<template>
  <header class="todo-header">
    <div class="header-content">
      <!-- Main title with progress -->
      <div class="title-group">
        <h1 class="title">
          <span class="title-gradient">Task Master</span>
          <span class="progress-count">
            ({{ completedCount }}/{{ totalCount }})
          </span>
        </h1>

        <!-- Progress bar -->
        <div class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{ width: `${progressPercentage}%` }"
          />
          <div class="progress-text">
            {{ progressPercentage }}% complete
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="action-buttons">
        <button
          @click="emit('toggle-sort')"
          class="sort-button"
          :aria-label="`Sort by ${nextSortType}`"
          :title="`Sort by ${nextSortType}`"
        >
          <Icon :name="sortIcon" class="button-icon" />
          <span class="button-text">{{ sortLabel }}</span>
        </button>

        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({
  completedCount: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  },
  progressPercentage: {
    type: Number,
    required: true
  },
  sortType: {
    type: String as () => 'date' | 'priority',
    default: 'date'
  }
})

const emit = defineEmits(['toggle-sort'])

const sortLabels = {
  date: 'Newest First',
  priority: 'Priority'
}

const sortIcons = {
  date: 'ph:sort-descending',
  priority: 'ph:seal-warning'
}

const nextSortType = computed(() =>
  props.sortType === 'date' ? 'priority' : 'date'
)

const sortLabel = computed(() => sortLabels[props.sortType])
const sortIcon = computed(() => sortIcons[props.sortType])
</script>

<style scoped>
.todo-header {
  @apply mb-8;
}

.header-content {
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4;
}

.title-group {
  @apply flex-1;
}

.title {
  @apply text-3xl font-bold flex items-baseline gap-2 mb-2;
}

.title-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600;
}

.progress-count {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400;
}

.progress-bar-container {
  @apply relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2;
}

.progress-bar {
  @apply absolute h-full bg-gradient-to-r from-primary-500 to-purple-500;
  @apply transition-all duration-1000 ease-out;
}

.progress-text {
  @apply absolute inset-0 flex items-center justify-center text-xs font-medium;
  @apply text-white mix-blend-difference;
}

.action-buttons {
  @apply flex items-center gap-3;
}

.sort-button {
  @apply flex items-center gap-1.5 px-3 py-2 rounded-lg;
  @apply bg-white dark:bg-gray-800 shadow-sm hover:shadow-md;
  @apply transition-all duration-200 text-gray-700 dark:text-gray-300;
}

.button-icon {
  @apply w-5 h-5;
}

.button-text {
  @apply text-sm font-medium hidden sm:inline;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .header-content {
    @apply flex-col;
  }

  .action-buttons {
    @apply w-full justify-between;
  }

  .sort-button {
    @apply flex-1 justify-center;
  }
}
</style>
