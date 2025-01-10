<template>
  <div>
    <DataTable v-if="entities" :columns :data="entities" />
  </div>
</template>

<script setup lang="ts">
usePageStore().pageData.title = 'Entities'

import { columns } from '@/utils/datatable-columns-entity'

const entityStore = useEntityStore()
const { entities } = storeToRefs(entityStore)
// `entities` is reactive from the store.
// as soon as the `getEntities` is called and done,
// the entities are loaded
await entityStore.getEntities()
</script>

<style scoped></style>
