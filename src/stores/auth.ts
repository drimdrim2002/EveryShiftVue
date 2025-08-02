import { type Session, type User } from '@supabase/supabase-js'
import type { Tables } from '@/types/DatabaseTypes'
import { type UserProfile } from '@/services/supabase-profile-queries'
import { logoutFromSupabase, retrieveCurrentSession } from '@/services/supabase-auth'
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { supabase } from '@/lib/supabaseClient'
import type { UserRole } from '@/composables/useRoleAuth'

export const useAuthStore = defineStore('auth-store', () => {
  // TODO > reenable this if querying supabase
  const user = ref<null | User>(null)
  // TODO > remove this if querying supabase
  // const user = ref<null | User>({
  //   id: '29d6afde-e2eb-4899-919c-1f9c47a7f746',
  //   aud: '',
  //   app_metadata: {},
  //   user_metadata: {},
  //   created_at: toISOStringWithTimezone(new Date(Date.now())),
  // })
  const profile = ref<null | UserProfile>(null)
  const employee = ref<null | Tables<'employees'>>(null)
  const isTrackingAuthChanges = ref(false)

  const setAuth = async ({ session }: { session: null | Session; nextPageOnError?: string }) => {
    if (!session) {
      user.value = null
      profile.value = null
      employee.value = null
      return
    }

    user.value = session.user
    await setProfile()
    await setEmployee()
  }

  const setProfile = async () => {
    if (!user.value) {
      // no user = no possible to fetch a profile
      profile.value = null
      return
    }
    if (!profile.value || profile.value.id !== user.value?.id) {
      const profileStore = useProfileStore()
      const { profile: authProfile } = storeToRefs(profileStore)
      await profileStore.getProfile({ column: 'id', value: user.value.id })
      profile.value = authProfile.value || null
      
      // 디버깅: 프로필 데이터 로그
      if (import.meta.env.DEV) {
        console.log('Auth Store - 프로필 데이터 로드:', {
          userId: user.value.id,
          profileData: profile.value,
          username: profile.value?.username
        })
      }
    }
  }

  const setEmployee = async () => {
    if (!user.value) {
      employee.value = null
      return
    }

    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('profile_id', user.value.id)
        .maybeSingle() // single() 대신 maybeSingle() 사용

      if (error) {
        console.error('직원 정보 조회 에러:', error)
        employee.value = null
        return
      }

      // data가 null이면 직원 정보가 없는 경우
      employee.value = data || null
      
      if (!data) {
        console.log('직원 정보가 없습니다. 일반 사용자이거나 아직 승인되지 않은 상태입니다.')
      }
    } catch (error) {
      console.error('직원 정보 로드 중 오류:', error)
      employee.value = null
    }
  }

  const getSession = async () => {
    const { error: authError } = await retrieveCurrentSession()

    if (authError) {
      useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
    }
  }

  const logout = async () => {
    const { error: authError } = await logoutFromSupabase()
    if (authError) {
      useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
      return { isLoggedOut: false }
    }
    return { isLoggedOut: true }
  }

  const trackAuthChanges = () => {
    if (isTrackingAuthChanges.value) {
      return
    }
    isTrackingAuthChanges.value = false
    supabase.auth.onAuthStateChange((event, session) => {
      // See https://supabase.com/docs/reference/javascript/auth-onauthstatechange
      setTimeout(async () => {
        await useAuthStore().setAuth({ session })
      }, 0)
    })
  }

  // 역할 확인 헬퍼 함수들
  const checkRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!employee.value || employee.value.status !== 'approved') {
      return false
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    return roles.includes(employee.value.role)
  }

  const canAccessOrganization = (organizationId: string): boolean => {
    if (!employee.value || employee.value.status !== 'approved') {
      return false
    }

    // Superuser는 모든 조직에 접근 가능
    if (employee.value.role === 'superuser') {
      return true
    }

    // Manager와 Employee는 본인 조직만 접근 가능
    return employee.value.organization_id === organizationId
  }

  const isApproved = computed(() => employee.value?.status === 'approved')
  const isPending = computed(() => employee.value?.status === 'pending_approval')
  const isRejected = computed(() => employee.value?.status === 'rejected')
  const isSuperuser = computed(() => checkRole('superuser'))
  const isManager = computed(() => checkRole('manager'))
  const isEmployee = computed(() => checkRole('employee'))
  const isAdmin = computed(() => checkRole(['superuser', 'manager']))

  return { 
    user, 
    profile, 
    employee,
    setAuth, 
    setProfile, 
    setEmployee,
    getSession, 
    logout, 
    trackAuthChanges,
    checkRole,
    canAccessOrganization,
    isApproved,
    isPending,
    isRejected,
    isSuperuser,
    isManager,
    isEmployee,
    isAdmin
  }
})
