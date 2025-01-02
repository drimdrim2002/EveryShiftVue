<template>
  <Avatar>
    <AvatarImage
      :src="profile?.avatar_url || ''"
      :alt="`Avatar of ${profile?.full_name}`"
      :title="profile?.full_name"
    />
    <AvatarFallback>U</AvatarFallback>
  </Avatar>
</template>

<script setup lang="ts">
import type { AvatarProfile } from '@/types/AvatarProfile'
defineProps<{ profile: AvatarProfile | null }>()
</script>

<style scoped></style>
