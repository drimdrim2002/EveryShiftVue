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

const displayTooltip = ref(false)
const tooltipIcon = useTemplateRef('tooltip-icon')
const tooltipParagraph = useTemplateRef('tooltip-paragraph')
const tooltipPosition = ref({ top: 0, left: 0 })

function toggleTooltip() {
  displayTooltip.value = !displayTooltip.value

  if (tooltipIcon.value && displayTooltip.value) {
    // Access the exposed DOM element
    const domElement = tooltipIcon.value.infoElement
    console.log(domElement?.getBoundingClientRect())

    if (domElement) {
      tooltipPosition.value = {
        top:
          domElement.getBoundingClientRect().bottom -
          domElement.getBoundingClientRect().top -
          domElement.getBoundingClientRect().height * 2,
        left:
          domElement.getBoundingClientRect().right -
          domElement.getBoundingClientRect().left -
          domElement.getBoundingClientRect().width, // Adjust to position on the left side
      }
      console.log(tooltipPosition.value)
    }
  }
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
    <div class="flex items-center gap-2">
      <p
        v-if="displayTooltip"
        ref="tooltip-paragraph"
        class="bg-green-300 text-slate-700 text-sm rounded px-3 py-2 shadow-lg"
        :style="{
          top: tooltipPosition.top + 'px',
          left: tooltipPosition.left + 'px',
          position: 'relative',
        }"
      >
        Click the status icon to toggle the value
      </p>
      <Info
        ref="tooltip-icon"
        v-if="showToolTip"
        class="text-slate-500 hover:cursor-pointer"
        tabindex="0"
        @focus="toggleTooltip"
        @blur="displayTooltip = false"
        @click="toggleTooltip"
      ></Info>
    </div>
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
