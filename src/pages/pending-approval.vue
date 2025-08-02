<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { employee, profile } = storeToRefs(authStore)

const getRoleDisplayName = (role: string) => {
  switch (role) {
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending_approval': return 'text-yellow-600'
    case 'approved': return 'text-green-600'
    case 'rejected': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

// 로그아웃 함수
const logout = async () => {
  await authStore.logout()
  await useRouter().push('/login')
}
</script>

<template>
  <div class="pending-approval-page min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-md p-6 border rounded-md">
      <CardHeader class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <CardTitle class="my-0">승인 대기 중</CardTitle>
        <CardDescription>관리자의 승인을 기다리고 있습니다</CardDescription>
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
            <span class="text-sm font-medium text-muted-foreground">직책</span>
            <span class="text-sm">{{ employee.position || '-' }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="employee">
            <span class="text-sm font-medium text-muted-foreground">상태</span>
            <span class="text-sm font-medium" :class="getStatusColor(employee.status)">
              {{ getStatusDisplayName(employee.status) }}
            </span>
          </div>
        </div>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-blue-900 mb-1">승인 절차 안내</h4>
              <div class="text-sm text-blue-800 space-y-1">
                <p v-if="employee?.role === 'manager'">
                  • 최고 관리자(Superuser)가 귀하의 조직 관리자 신청을 검토합니다.
                </p>
                <p v-else>
                  • 조직 관리자 또는 최고 관리자가 귀하의 직원 신청을 검토합니다.
                </p>
                <p>• 승인이 완료되면 이메일로 알림을 받게 됩니다.</p>
                <p>• 승인 후 시스템의 모든 기능을 이용할 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 거부된 경우 안내 -->
        <div v-if="employee?.status === 'rejected'" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-red-900 mb-1">신청이 거부되었습니다</h4>
              <p class="text-sm text-red-800">
                관리자에게 문의하여 거부 사유를 확인하고 다시 신청해 주세요.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter class="flex justify-center space-x-3 pt-6">
        <Button @click="logout" variant="outline">
          로그아웃
        </Button>
        <Button @click="$router.go(0)" variant="outline">
          새로고침
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
.pending-approval-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
</style>