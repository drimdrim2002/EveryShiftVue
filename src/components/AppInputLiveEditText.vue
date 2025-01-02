<script setup lang="ts">
// TODO > Be careful about the source value.
// You can't use dual-binding (v-model) with optional chaining (object?.property)
// See https://stackoverflow.com/questions/74450389/how-do-i-use-vue3-typescript-v-model-on-textfield-error-invalid-assignment/74450619#74450619
const userInput = defineModel<string | null>()
const { type = 'text' } = defineProps<{ type: string }>()
const emits = defineEmits<{
  (event: '@commit'): void
  (event: 'blur'): void
}>()

const update = () => {
  emits('@commit')
}

const textareaEl = ref<HTMLTextAreaElement>()
const readonlyEl = ref<HTMLParagraphElement>()
const isEditing = ref(false)
const startEditing = () => {
  isEditing.value = true
  const styles = window.getComputedStyle(readonlyEl.value!)
  const fontSize = parseFloat(styles.fontSize)
  const lineHeight = fontSize * 1.2
  const contentHeight = readonlyEl.value?.offsetHeight
  console.log('startEditing>contentHeight', contentHeight)
  console.log('startEditing>lineHeight', lineHeight)
  const rows = Math.ceil(contentHeight! / lineHeight)
  console.log('startEditing>rows', rows)

  // Focus the textarea after it becomes visible
  // TODO > handle the blur with a v-show
  nextTick(() => {
    textareaEl.value?.focus()
    // Adjust textarea size if needed
    if (textareaEl.value && readonlyEl.value) {
      // textareaEl.value.style.width = `${width}px`
      // textareaEl.value.style.height = `${height}px`
      textareaEl.value.rows = rows + 1
      textareaEl.value.scrollTop = 0
      textareaEl.value.style.overflowY = 'scroll'
    }
  })
}

const stopEditing = () => {
  isEditing.value = false
  emits('@commit')
}
</script>
<template>
  <!-- TODO > @keyup.enter="($event.target as HTMLInputElement).blur()" 
              requires an explicit cast of $event.target -->
  <input
    v-if="type === 'text'"
    class="live-input"
    :type
    v-model="userInput"
    @blur="update"
    @keyup.enter="($event.target as HTMLInputElement).blur()"
  />
  <div v-else>
    <p
      v-show="!isEditing"
      ref="readonlyEl"
      @click="startEditing"
      @focus="startEditing"
      tabindex="0"
    >
      {{ userInput }}
    </p>
    <textarea
      v-model="userInput"
      v-show="isEditing"
      @blur="stopEditing"
      ref="textareaEl"
      class="live-textarea"
      required
    ></textarea>
  </div>
</template>

<style scoped>
.live-input {
  @apply w-full resize-none p-1 bg-transparent focus:outline-double focus:border-separate focus:bg-slate-100 focus:text-black focus:rounded-sm;
}

.live-textarea {
  @apply w-full text-slate-600 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded px-3.5 py-2.5 outline-none focus:bg-white;
}
</style>
