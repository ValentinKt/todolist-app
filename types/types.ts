// frontend/types.ts
export interface Todo {
  id: string
  collectionId: string
  collectionName: string
  created: string
  updated: string
  text: string
  completed: boolean
  completedAt: string | null
  priority: 'low' | 'medium' | 'high'
  user: string
  order: number
  dueDate?: string
  tags?: string[]
  sharedWith?: string[]  // Array of user IDs (relation)
  expand?: {
      sharedWith?: User[]  // Expanded user objects
  }
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  timeout?: number
}

export interface TodoAchievement {
  type: 'milestone' | 'streak' | 'productivity'
  title: string
  message: string
  level?: number
  progress?: number
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'today'
export type TodoSortOption = 'date-desc' | 'date-asc' | 'priority-desc' | 'priority-asc'
