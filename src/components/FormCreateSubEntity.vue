<script setup lang="ts">
import { Form as VeeForm } from 'vee-validate'

import type { FormDataCreateSubEntity } from '@/types/FormDataCreateSubEntity'
import type { FormSelectOption } from '@/types/FormSelectOption'

const sheetOpen = defineModel<boolean>()
const form = ref<FormDataCreateSubEntity>({
  name: '',
  description: '',
  entity_id: '',
  profile_id: '',
})

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

const submitNewSubEntity = async () => {
  await createSubEntity(form.value)
  const parentSelected = entities.value!.find(
    (element) => element.id.toString() === form.value.entity_id,
  )
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
      <vee-form @submit="submitNewSubEntity">
        <app-form-field
          type="text"
          name="sub_entity_name"
          v-model="form.name"
          label="Name"
          :rules="{ required: true, regex: /^(.){3,255}$/ }"
        />
        <app-form-field
          class=""
          as="select"
          name="sub_entity_profile_id"
          v-model="form.profile_id"
          label="Assignee"
          placeholder="Select an Assignee"
          rules="required"
        >
          <option value="" disabled>Select a profile</option>
          <option
            v-for="profile in selectOptions.profiles"
            :key="profile.value"
            :value="profile.value"
          >
            {{ profile.label }}
          </option></app-form-field
        >
        <app-form-field
          as="select"
          name="sub_entity_entity_id"
          v-model="form.entity_id"
          label="Entity"
          placeholder="Select an Entity"
          rules="required"
        >
          <option value="" disabled>Select an entity</option>
          <option
            v-for="entity in selectOptions.entities"
            :key="entity.value.toString()"
            :value="entity.value.toString()"
          >
            {{ entity.label }}
          </option>
        </app-form-field>
        <app-form-field
          as="textarea"
          name="description"
          v-model="form.description"
          label="Description"
          validation="0,500"
        />
        <button type="submit" class="btn btn-primary">Create</button>
      </vee-form>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
