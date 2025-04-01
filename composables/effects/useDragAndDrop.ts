import { ref } from 'vue'
import type { Ref } from 'vue'

export const useDragAndDrop = <T>(items: Ref<T[]>, updateOrder: (newOrder: T[]) => Promise<void>) => {
  const draggedItem = ref<number | null>(null)
  const targetItem = ref<number | null>(null)
  const isDragging = ref(false)

  const onDragStart = (index: number) => {
    draggedItem.value = index
    isDragging.value = true
  }

  const onDragEnd = () => {
    draggedItem.value = null
    targetItem.value = null
    isDragging.value = false
  }

  const onDragOver = (index: number) => {
    if (draggedItem.value === null) return
    targetItem.value = index
  }

  const onDrop = async () => {
    if (draggedItem.value === null || targetItem.value === null) return
    
    const newItems = [...items.value]
    const [removed] = newItems.splice(draggedItem.value, 1)
    newItems.splice(targetItem.value, 0, removed)

    try {
      await updateOrder(newItems)
      items.value = newItems
    } catch (error) {
      console.error('Error reordering items:', error)
    } finally {
      onDragEnd()
    }
  }

  return {
    draggedItem,
    targetItem,
    isDragging,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
  }
}