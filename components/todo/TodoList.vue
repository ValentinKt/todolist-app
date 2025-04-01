<template>
  <div class="todo-list-container">
    <!-- Header Section -->
    <TodoHeader
      :completed-count="completedCount"
      :total-count="filteredTodos.length"
      :progress-percentage="progressPercentage"
      @toggle-sort="toggleSortOrder"
    />

    <!-- Main Content Area -->
    <div class="todo-content">
      <!-- Todo Input Form -->
      <TodoForm
        @add-todo="handleAddTodo"
        class="mb-6"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <Icon name="svg-spinners:90-ring-with-bg" size="32" />
        <span>Loading your tasks...</span>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="!filteredTodos.length"
        @add-todo="focusInput"
      />

      <!-- Todo List with Transition Group -->
      <TransitionGroup
        v-else
        name="list"
        tag="ul"
        class="todo-items"
      >
        <TodoItem
          v-for="(todo, index) in sortedTodos"
          :key="todo.id"
          :todo="todo"
          :index="index"
          @toggle="toggleTodoCompletion(todo)"
          @edit="editTodo"
          @delete="deleteTodo(todo.id)"
          @reorder="handleReorder"
        />
      </TransitionGroup>

      <!-- Filters -->
      <TodoFilters
        v-if="hasTodos"
        v-model:filter="currentFilter"
        v-model:sort="sortOrder"
        v-model:priority="priorityFilter"
        :counts="filterCounts"
        class="mt-6"
      />
    </div>

    <!-- Celebration Effects -->
    <ConfettiEffect v-if="showCelebration" />
    <AchievementToast
      v-if="activeAchievement"
      :achievement="activeAchievement"
      @close="activeAchievement = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoFilter, TodoSortOption, TodoPriority, TodoAchievement } from './types'

// State Management
const todoStore = useTodosStore()
const { isLoading, todos } = storeToRefs(todoStore)
const { loadTodos, addTodo, toggleCompletion, deleteTodo, reorderTodos } = todoStore

// UI State
const currentFilter = ref<TodoFilter>('all')
const sortOrder = ref<TodoSortOption>('date-desc')
const priorityFilter = ref<TodoPriority | 'all'>('all')
const activeAchievement = ref<TodoAchievement | null>(null)

// Celebration Effects
const { showCelebration, triggerCelebration } = useCelebration()

// Computed Properties
const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    // Filter by status
    const statusMatch =
      currentFilter.value === 'all' ||
      (currentFilter.value === 'completed' && todo.completed) ||
      (currentFilter.value === 'active' && !todo.completed) ||
      (currentFilter.value === 'today' && isDueToday(todo.dueDate))

    // Filter by priority
    const priorityMatch = priorityFilter.value === 'all' || todo.priority === priorityFilter.value

    return statusMatch && priorityMatch
  })
})

const sortedTodos = computed(() => {
  return [...filteredTodos.value].sort((a, b) => {
    if (sortOrder.value.startsWith('priority')) {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
      return sortOrder.value === 'priority-desc' ? comparison : -comparison
    } else {
      const dateA = new Date(a.created).getTime()
      const dateB = new Date(b.created).getTime()
      return sortOrder.value === 'date-desc' ? dateB - dateA : dateA - dateB
    }
  })
})

const completedCount = computed(() => todos.value.filter(t => t.completed).length)
const progressPercentage = computed(() =>
  Math.round((completedCount.value / todos.value.length) * 100) || 0
)
const hasTodos = computed(() => todos.value.length > 0)

const filterCounts = computed(() => ({
  all: todos.value.length,
  active: todos.value.filter(t => !t.completed).length,
  completed: completedCount.value,
  today: todos.value.filter(t => isDueToday(t.dueDate)).length
}))

// Actions
const handleAddTodo = async (text: string) => {
  const newTodo = await addTodo(text)
  checkForAchievements()
  return newTodo
}

const toggleTodoCompletion = async (todo: Todo) => {
  await toggleCompletion(todo.id)
  if (!todo.completed) {
    checkForAchievements()
  }
}

const handleReorder = async ({ fromIndex, toIndex }: { fromIndex: number; toIndex: number }) => {
  await reorderTodos(fromIndex, toIndex)
  if (completedCount.value > 0 && completedCount.value % 5 === 0) {
    triggerCelebration('milestone')
  }
}

const editTodo = async (id: string, updates: Partial<Todo>) => {
  await todoStore.updateTodo(id, updates)
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value.startsWith('date') ? 'priority-desc' : 'date-desc'
}

// Achievement System
const checkForAchievements = () => {
  const totalCompleted = completedCount.value

  // Milestone achievement
  if (totalCompleted % 5 === 0) {
    activeAchievement.value = {
      type: 'milestone',
      title: `${totalCompleted} Tasks Completed!`,
      message: `You've completed ${totalCompleted} tasks. Great work!`,
      level: Math.floor(totalCompleted / 5)
    }
    triggerCelebration('milestone')
  }

  // Other achievements can be added here...
}

// Lifecycle Hooks
onMounted(async () => {
  await loadTodos()
  todoStore.subscribeToRealtime()
})

// Focus helpers
const focusInput = () => {
  // Implementation would use template refs
}
</script>

<style scoped>
.todo-list-container {
  @apply max-w-3xl mx-auto p-4 sm:p-6;
}

.todo-content {
  @apply mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-12 gap-4 text-gray-500;
}

.todo-items {
  @apply space-y-3;
}

.list-move {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
