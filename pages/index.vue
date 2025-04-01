<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- Header with progress and actions -->
      <TodoHeader
        :completed-count="completedCount"
        :total-count="filteredTodos.length"
        :progress-percentage="progressPercentage"
        @toggle-sort="toggleSortOrder"
      />

      <!-- Main todo interface -->
      <div class="todo-interface">
        <!-- Todo input form -->
        <TodoForm
          @add-todo="addTodo"
          class="mb-6"
        />

        <!-- Loading state -->
        <div v-if="isLoading" class="loading-state">
          <Icon name="svg-spinners:90-ring-with-bg" size="32" class="text-primary-500" />
          <span>Loading your tasks...</span>
        </div>

        <!-- Empty state -->
        <EmptyState
          v-else-if="!filteredTodos.length"
          @add-todo="focusInput"
        />

        <!-- Todo list with transition animations -->
        <TransitionGroup
          v-else
          name="list"
          tag="ul"
          class="todo-list"
        >
          <TodoItem
            v-for="(todo, index) in sortedTodos"
            :key="todo.id"
            :todo="todo"
            :index="index"
            @toggle="toggleTodoCompletion(todo)"
            @delete="deleteTodo(todo.id)"
            @reorder="handleReorder"
            class="todo-item"
          />
        </TransitionGroup>

        <!-- Filter controls -->
        <TodoFilters
          v-if="hasTodos"
          v-model:filter="currentFilter"
          v-model:sort="sortOrder"
          class="mt-6"
        />
      </div>
    </div>

    <!-- Celebration effects -->
    <ConfettiEffect v-if="showCelebration" />
    <AchievementToast
      v-if="achievement"
      :achievement="achievement"
      @close="achievement = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoFilter, TodoAchievement } from './types'

// State management
const todoStore = useTodosStore()
const { isLoading } = storeToRefs(todoStore)
const { todos, completedCount, progressPercentage } = storeToRefs(todoStore)

// UI state
const currentFilter = ref<TodoFilter>('all')
const sortOrder = ref<'date' | 'priority'>('date')
const achievement = ref<TodoAchievement | null>(null)

// Celebration effects
const { showCelebration, triggerCelebration } = useCelebration()

// Computed properties
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'completed':
      return todos.value.filter(t => t.completed)
    case 'active':
      return todos.value.filter(t => !t.completed)
    case 'today':
      return todos.value.filter(t =>
        t.dueDate && isDueToday(t.dueDate)
      )
    default:
      return todos.value
  }
})

const sortedTodos = computed(() => {
  return [...filteredTodos.value].sort((a, b) => {
    if (sortOrder.value === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return new Date(b.created).getTime() - new Date(a.created).getTime()
  })
})

const hasTodos = computed(() => todos.value.length > 0)

// Actions
const addTodo = async (text: string) => {
  await todoStore.addTodo(text)
  checkForAchievements()
}

const toggleTodoCompletion = async (todo: Todo) => {
  await todoStore.toggleCompletion(todo.id)
  if (!todo.completed) {
    checkForAchievements()
  }
}

const deleteTodo = async (id: string) => {
  await todoStore.deleteTodo(id)
}

const handleReorder = async ({ fromIndex, toIndex }: { fromIndex: number, toIndex: number }) => {
  await todoStore.reorderTodos(fromIndex, toIndex)
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'date' ? 'priority' : 'date'
}

// Achievement system
const checkForAchievements = () => {
  const totalCompleted = todoStore.completedCount

  // Check for milestone achievements
  if (totalCompleted % 5 === 0) {
    achievement.value = {
      type: 'milestone',
      title: `${totalCompleted} Tasks Completed!`,
      message: `You've completed ${totalCompleted} tasks. Great work!`,
      level: Math.floor(totalCompleted / 5)
    }
    triggerCelebration('milestone')
  }

  // Check for other achievements
  // ...
}

// Lifecycle hooks
onMounted(async () => {
  await todoStore.loadTodos()
  todoStore.subscribeToRealtime()
})

// Auto-focus helpers
const focusInput = () => {
  // Implementation would use template refs
}
</script>

<style scoped>
.page-container {
  @apply min-h-screen bg-gray-50 dark:bg-gray-900 py-8;
}

.content-wrapper {
  @apply max-w-3xl mx-auto px-4 sm:px-6 lg:px-8;
}

.todo-interface {
  @apply mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-12 gap-4 text-gray-500;
}

.todo-list {
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
