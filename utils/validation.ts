export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' }
  }
  // Add more validation rules as needed
  return { valid: true }
}

export const validateTodo = (text: string): { valid: boolean; message?: string } => {
  if (!text.trim()) {
    return { valid: false, message: 'Todo text cannot be empty' }
  }
  if (text.length > 500) {
    return { valid: false, message: 'Todo text is too long (max 500 characters)' }
  }
  return { valid: true }
}

export const validateDueDate = (date: string): boolean => {
  if (!date) return true
  const inputDate = new Date(date)
  return !Number.isNaN(inputDate.getTime()) && inputDate >= new Date()
}
