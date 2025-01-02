<script setup lang="ts">
import { StoreCacheKey } from '@/types/StoreCacheKeys'

type CacheType = {
  name: string
  key: string | StoreCacheKey
}
const caches = [{ name: 'Profiles', key: StoreCacheKey.AllProfiles }]

const profileStore = useProfileStore()

const purge = (cache: CacheType) => {
  console.info('purge', cache)

  if (cache.key === StoreCacheKey.AllProfiles) {
    console.info('purge>match', cache.key)
    profileStore.clearCache()
  }
}
</script>
<template>
  <Button v-for="cache in caches" :key="cache.key" @click="purge(cache)"
    >Invalidate {{ cache.name }}</Button
  >
</template>

<style scoped></style>
