<template>
  <RouterLink
    v-if="profile"
    class="w-full h-full flex items-center justify-start"
    :to="{ name: `/profiles/[username]`, params: { username: profile.username } }"
  >
    <AppAvatar :profile />
  </RouterLink>
</template>

<script setup lang="ts">
import type { AvatarProfileLink } from '@/types/AvatarProfileLink'
defineProps<{ profile: AvatarProfileLink | null }>()
</script>

<style scoped></style>
