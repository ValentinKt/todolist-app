// frontend/composables/api/useTodosApi.ts
import { usePocketBase } from '../api/usePocketBase'
import type { Todo } from './types/types'


export const useTodosApi = () => {
    const { pb } = usePocketBase()
    const { toast } = useToast()

  // Fetch all todos with optional filters
  const fetchTodos = async (options?: {
    filter?: string
    sort?: string
    expand?: string
  }): Promise<Todo[]> => {
    try {
      const result = await pb.collection('todos').getFullList<Todo>({
        filter: options?.filter,
        sort: options?.sort || '-created',
        expand: options?.expand
      })
      return result
    } catch (error) {
      toast.error('Failed to fetch todos')
      console.error('Error fetching todos:', error)
      throw error
    }
  }

  // Create a new todo
  const createTodo = async (data: Omit<Todo, 'id' | 'created' | 'updated'>): Promise<Todo> => {
    try {
      const result = await pb.collection('todos').create<Todo>({
        ...data,
        user: pb.authStore.model?.id
      })
      toast.success('Todo created successfully')
      return result
    } catch (error) {
      toast.error('Failed to create todo')
      console.error('Error creating todo:', error)
      throw error
    }
  }

  // Update an existing todo
  const updateTodo = async (id: string, data: Partial<Todo>): Promise<Todo> => {
    try {
      const result = await pb.collection('todos').update<Todo>(id, data)
      toast.success('Todo updated successfully')
      return result
    } catch (error) {
      toast.error('Failed to update todo')
      console.error('Error updating todo:', error)
      throw error
    }
  }

  // Delete a todo
  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      await pb.collection('todos').delete(id)
      toast.success('Todo deleted successfully')
      return true
    } catch (error) {
      toast.error('Failed to delete todo')
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  // Toggle todo completion status
  const toggleCompletion = async (id: string): Promise<Todo> => {
    try {
      const current = await pb.collection('todos').getOne<Todo>(id)
      return await updateTodo(id, {
        completed: !current.completed,
        completedAt: !current.completed ? new Date().toISOString() : null
      })
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      throw error
    }
  }

  // Reorder todos
  const reorderTodos = async (updates: Array<{ id: string; order: number }>): Promise<Todo[]> => {
    try {
      const results = await pb.collection('todos').update<Todo[]>(updates)
      return results
    } catch (error) {
      toast.error('Failed to reorder todos')
      console.error('Error reordering todos:', error)
      throw error
    }
  }

  // Subscribe to realtime updates
  const subscribeToTodos = (callback: (action: string, record: Todo) => void) => {
    return pb.collection('todos').subscribe('*', (e) => {
      callback(e.action, e.record as Todo)
    })
  }

  return {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleCompletion,
    reorderTodos,
    subscribeToTodos
  }
}
