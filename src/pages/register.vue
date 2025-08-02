<script setup lang="ts">
import type { EveryShiftRegistrationData } from '@/types/EveryShiftRegistration'
import { signupWithEmail } from '@/services/supabase-auth'
import { createOrganizationQuery } from '@/services/organization-queries'
import { createEmployeeQuery } from '@/services/employee-queries'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()

const signup = async (formData: EveryShiftRegistrationData) => {
  try {
    console.log('회원가입 시작:', formData)
    
    // 1. 기본 사용자 계정 생성
    console.log('1. 사용자 계정 생성 시작')
    const { error: authError, needsConfirmation } = await signupWithEmail({ 
      formData: {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }
    }) as { error: any, needsConfirmation?: boolean }
    
    if (authError) {
      console.error('사용자 계정 생성 실패:', authError)
      return
    }
    
    if (needsConfirmation) {
      console.log('이메일 확인이 필요합니다.')
      // 이메일 확인 페이지로 이동하거나 알림 표시
      alert('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
      router.push('/login')
      return
    }
    
    console.log('1. 사용자 계정 생성 완료')

    // 2. 현재 사용자 정보 가져오기
    console.log('2. 사용자 정보 가져오기 시작')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('사용자 정보를 찾을 수 없습니다.')
      return
    }
    console.log('2. 사용자 정보 가져오기 완료:', user.id)

    let organizationId = formData.organizationId

    // 3. Manager인 경우 조직 먼저 생성
    if (formData.role === 'manager') {
      const { data: orgData, error: orgError } = await createOrganizationQuery({
        name: formData.organizationName!,
        workplace_type: formData.workplaceType!,
        shift_pattern: { type: formData.shiftPattern },
        skill_categories: formData.skillCategories || [],
        credit_settings: formData.creditSettings || {}
      })

      if (orgError || !orgData) {
        console.error('조직 생성 실패:', orgError)
        return
      }

      organizationId = orgData.id
    }

    // 4. Employee 정보 생성
    const { error: employeeError } = await createEmployeeQuery({
      profile_id: user.id,
      organization_id: organizationId!,
      role: formData.role,
      position: formData.position,
      skills: formData.skills || [],
      status: 'pending_approval'
    })

    if (employeeError) {
      console.error('직원 정보 생성 실패:', employeeError)
      return
    }

    // 5. 승인 대기 페이지로 이동
    router.push('/pending-approval')
    
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error)
  }
}
</script>

<template>
  <div class="page-register m-4">
    <Card class="p-6 border rounded-md">
      <CardHeader>
        <CardTitle class="my-0" :is-page-title="true">EveryShift 회원가입</CardTitle>
        <CardDescription>교대 근무 스케줄링 시스템에 가입하세요</CardDescription>
      </CardHeader>
      <hr class="my-8 w-full" />
      <CardContent>
        <EveryShiftRegisterForm @register="signup" />
      </CardContent>
    </Card>
  </div>
</template>
