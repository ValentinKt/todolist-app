<template>
  <button
    type="button"
    class="toggle-switch"
    :class="{ 'switch-active': modelValue }"
    @click="toggle"
    role="switch"
    :aria-checked="modelValue"
  >
    <span class="switch-slider" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
.toggle-switch {
  @apply relative h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-700;
  @apply transition-colors duration-200 focus:outline-none focus-visible:ring-2;
  @apply focus-visible:ring-primary-500 focus-visible:ring-offset-2;
}

.switch-active {
  @apply bg-primary-600;
}

.switch-slider {
  @apply absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white;
  @apply transition-transform duration-200 ease-out;
  transform: translateX(0);
}

.switch-active .switch-slider {
  transform: translateX(1.25rem);
}
</style>
