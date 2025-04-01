<template>
  <li
    class="todo-item"
    :class="{
      'completed': todo.completed,
      'priority-high': todo.priority === 'high',
      'priority-medium': todo.priority === 'medium',
      'priority-low': todo.priority === 'low',
      'dragging': isDragging
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent="handleDragOver"
    @drop="handleDrop"
  >
    <!-- Checkbox -->
    <button
      @click.stop="toggleCompletion"
      class="todo-checkbox"
      :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
    >
      <Transition name="bounce">
        <Icon
          v-if="todo.completed"
          name="ph:check"
          class="check-icon"
        />
      </Transition>
    </button>

    <!-- Content -->
    <div class="todo-content">
      <!-- Editable Text -->
      <div class="todo-text">
        <input
          v-if="isEditing"
          ref="editInput"
          v-model="editedText"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
          class="edit-input"
        />
        <span
          v-else
          class="display-text"
          :class="{ completed: todo.completed }"
          @dblclick="startEditing"
        >
          {{ todo.text }}
        </span>
      </div>

      <!-- Metadata -->
      <div class="todo-meta">
        <span v-if="todo.dueDate" class="due-date">
          <Icon name="ph:calendar-blank" class="icon" />
          {{ formatDueDate(todo.dueDate) }}
        </span>
        <span v-if="todo.tags?.length" class="tags">
          <span v-for="tag in todo.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="todo-actions">
      <button
        @click.stop="startEditing"
        class="action-button edit"
        aria-label="Edit todo"
      >
        <Icon name="ph:pencil-simple" class="icon" />
      </button>
      <button
        @click.stop="confirmDelete"
        class="action-button delete"
        aria-label="Delete todo"
      >
        <Icon name="ph:trash" class="icon" />
      </button>
    </div>

    <!-- Loading Overlay -->
    <Transition name="fade">
      <div v-if="isUpdating" class="loading-overlay">
        <Icon name="svg-spinners:90-ring-with-bg" class="spinner" />
      </div>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import type { Todo } from './types'

const props = defineProps<{
  todo: Todo
  index: number
}>()

const emit = defineEmits<{
  (e: 'toggle', todo: Todo): void
  (e: 'edit', id: string, updates: Partial<Todo>): void
  (e: 'delete', id: string): void
  (e: 'reorder', payload: { fromIndex: number; toIndex: number }): void
}>()

// State
const isEditing = ref(false)
const editedText = ref('')
const isUpdating = ref(false)
const isDragging = ref(false)
const editInput = ref<HTMLInputElement | null>(null)

// Utilities
const { formatDueDate } = useDateUtils()
const { playCompleteSound, playDeleteSound } = useSoundEffects()
const { confirm } = useConfirmDialog()

// Actions
const toggleCompletion = async () => {
  isUpdating.value = true
  try {
    await emit('toggle', props.todo)
    if (!props.todo.completed) {
      playCompleteSound()
    }
  } finally {
    isUpdating.value = false
  }
}

const startEditing = () => {
  if (props.todo.completed) return
  editedText.value = props.todo.text
  isEditing.value = true
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

const saveEdit = async () => {
  if (editedText.value.trim() && editedText.value !== props.todo.text) {
    await emit('edit', props.todo.id, { text: editedText.value.trim() })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
}

const confirmDelete = async () => {
  const { isCanceled } = await confirm(
    'Delete Task',
    'Are you sure you want to delete this task?'
  )

  if (!isCanceled) {
    playDeleteSound()
    await emit('delete', props.todo.id)
  }
}

// Drag and Drop
const handleDragStart = () => {
  isDragging.value = true
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const fromIndex = Number(e.dataTransfer?.getData('text/plain'))
  emit('reorder', { fromIndex, toIndex: props.index })
}
</script>

<style scoped>
.todo-item {
  @apply relative flex items-start gap-3 p-4 rounded-xl;
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-300 cursor-pointer;
  @apply hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600;
}

.todo-item.completed {
  @apply opacity-75 hover:opacity-100;
}

.todo-item.priority-high {
  @apply border-l-4 border-red-500;
}

.todo-item.priority-medium {
  @apply border-l-4 border-yellow-500;
}

.todo-item.priority-low {
  @apply border-l-4 border-green-500;
}

.todo-item.dragging {
  @apply opacity-50 ring-2 ring-primary-500;
}

.todo-checkbox {
  @apply relative flex-shrink-0 w-6 h-6 rounded-full border-2;
  @apply border-gray-300 dark:border-gray-600 hover:border-primary-400;
  @apply transition-all duration-300;
}

.todo-item.completed .todo-checkbox {
  @apply border-primary-500 bg-primary-500;
}

.check-icon {
  @apply absolute inset-0 m-auto text-white text-sm;
}

.todo-content {
  @apply flex-1 min-w-0;
}

.todo-text {
  @apply flex items-center gap-2;
}

.display-text {
  @apply text-gray-800 dark:text-gray-200 font-medium;
  @apply transition-all duration-300;
}

.todo-item.completed .display-text {
  @apply line-through decoration-2 text-gray-500 dark:text-gray-400;
}

.edit-input {
  @apply w-full bg-transparent outline-none;
  @apply text-gray-800 dark:text-gray-200 font-medium;
}

.todo-meta {
  @apply flex items-center gap-3 mt-1 text-xs;
}

.due-date {
  @apply flex items-center gap-1 text-gray-500 dark:text-gray-400;
}

.icon {
  @apply w-3.5 h-3.5;
}

.tags {
  @apply flex flex-wrap gap-1.5;
}

.tag {
  @apply px-2 py-0.5 rounded-full text-xs;
  @apply bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300;
}

.todo-actions {
  @apply flex items-center gap-1 opacity-0 group-hover:opacity-100;
  @apply transition-opacity duration-200;
}

.todo-item:hover .todo-actions {
  @apply opacity-100;
}

.action-button {
  @apply p-1.5 rounded-full transition-colors;
}

.action-button.edit {
  @apply text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20;
}

.action-button.delete {
  @apply text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20;
}

.loading-overlay {
  @apply absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-xl;
  @apply flex items-center justify-center;
}

.spinner {
  @apply w-6 h-6 text-primary-500;
}

/* Animations */
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>
