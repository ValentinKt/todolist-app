<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <div class="input-group">
      <input
        v-model="todoText"
        ref="inputRef"
        type="text"
        placeholder="What needs to be done?"
        class="todo-input"
        :class="{ 'error': error }"
        @keydown.enter="handleSubmit"
      />
      <button
        type="submit"
        class="submit-button"
        :disabled="!todoText.trim()"
      >
        <Icon name="ph:plus" class="icon" />
        <span class="sr-only">Add Todo</span>
      </button>
    </div>

    <div v-if="showAdvanced" class="advanced-options">
      <div class="option-group">
        <label class="option-label">
          <Icon name="ph:flag" class="option-icon" />
          Priority
        </label>
        <select v-model="priority" class="option-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div class="option-group">
        <label class="option-label">
          <Icon name="ph:calendar" class="option-icon" />
          Due Date
        </label>
        <input
          v-model="dueDate"
          type="date"
          class="option-input"
          :min="today"
        />
      </div>

      <div class="option-group">
        <label class="option-label">
          <Icon name="ph:tag" class="option-icon" />
          Tags
        </label>
        <input
          v-model="tagInput"
          type="text"
          class="option-input"
          placeholder="Add tags (comma separated)"
          @keydown.enter.prevent="addTags"
        />
        <div v-if="tags.length" class="tags-container">
          <span
            v-for="(tag, index) in tags"
            :key="index"
            class="tag"
            @click="removeTag(index)"
          >
            {{ tag }}
            <Icon name="ph:x" class="tag-remove-icon" />
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="toggle-advanced"
      @click="showAdvanced = !showAdvanced"
    >
      {{ showAdvanced ? 'Hide Options' : 'More Options' }}
      <Icon
        :name="showAdvanced ? 'ph:caret-up' : 'ph:caret-down'"
        class="toggle-icon"
      />
    </button>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
const { addTodo } = useTodosStore()

const todoText = ref('')
const priority = ref<'low' | 'medium' | 'high'>('medium')
const dueDate = ref('')
const tagInput = ref('')
const tags = ref<string[]>([])
const showAdvanced = ref(false)
const error = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const today = new Date().toISOString().split('T')[0]

const addTags = () => {
  if (!tagInput.value.trim()) return
  
  const newTags = tagInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0 && !tags.value.includes(tag))
  
  tags.value = [...tags.value, ...newTags]
  tagInput.value = ''
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!todoText.value.trim()) {
    error.value = 'Please enter a task'
    return
  }

  try {
    await addTodo({
      text: todoText.value.trim(),
      completed: false,
      priority: priority.value,
      dueDate: dueDate.value || undefined,
      tags: tags.value
    })

    // Reset form
    todoText.value = ''
    tags.value = []
    error.value = ''
    inputRef.value?.focus()
  } catch (err) {
    error.value = 'Failed to add todo. Please try again.'
    console.error('Error adding todo:', err)
  }
}

// Auto-focus input on mount
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.todo-form {
  @apply mb-6;
}

.input-group {
  @apply flex gap-2;
}

.todo-input {
  @apply flex-1 px-5 py-3.5 rounded-xl border-2 text-lg shadow-sm;
  @apply border-gray-200 dark:border-gray-700 focus:border-primary-500;
  @apply dark:bg-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500;
  @apply transition-normal focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700;
  
  &.error {
    @apply border-red-500 dark:border-red-400;
  }
}

.submit-button {
  @apply px-6 py-3.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl;
  @apply hover:shadow-lg active:scale-95 transition-normal;
  @apply flex items-center justify-center;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.advanced-options {
  @apply mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl;
  @apply border border-gray-200 dark:border-gray-700;
  @apply grid gap-4;
}

.option-group {
  @apply grid gap-2;
}

.option-label {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300;
}

.option-icon {
  @apply w-4 h-4;
}

.option-select, .option-input {
  @apply px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600;
  @apply bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200;
  @apply transition-normal focus:ring-2 focus:ring-primary-300 dark:focus:ring-primary-700;
}

.tags-container {
  @apply flex flex-wrap gap-2 mt-2;
}

.tag {
  @apply inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs;
  @apply bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200;
  @apply transition-normal cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800;
}

.tag-remove-icon {
  @apply w-3 h-3;
}

.toggle-advanced {
  @apply mt-2 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400;
  @apply hover:text-primary-800 dark:hover:text-primary-300 transition-normal;
}

.toggle-icon {
  @apply w-4 h-4;
}

.error-message {
  @apply mt-2 text-sm text-red-500 dark:text-red-400;
}

.sr-only {
  @apply sr-only;
}
</style>