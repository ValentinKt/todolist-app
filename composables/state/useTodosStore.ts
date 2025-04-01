import { defineStore } from 'pinia'
import type { Todo } from '../api/types/types'
import { useTodosApi } from '../api/useTodosApi'
import { useCelebration } from '../effects/useCelebration'

export const useTodosStore = defineStore('todos', () => {
  // State
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // API
  const api = useTodosApi()
  const { triggerCelebration } = useCelebration()

  // Getters
  const completedCount = computed(() => todos.value.filter(t => t.completed).length)
  const activeCount = computed(() => todos.value.filter(t => !t.completed).length)
  const progressPercentage = computed(() => {
    if (todos.value.length === 0) return 0
    return Math.round((completedCount.value / todos.value.length) * 100)
  })

  // Actions
  const loadTodos = async () => {
    isLoading.value = true
    error.value = null

    try {
      const result = await api.fetchTodos()
      todos.value = result
    } catch (err) {
      error.value = 'Failed to load todos'
      console.error('Error loading todos:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addTodo = async (todoData: Partial<Todo>) => {
    try {
      // Ensure required fields
      const newTodo = {
        text: todoData.text || '',
        completed: false,
        priority: todoData.priority || 'medium',
        dueDate: todoData.dueDate,
        tags: todoData.tags || [],
        order: todos.value.length
      } as Omit<Todo, 'id' | 'created' | 'updated'>

      const created = await api.createTodo(newTodo)
      todos.value.unshift(created)
      return created
    } catch (err) {
      error.value = 'Failed to add todo'
      console.error('Error adding todo:', err)
      throw err
    }
  }

  const toggleCompletion = async (id: string) => {
    try {
      const todo = todos.value.find(t => t.id === id)
      if (!todo) return

      const updated = await api.toggleCompletion(id)

      // Update local state
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = updated
      }

      // Celebrate completion
      if (updated.completed) {
        triggerCelebration('task-completed')

        // Check for all completed
        if (activeCount.value === 0 && todos.value.length > 0) {
          triggerCelebration('all-completed')
        }
      }

      return updated
    } catch (err) {
      error.value = 'Failed to update todo'
      console.error('Error toggling todo completion:', err)
      throw err
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updated = await api.updateTodo(id, updates)

      // Update local state
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = { ...todos.value[index], ...updated }
      }

      return updated
    } catch (err) {
      error.value = 'Failed to update todo'
      console.error('Error updating todo:', err)
      throw err
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id)

      // Update local state
      todos.value = todos.value.filter(t => t.id !== id)
      return true
    } catch (err) {
      error.value = 'Failed to delete todo'
      console.error('Error deleting todo:', err)
      throw err
    }
  }

  const reorderTodos = async (fromIndex: number, toIndex: number) => {
    // Don't proceed if indices are the same or invalid
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= todos.value.length ||
      toIndex >= todos.value.length
    ) {
      return
    }

    try {
      // Create a copy and reorder
      const newOrder = [...todos.value]
      const [movedItem] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, movedItem)

      // Update the order property for affected items
      const updates = newOrder.map((todo, index) => ({
        id: todo.id,
        order: index
      }))

      // Optimistically update UI
      todos.value = newOrder

      // Persist to backend
      await api.reorderTodos(updates)
    } catch (err) {
      error.value = 'Failed to reorder todos'
      console.error('Error reordering todos:', err)

      // Revert to original order on error by reloading
      await loadTodos()
      throw err
    }
  }

  // Subscribe to realtime updates from PocketBase
  const subscribeToRealtime = () => {
    return api.subscribeToTodos((action, record) => {
      if (action === 'create') {
        // Only add if not already in the list
        if (!todos.value.some(t => t.id === record.id)) {
          todos.value.unshift(record)
        }
      } else if (action === 'update') {
        const index = todos.value.findIndex(t => t.id === record.id)
        if (index !== -1) {
          todos.value[index] = record
        }
      } else if (action === 'delete') {
        todos.value = todos.value.filter(t => t.id !== record.id)
      }
    })
  }

  return {
    // State
    todos,
    isLoading,
    error,

    // Getters
    completedCount,
    activeCount,
    progressPercentage,

    // Actions
    loadTodos,
    addTodo,
    toggleCompletion,
    updateTodo,
    deleteTodo,
    reorderTodos,
    subscribeToRealtime
  }
})
