<script setup lang="ts">
import type { FormDataCreateEntity } from '@/types/FormDataCreateEntity'

const sheetOpen = defineModel<boolean>()

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const { createEntity } = useEntityStore()

const submitNewEntity = async (formData: FormDataCreateEntity) => {
  const entity = { ...formData }
  console.log('submitNewProject', entity)

  await createEntity(entity)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new task</SheetTitle>
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
        />
        <FormKit type="text" name="slug" id="slug" label="Slug" validation="required|lenght:3,60" />
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
