import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const useDateUtils = () => {
  const formatDate = (dateString: string | Date, pattern = 'MMM d, yyyy') => {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, pattern)
  }

  const formatRelativeTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const formatDueDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return `in ${diffDays} days`
  }

  const isOverdue = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return date < new Date()
  }

  return {
    formatDate,
    formatRelativeTime,
    formatDueDate,
    isOverdue
  }
}