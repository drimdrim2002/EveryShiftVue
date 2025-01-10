<script setup lang="ts">
import type { FormDataCreateSubEntity } from '@/types/FormDataCreateSubEntity'
import type { FormSelectOption } from '@/types/FormSelectOption'

const sheetOpen = defineModel<boolean>()
const selectOptions = ref({
  entities: [] as FormSelectOption[],
  profiles: [] as FormSelectOption[],
})

const authStore = useAuthStore()
const { profile: currentUser } = storeToRefs(authStore)
const entityStore = useEntityStore()
const { entities } = storeToRefs(entityStore)
const profileStore = useProfileStore()
const { profiles } = storeToRefs(profileStore)
const { createSubEntity } = useSubEntityStore()
const setEntitiesOptions = async () => {
  await entityStore.getEntities()

  if (!entities.value) return

  entities.value.forEach((entity) => {
    selectOptions.value.entities.push({ label: entity.name, value: entity.id })
  })
}

const setProfilesOptions = async () => {
  await profileStore.getProfiles()

  if (!profiles.value) return

  profiles.value.forEach((profile) => {
    selectOptions.value.profiles.push({ label: profile.full_name, value: profile.id })
  })
}

await Promise.all([setEntitiesOptions(), setProfilesOptions()])

const submitNewSubEntity = async (formData: FormDataCreateSubEntity) => {
  const object = { ...formData }
  console.log('submitNewSubEntity', object)

  await createSubEntity(object)
  const parentSelected = entities.value!.find((element) => element.id === formData.entity_id)
  await entityStore.refreshEntity(parentSelected?.slug!)
  sheetOpen.value = false
}
</script>
<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Let's create a new Sub Entity</SheetTitle>
      </SheetHeader>
      <FormKit
        type="form"
        @submit="submitNewSubEntity"
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
        <FormKit
          type="select"
          name="profile_id"
          id="profile_id"
          label="Assignee"
          placeholder="Select an Assignee"
          :options="selectOptions.profiles"
          validation="required"
        />
        <FormKit
          type="select"
          name="entity_id"
          id="entity_id"
          label="Entity"
          placeholder="Select an Entity"
          :options="selectOptions.entities"
          validation="required"
        />
        <FormKit
          type="date"
          name="due_date"
          id="due_date"
          label="Due Date"
          placeholder="Select Due Date"
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
