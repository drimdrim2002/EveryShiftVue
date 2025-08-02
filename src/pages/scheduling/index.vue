<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { employee, profile } = storeToRefs(authStore)

// This page should only be accessible to Manager and Superuser roles
</script>

<template>
  <div class="scheduling-page p-6">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground mb-2">스케줄링 관리</h1>
        <p class="text-muted-foreground">AI 기반 자동 스케줄 생성 및 최적화</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- AI 스케줄 생성 -->
        <Card class="p-6 lg:col-span-2">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              AI 스케줄 생성기
            </CardTitle>
            <CardDescription>Google Cloud Run AI Solver를 활용한 최적 스케줄 생성</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-900 mb-2">AI 스케줄링 특징</h4>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• 직원 선호도 및 제약 조건 자동 반영</li>
                <li>• 공정한 근무 시간 분배</li>
                <li>• 최소 인력 요구사항 보장</li>
                <li>• 연속 근무 및 휴식 시간 최적화</li>
              </ul>
            </div>
            
            <div class="flex gap-4">
              <Button disabled>스케줄 생성</Button>
              <Button variant="outline" disabled>이전 스케줄 불러오기</Button>
            </div>
          </CardContent>
        </Card>

        <!-- 스케줄 설정 -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>스케줄 설정</CardTitle>
            <CardDescription>생성할 스케줄의 기본 설정</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <label class="text-sm font-medium text-foreground">기간 선택</label>
              <select class="w-full mt-1 p-2 border border-input bg-background rounded-md" disabled>
                <option>1주일</option>
                <option>2주일</option>
                <option>1개월</option>
              </select>
            </div>
            
            <div>
              <label class="text-sm font-medium text-foreground">시작 날짜</label>
              <input type="date" class="w-full mt-1 p-2 border border-input bg-background rounded-md" disabled />
            </div>
            
            <div>
              <label class="text-sm font-medium text-foreground">우선순위</label>
              <select class="w-full mt-1 p-2 border border-input bg-background rounded-md" disabled>
                <option>공정성 우선</option>
                <option>효율성 우선</option>
                <option>선호도 우선</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 현재 스케줄 미리보기 -->
      <div class="mt-8">
        <Card class="p-6">
          <CardHeader>
            <CardTitle>현재 스케줄 현황</CardTitle>
            <CardDescription>생성된 스케줄 미리보기 및 수정</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="bg-gray-50 border rounded-lg p-8 text-center">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-600 mb-2">스케줄이 생성되지 않았습니다</p>
              <p class="text-sm text-gray-500">AI 스케줄 생성기를 사용하여 새로운 스케줄을 만들어보세요.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 관리자 안내 -->
      <div class="mt-6">
        <Card class="p-6 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle class="text-amber-800">관리자 전용 기능</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <p class="text-sm text-amber-800">
                  이 페이지는 <strong>조직 관리자(Manager)</strong> 및 <strong>최고 관리자(Superuser)</strong>만 접근할 수 있습니다.
                  스케줄 생성 및 관리 권한이 필요한 기능들이 포함되어 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scheduling-page {
  min-height: calc(100vh - 4rem);
  background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
}
</style>