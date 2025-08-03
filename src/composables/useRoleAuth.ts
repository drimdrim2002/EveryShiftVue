import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabaseClient'

export type UserRole = 'superuser' | 'manager' | 'employee'

export interface EmployeeInfo {
  id: string
  role: UserRole
  organization_id: string
  status: 'pending_approval' | 'approved' | 'rejected'
  position?: string | null
  skills: string[]
  credits: number
}

/**
 * 역할 기반 접근 제어를 위한 컴포저블
 * EveryShift의 Superuser/Manager/Employee 역할별 권한을 관리합니다.
 */
export const useRoleAuth = () => {
  const authStore = useAuthStore()
  const { user, profile } = storeToRefs(authStore)

  // 현재 사용자의 직원 정보
  const currentEmployee = ref<EmployeeInfo | null>(null)

  /**
   * 사용자가 특정 역할을 가지고 있는지 확인
   * @param requiredRoles 필요한 역할들
   * @returns 권한이 있으면 true
   */
  const checkRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!currentEmployee.value || currentEmployee.value.status !== 'approved') {
      return false
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    return roles.includes(currentEmployee.value.role)
  }

  /**
   * 사용자가 특정 조직에 접근할 수 있는지 확인
   * @param organizationId 조직 ID
   * @returns 접근 가능하면 true
   */
  const canAccessOrganization = (organizationId: string): boolean => {
    if (!currentEmployee.value || currentEmployee.value.status !== 'approved') {
      return false
    }

    // Superuser는 모든 조직에 접근 가능
    if (currentEmployee.value.role === 'superuser') {
      return true
    }

    // Manager와 Employee는 본인 조직만 접근 가능
    return currentEmployee.value.organization_id === organizationId
  }

  /**
   * 사용자가 다른 사용자를 승인할 수 있는지 확인
   * @param targetRole 승인하려는 사용자의 역할
   * @returns 승인 권한이 있으면 true
   */
  const canApproveUser = (targetRole: UserRole): boolean => {
    if (!currentEmployee.value || currentEmployee.value.status !== 'approved') {
      return false
    }

    // Superuser는 모든 역할을 승인 가능
    if (currentEmployee.value.role === 'superuser') {
      return true
    }

    // Manager는 Employee만 승인 가능
    if (currentEmployee.value.role === 'manager' && targetRole === 'employee') {
      return true
    }

    return false
  }

  /**
   * 사용자의 현재 승인 상태 확인
   */
  const isApproved = computed(() => {
    return currentEmployee.value?.status === 'approved'
  })

  /**
   * 사용자가 승인 대기 중인지 확인
   */
  const isPending = computed(() => {
    return currentEmployee.value?.status === 'pending_approval'
  })

  /**
   * 사용자가 거부되었는지 확인
   */
  const isRejected = computed(() => {
    return currentEmployee.value?.status === 'rejected'
  })

  /**
   * 현재 사용자가 Superuser인지 확인
   */
  const isSuperuser = computed(() => {
    return checkRole('superuser')
  })

  /**
   * 현재 사용자가 Manager인지 확인
   */
  const isManager = computed(() => {
    return checkRole('manager')
  })

  /**
   * 현재 사용자가 Employee인지 확인
   */
  const isEmployee = computed(() => {
    return checkRole('employee')
  })

  /**
   * 현재 사용자가 관리자 권한을 가지고 있는지 확인 (Superuser 또는 Manager)
   */
  const isAdmin = computed(() => {
    return checkRole(['superuser', 'manager'])
  })

  /**
   * 직원 정보를 로드
   * auth 스토어에서 사용자 정보가 변경될 때 호출됩니다.
   */
  const loadEmployeeInfo = async () => {
    if (!user.value || !profile.value) {
      currentEmployee.value = null
      return
    }

    try {
      // employee 정보를 조회하는 쿼리 (추후 구현될 employee 서비스 사용)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('profile_id', user.value.id)
        .maybeSingle()

      if (error) {
        console.error('직원 정보 로드 실패:', error)
        currentEmployee.value = null
        return
      }

      currentEmployee.value = data
    } catch (error) {
      console.error('직원 정보 로드 중 오류:', error)
      currentEmployee.value = null
    }
  }

  // 사용자 정보 변경 감지를 위한 watch 추가
  watch([user, profile], () => {
    loadEmployeeInfo()
  }, { immediate: true })

  /**
   * 권한 부족 시 보여줄 메시지 생성
   * @param requiredRoles 필요한 역할들
   * @returns 에러 메시지
   */
  const getUnauthorizedMessage = (requiredRoles: UserRole | UserRole[]): string => {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    const roleNames = roles.map(role => {
      switch (role) {
        case 'superuser': return '최고 관리자'
        case 'manager': return '조직 관리자'
        case 'employee': return '직원'
        default: return role
      }
    }).join(', ')

    if (isPending.value) {
      return '계정 승인을 기다리고 있습니다. 관리자에게 문의하세요.'
    }

    if (isRejected.value) {
      return '계정이 거부되었습니다. 관리자에게 문의하세요.'
    }

    return `이 기능을 사용하려면 ${roleNames} 권한이 필요합니다.`
  }

  return {
    // 상태
    currentEmployee: readonly(currentEmployee),
    isApproved,
    isPending,
    isRejected,
    isSuperuser,
    isManager,
    isEmployee,
    isAdmin,

    // 메서드
    checkRole,
    canAccessOrganization,
    canApproveUser,
    loadEmployeeInfo,
    getUnauthorizedMessage
  }
}