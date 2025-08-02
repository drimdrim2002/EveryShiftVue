<template>
  <Avatar>
    <AvatarImage
      :src="profile?.avatar_url || ''"
      :alt="`Avatar of ${profile?.full_name}`"
      :title="profile?.full_name"
    />
    <AvatarFallback>{{ getInitials(profile?.full_name || 'User') }}</AvatarFallback>
  </Avatar>
</template>

<script setup lang="ts">
import type { AvatarProfile } from '@/types/AvatarProfile'

defineProps<{ profile: AvatarProfile | null }>()

/**
 * 이름에서 이니셜을 추출하는 함수
 * @param name 전체 이름 또는 사용자명
 * @returns 이니셜 (최대 2글자)
 */
const getInitials = (name: string): string => {
  if (!name) return 'U'

  // 한글 이름 처리 (예: "혁준 손" -> "혁준", "홍길동" -> "길동")
  if (/[가-힣]/.test(name)) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      // 성과 이름이 분리된 경우 - 이름(첫 번째 이름)만 반환 (예: "혁준 손" -> "혁준")
      return parts[0]
    } else {
      // 하나로 붙어있는 경우 - 성을 제외한 이름 부분 (예: "홍길동" -> "길동")
      return parts[0].slice(1) || parts[0].charAt(0)
    }
  }

  // 영문 이름 처리 (예: "John Doe" -> "JD")
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  }

  // 단일 단어인 경우 첫 글자만 (예: "Superuser" -> "S")
  return name.charAt(0).toUpperCase()
}
</script>

<style scoped></style>
