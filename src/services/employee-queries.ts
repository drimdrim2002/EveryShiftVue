import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/DatabaseTypes'
import type { QueryData } from '@supabase/supabase-js'

export type Employee = Tables<'employees'>
export type EmployeeInsert = TablesInsert<'employees'>
export type EmployeeUpdate = TablesUpdate<'employees'>

/**
 * 직원 등록 (회원가입 시 사용)
 * @param employeeData 직원 정보
 * @returns 생성된 직원 정보
 */
export const createEmployeeQuery = async (employeeData: EmployeeInsert) => {
  return await supabase.from('employees').insert(employeeData).select().single()
}

/**
 * 직원 정보 업데이트
 * @param id 직원 ID
 * @param updateData 업데이트할 데이터
 * @returns 업데이트된 직원 정보
 */
export const updateEmployeeQuery = async (id: string, updateData: EmployeeUpdate) => {
  return await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
}

/**
 * 직원 정보 조회 (profile_id로)
 * @param profileId 프로필 ID
 * @returns 직원 정보
 */
export const getEmployeeByProfileIdQuery = async (profileId: string) => {
  return await supabase
    .from('employees')
    .select(`
      *,
      organization:organizations(id, name, workplace_type),
      profile:profiles(id, username, full_name, avatar_url)
    `)
    .eq('profile_id', profileId)
    .maybeSingle()
}

export type EmployeeWithDetails = QueryData<ReturnType<typeof getEmployeeByProfileIdQuery>>

/**
 * 조직의 모든 직원 조회
 * @param organizationId 조직 ID
 * @returns 직원 목록
 */
export const getEmployeesByOrganizationQuery = async (organizationId: string) => {
  return await supabase
    .from('employees')
    .select(`
      *,
      profile:profiles(id, username, full_name, avatar_url)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })
}

export type EmployeesWithProfile = QueryData<ReturnType<typeof getEmployeesByOrganizationQuery>>

/**
 * 승인 대기 중인 직원 조회
 * @param organizationId 조직 ID (선택사항, Superuser의 경우 전체 조회)
 * @returns 승인 대기 직원 목록
 */
export const getPendingEmployeesQuery = async (organizationId?: string) => {
  let query = supabase
    .from('employees')
    .select(`
      *,
      organization:organizations(id, name, workplace_type),
      profile:profiles(id, username, full_name, avatar_url)
    `)
    .eq('status', 'pending_approval')
    .order('created_at', { ascending: false })

  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  return await query
}

export type PendingEmployees = QueryData<ReturnType<typeof getPendingEmployeesQuery>>

/**
 * 직원 승인
 * @param employeeId 직원 ID
 * @param approvedBy 승인한 사용자 ID
 * @returns 업데이트된 직원 정보
 */
export const approveEmployeeQuery = async (employeeId: string, approvedBy: string) => {
  return await supabase
    .from('employees')
    .update({
      status: 'approved',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', employeeId)
    .select()
    .single()
}

/**
 * 직원 거부
 * @param employeeId 직원 ID
 * @param approvedBy 처리한 사용자 ID
 * @returns 업데이트된 직원 정보
 */
export const rejectEmployeeQuery = async (employeeId: string, approvedBy: string) => {
  return await supabase
    .from('employees')
    .update({
      status: 'rejected',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', employeeId)
    .select()
    .single()
}

/**
 * 직원 삭제
 * @param employeeId 직원 ID
 * @returns 삭제 결과
 */
export const deleteEmployeeQuery = async (employeeId: string) => {
  return await supabase.from('employees').delete().eq('id', employeeId)
}

/**
 * 직원의 크레딧 업데이트
 * @param employeeId 직원 ID
 * @param credits 새로운 크레딧 수
 * @returns 업데이트된 직원 정보
 */
export const updateEmployeeCreditsQuery = async (employeeId: string, credits: number) => {
  return await supabase
    .from('employees')
    .update({ credits })
    .eq('id', employeeId)
    .select()
    .single()
}

/**
 * 특정 역할의 직원 수 조회
 * @param organizationId 조직 ID
 * @param role 역할
 * @returns 직원 수
 */
export const getEmployeeCountByRoleQuery = async (organizationId: string, role: 'manager' | 'employee') => {
  const { count, error } = await supabase
    .from('employees')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('role', role)
    .eq('status', 'approved')

  return { count, error }
}

/**
 * 직원의 스킬 업데이트
 * @param employeeId 직원 ID
 * @param skills 새로운 스킬 배열
 * @returns 업데이트된 직원 정보
 */
export const updateEmployeeSkillsQuery = async (employeeId: string, skills: string[]) => {
  return await supabase
    .from('employees')
    .update({ skills })
    .eq('id', employeeId)
    .select()
    .single()
}