<script setup lang="ts">
import type { Database } from '@/types/DatabaseTypes'

const status = defineModel<Database['public']['Enums']['current_status'] | string | undefined>()
// TODO > From Vue 3.5, no need to use withDefaults to assign a default value to props
const {
  readonly = false,
  showToolTip = true,
  pointer = true,
} = defineProps<{
  readonly?: boolean
  showToolTip?: boolean
  pointer?: boolean
}>()
const emits = defineEmits<{
  (event: '@commit'): void
}>()
const toggleValue = () => {
  if (readonly) return

  if (status.value === 'completed') status.value = 'in-progress'
  if (status.value === 'todo') status.value = 'in-progress'
  if (status.value === 'in-progress') status.value = 'completed'
  emits('@commit')
}
</script>
<template>
  <div class="flex flex-row justify-between">
    <div
      class="text-3xl"
      :class="{ 'cursor-pointer': pointer }"
      @click="toggleValue"
      @keyup.enter="toggleValue"
      tabindex="0"
    >
      <Transition mode="out-in">
        <span v-if="status === 'todo'" class="text-gray-400" :title="status"
          ><CircleDotDashed
        /></span>
        <span v-else-if="status === 'completed'" class="text-green-400" :title="status"
          ><CircleCheckBig
        /></span>
        <span v-else class="text-orange-500" :title="status"><CircleDashed /></span>
      </Transition>
    </div>
    <AppToolTip :showToolTip />
  </div>
</template>

<style scoped>
.v-enter-active,
v-leave-active {
  transition: transform 0.2s;
}

.v-enter-from,
v-leave-to {
  transform: scale(0.3);
}
</style>
