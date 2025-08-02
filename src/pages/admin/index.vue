<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { employee, profile } = storeToRefs(authStore)

// This page should only be accessible to Superuser and Manager roles
</script>

<template>
  <div class="admin-page p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">관리자 대시보드</h1>
        <p class="text-muted-foreground">EveryShift 시스템 관리</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 사용자 관리 카드 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              사용자 관리
            </CardTitle>
            <CardDescription>직원 승인 및 역할 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">새로운 가입 신청을 검토하고 직원 권한을 관리합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 조직 관리 카드 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              조직 관리
            </CardTitle>
            <CardDescription>조직 설정 및 구조 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">조직의 기본 설정과 부서, 사이트를 관리합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 시스템 설정 카드 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              시스템 설정
            </CardTitle>
            <CardDescription>전역 설정 및 환경 구성</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">시스템 전체 설정과 AI Solver 연동을 관리합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>
      </div>

      <!-- 현재 관리자 정보 -->
      <div class="mt-8">
        <Card class="p-6">
          <CardHeader>
            <CardTitle>현재 관리자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-medium text-muted-foreground">이름:</span>
                <span class="ml-2">{{ profile?.full_name }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">역할:</span>
                <span class="ml-2 capitalize">{{ employee?.role }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">직책:</span>
                <span class="ml-2">{{ employee?.position || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">상태:</span>
                <span class="ml-2 text-green-600">{{ employee?.status }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  min-height: calc(100vh - 4rem);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
</style>