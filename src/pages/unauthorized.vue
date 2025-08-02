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

const getStatusDisplayName = (status: string) => {
  switch (status) {
    case 'pending_approval': return '승인 대기 중'
    case 'approved': return '승인됨'
    case 'rejected': return '거부됨'
    default: return status
  }
}

const goBack = () => {
  window.history.back()
}

const goHome = () => {
  useRouter().push('/')
}
</script>

<template>
  <div class="unauthorized-page min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md p-6 border rounded-md">
      <CardHeader class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <CardTitle class="my-0">접근 권한이 없습니다</CardTitle>
        <CardDescription>이 페이지에 접근할 권한이 없습니다</CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="bg-background border rounded-lg p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-muted-foreground">사용자명</span>
            <span class="text-sm">{{ profile?.username }}</span>
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-muted-foreground">이름</span>
            <span class="text-sm">{{ profile?.full_name }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="employee">
            <span class="text-sm font-medium text-muted-foreground">역할</span>
            <span class="text-sm">{{ getRoleDisplayName(employee.role) }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="employee">
            <span class="text-sm font-medium text-muted-foreground">상태</span>
            <span class="text-sm">{{ getStatusDisplayName(employee.status) }}</span>
          </div>
        </div>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-red-900 mb-1">접근 불가 안내</h4>
              <div class="text-sm text-red-800 space-y-1">
                <p v-if="!employee">
                  • EveryShift 시스템에 등록되지 않은 사용자입니다.
                </p>
                <p v-else-if="employee.status === 'pending_approval'">
                  • 계정 승인이 완료된 후 이용할 수 있습니다.
                </p>
                <p v-else-if="employee.status === 'rejected'">
                  • 계정이 거부되었습니다. 관리자에게 문의하세요.
                </p>
                <p v-else>
                  • 현재 역할({{ getRoleDisplayName(employee.role) }})로는 이 페이지에 접근할 수 없습니다.
                </p>
                <p>• 필요한 권한이 있다고 생각되면 관리자에게 문의하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter class="flex justify-center space-x-3 pt-6">
        <Button @click="goBack" variant="outline">
          이전 페이지
        </Button>
        <Button @click="goHome">
          홈으로
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
.unauthorized-page {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  min-height: 100vh;
}
</style>