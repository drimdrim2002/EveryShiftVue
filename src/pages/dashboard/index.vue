<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { employee, profile } = storeToRefs(authStore)

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case 'superuser': return '최고 관리자'
    case 'manager': return '조직 관리자'
    case 'employee': return '직원'
    default: return role
  }
}

// This page should be accessible to all approved users (superuser, manager, employee)
</script>

<template>
  <div class="dashboard-page p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">대시보드</h1>
        <p class="text-muted-foreground">EveryShift 근무 스케줄 현황</p>
      </div>

      <!-- 사용자별 맞춤 콘텐츠 -->
      <div class="mb-6">
        <Card class="p-6">
          <CardHeader>
            <CardTitle>안녕하세요, {{ profile?.full_name }}님!</CardTitle>
            <CardDescription>{{ getRoleDisplayName(employee?.role || '') }}으로 로그인하셨습니다.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 내 스케줄 카드 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              내 스케줄
            </CardTitle>
            <CardDescription>이번 주 근무 일정</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">내 근무 스케줄을 확인하고 변경 요청을 할 수 있습니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 팀 현황 카드 (Manager/Superuser만) -->
        <Card class="p-6" v-if="employee?.role === 'manager' || employee?.role === 'superuser'">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              팀 현황
            </CardTitle>
            <CardDescription>팀 근무 현황 및 관리</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">팀원들의 근무 현황과 스케줄 조정을 관리합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 선호도 설정 카드 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              근무 선호도
            </CardTitle>
            <CardDescription>선호하는 근무 시간대 설정</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">선호하는 근무 시간대와 휴무 희망일을 설정합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 스케줄링 관리 (Manager/Superuser만) -->
        <Card class="p-6" v-if="employee?.role === 'manager' || employee?.role === 'superuser'">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              AI 스케줄링
            </CardTitle>
            <CardDescription>자동 스케줄 생성 및 최적화</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">AI를 활용한 최적 스케줄 생성과 조정을 수행합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 통계 및 리포트 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              근무 통계
            </CardTitle>
            <CardDescription>근무 시간 및 성과 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">내 근무 통계와 성과를 분석하고 확인합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>

        <!-- 알림 및 공지 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 0115 0v10z"></path>
              </svg>
              알림
            </CardTitle>
            <CardDescription>중요 공지사항 및 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">스케줄 변경 알림과 중요 공지사항을 확인합니다.</p>
            <Button disabled>준비 중</Button>
          </CardContent>
        </Card>
      </div>

      <!-- 현재 사용자 정보 -->
      <div class="mt-8">
        <Card class="p-6">
          <CardHeader>
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-medium text-muted-foreground">이름:</span>
                <span class="ml-2">{{ profile?.full_name }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">역할:</span>
                <span class="ml-2">{{ getRoleDisplayName(employee?.role || '') }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">직책:</span>
                <span class="ml-2">{{ employee?.position || '-' }}</span>
              </div>
              <div>
                <span class="font-medium text-muted-foreground">보유 크레딧:</span>
                <span class="ml-2">{{ employee?.credits || 0 }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 4rem);
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
}
</style>