<script setup lang="ts">
import type { FormDataCreateEntity } from '@/types/FormDataCreateEntity'
import { slugify } from '@/utils/slugify'

const sheetOpen = defineModel<boolean>()

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const { createEntity } = useEntityStore()

// Fill in the slug as the name is typed
const slugValue = ref('')
let userEditedSlug = ref(false)

const updateSlug = (value: string | undefined) => {
  console.log('updateSlug called with', value, userEditedSlug.value, slugValue.value)

  if (!value) return
  if (!userEditedSlug.value) {
    slugValue.value = slugify(value)
  }
}
const enterSlugEditing = () => (userEditedSlug.value = true)
const exitSlugEditing = () =>
  slugValue.value === '' ? (userEditedSlug.value = false) : (userEditedSlug.value = true)
// Handle new Entity creation
const submitNewEntity = async (formData: FormDataCreateEntity) => {
  const entity = { ...formData }
  await createEntity(entity)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new Entity</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="submitNewEntity"
        submit-label="Create"
        :config="{ validationVisibility: 'submit' }"
      >
        <FormKit
          type="text"
          name="name"
          id="name"
          label="Name"
          validation="required|lenght:3,255"
          @input="updateSlug"
        />
        <FormKit
          type="text"
          name="slug"
          id="slug"
          label="Slug"
          validation="required|length:3,60|matches:/^[a-z0-9-]+$/"
          v-model="slugValue"
          @focusin="enterSlugEditing"
          @blur="exitSlugEditing"
        />
        <FormKit
          type="textarea"
          name="description"
          id="description"
          label="Description"
          validation="0,500"
        />
      </FormKit>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
