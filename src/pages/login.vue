<script setup lang="ts">
import { loginWithSupabase } from '@/services/supabase-auth'
import AppLoginForm from '@/components/AppLoginForm.vue'
import type UserLoginRequest from '@/types/UserLoginRequest'

const router = useRouter()
const loginError = ref<string>('')
const isLoading = ref(false)

const sigin = async (request: UserLoginRequest) => {
  isLoading.value = true
  loginError.value = ''

  try {
    const { error } = await loginWithSupabase({ formData: request })

    if (error) {
      // 사용자 친화적인 에러 메시지로 변환
      loginError.value = getLoginErrorMessage(error)
    } else {
      router.push('/')
    }
  } catch (err: unknown) {
    console.error(err)
    loginError.value = '로그인 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
}

const getLoginErrorMessage = (error: { message?: string }): string => {
  // Supabase 에러 코드에 따른 사용자 친화적 메시지
  const errorMessage = error.message?.toLowerCase() || ''

  if (errorMessage.includes('invalid login credentials') || errorMessage.includes('invalid_credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다. 브라우저에 저장된 비밀번호가 다를 수 있으니 직접 입력해보세요.'
  }

  if (errorMessage.includes('email not confirmed')) {
    return '이메일 인증이 필요합니다. 이메일을 확인해주세요.'
  }

  if (errorMessage.includes('too many requests')) {
    return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
  }

  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return '네트워크 연결을 확인하고 다시 시도해주세요.'
  }

  // 기본 메시지
  return '로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해주세요.'
}
</script>

<template>
  <div class="page-login min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-sm p-6 border rounded-lg shadow-sm">
      <CardHeader class="text-center">
        <CardTitle class="my-0" :is-page-title="true">Login</CardTitle>
        <CardDescription>Use your credentials to login to your account</CardDescription>
      </CardHeader>
      <hr class="my-6 w-full border-border" />
      <CardContent>
        <!-- 에러 메시지 표시 -->
        <div v-if="loginError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm text-red-800">{{ loginError }}</p>
          </div>
        </div>

        <AppLoginForm @@login="sigin" :disabled="isLoading" />

        <!-- 로딩 상태 표시 -->
        <div v-if="isLoading" class="mt-4 flex items-center justify-center">
          <div class="flex items-center space-x-2 text-brand">
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm">로그인 중...</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
