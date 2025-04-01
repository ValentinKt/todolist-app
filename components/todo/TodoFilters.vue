<template>
  <div class="todo-filters">
    <!-- Filter Buttons -->
    <div class="filter-group">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="updateFilter(filter.value)"
        class="filter-button"
        :class="{ active: currentFilter === filter.value }"
        :aria-label="`Show ${filter.label} tasks`"
      >
        <Icon :name="filter.icon" class="button-icon" />
        <span class="button-label">{{ filter.label }}</span>
        <span v-if="filter.count !== undefined" class="count-badge">
          {{ filter.count }}
        </span>
      </button>
    </div>

    <!-- Sort Dropdown -->
    <div class="sort-group">
      <label class="sort-label">
        <Icon name="ph:sort-ascending" class="label-icon" />
        <span>Sort by:</span>
      </label>
      <select
        v-model="sortOrder"
        class="sort-select"
        @change="updateSort"
      >
        <option
          v-for="option in sortOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Priority Filter (Mobile) -->
    <div class="priority-filter-mobile">
      <select
        v-model="priorityFilter"
        class="priority-select"
        @change="updatePriorityFilter"
      >
        <option value="all">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>
    </div>

    <!-- Priority Filter (Desktop) -->
    <div class="priority-filter-desktop">
      <button
        v-for="priority in priorityFilters"
        :key="priority.value"
        @click="updatePriorityFilter(priority.value)"
        class="priority-button"
        :class="{
          active: priorityFilter === priority.value,
          [priority.value]: true
        }"
      >
        <Icon :name="priority.icon" class="priority-icon" />
        <span>{{ priority.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoFilter, TodoPriority, TodoSortOption } from './types'

const props = defineProps({
  filter: {
    type: String as () => TodoFilter,
    default: 'all'
  },
  sort: {
    type: String as () => TodoSortOption,
    default: 'date-desc'
  },
  priority: {
    type: String as () => TodoPriority | 'all',
    default: 'all'
  },
  counts: {
    type: Object as () => Record<TodoFilter, number>,
    default: () => ({ all: 0, active: 0, completed: 0, today: 0 })
  }
})

const emit = defineEmits(['update:filter', 'update:sort', 'update:priority'])

const currentFilter = ref<TodoFilter>(props.filter)
const sortOrder = ref<TodoSortOption>(props.sort)
const priorityFilter = ref<TodoPriority | 'all'>(props.priority)

const filters = computed(() => [
  { value: 'all', label: 'All', icon: 'ph:list-bullets', count: props.counts.all },
  { value: 'active', label: 'Active', icon: 'ph:circle', count: props.counts.active },
  { value: 'completed', label: 'Completed', icon: 'ph:check-circle', count: props.counts.completed },
  { value: 'today', label: 'Today', icon: 'ph:calendar', count: props.counts.today }
])

const sortOptions = computed(() => [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'priority-desc', label: 'High Priority First' },
  { value: 'priority-asc', label: 'Low Priority First' }
])

const priorityFilters = computed(() => [
  { value: 'all', label: 'All', icon: 'ph:asterisk' },
  { value: 'high', label: 'High', icon: 'ph:warning-octagon' },
  { value: 'medium', label: 'Medium', icon: 'ph:warning' },
  { value: 'low', label: 'Low', icon: 'ph:seal' }
])

const updateFilter = (filter: TodoFilter) => {
  currentFilter.value = filter
  emit('update:filter', filter)
}

const updateSort = () => {
  emit('update:sort', sortOrder.value)
}

const updatePriorityFilter = (priority: TodoPriority | 'all') => {
  priorityFilter.value = priority
  emit('update:priority', priority)
}
</script>

<style scoped>
.todo-filters {
  @apply flex flex-col sm:flex-row items-center justify-between gap-4;
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700;
}

.filter-group {
  @apply flex flex-wrap items-center gap-2;
}

.filter-button {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300;
  @apply transition-colors duration-200;
}

.filter-button.active {
  @apply bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300;
}

.button-icon {
  @apply w-4 h-4;
}

.count-badge {
  @apply px-1.5 py-0.5 text-xs rounded-full;
  @apply bg-gray-200 dark:bg-gray-600;
}

.filter-button.active .count-badge {
  @apply bg-primary-200 dark:bg-primary-800;
}

.sort-group {
  @apply flex items-center gap-2;
}

.sort-label {
  @apply flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400;
}

.label-icon {
  @apply w-4 h-4;
}

.sort-select, .priority-select {
  @apply px-3 py-2 text-sm rounded-lg border;
  @apply bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.priority-filter-desktop {
  @apply hidden md:flex items-center gap-2;
}

.priority-filter-mobile {
  @apply md:hidden w-full;
}

.priority-button {
  @apply flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm;
  @apply bg-gray-100 dark:bg-gray-700 transition-colors duration-200;
}

.priority-button.active {
  @apply font-medium;
}

.priority-button.high {
  @apply hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400;
}

.priority-button.high.active {
  @apply bg-red-100 dark:bg-red-900/30;
}

.priority-button.medium {
  @apply hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400;
}

.priority-button.medium.active {
  @apply bg-yellow-100 dark:bg-yellow-900/30;
}

.priority-button.low {
  @apply hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400;
}

.priority-button.low.active {
  @apply bg-green-100 dark:bg-green-900/30;
}

.priority-icon {
  @apply w-4 h-4;
}

@media (max-width: 767px) {
  .todo-filters {
    @apply gap-3;
  }

  .filter-group, .sort-group {
    @apply w-full;
  }

  .filter-button {
    @apply flex-1 justify-center;
  }
}
</style>
