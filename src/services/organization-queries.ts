import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/DatabaseTypes'
import type { QueryData } from '@supabase/supabase-js'

export type Organization = Tables<'organizations'>
export type OrganizationInsert = TablesInsert<'organizations'>
export type OrganizationUpdate = TablesUpdate<'organizations'>

/**
 * 조직 생성
 * @param organizationData 조직 정보
 * @returns 생성된 조직 정보
 */
export const createOrganizationQuery = async (organizationData: OrganizationInsert) => {
  return await supabase.from('organizations').insert(organizationData).select().single()
}

/**
 * 조직 정보 조회 (ID로)
 * @param id 조직 ID
 * @returns 조직 정보
 */
export const getOrganizationByIdQuery = async (id: string) => {
  return await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()
}

/**
 * 모든 조직 조회 (Superuser용)
 * @returns 조직 목록
 */
export const getAllOrganizationsQuery = async () => {
  return await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false })
}

export type Organizations = QueryData<ReturnType<typeof getAllOrganizationsQuery>>

/**
 * 조직 정보 업데이트
 * @param id 조직 ID
 * @param updateData 업데이트할 데이터
 * @returns 업데이트된 조직 정보
 */
export const updateOrganizationQuery = async (id: string, updateData: OrganizationUpdate) => {
  return await supabase
    .from('organizations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
}

/**
 * 조직 삭제
 * @param id 조직 ID
 * @returns 삭제 결과
 */
export const deleteOrganizationQuery = async (id: string) => {
  return await supabase.from('organizations').delete().eq('id', id)
}

/**
 * 조직명으로 조직 검색
 * @param name 조직명
 * @returns 조직 정보
 */
export const getOrganizationByNameQuery = async (name: string) => {
  return await supabase
    .from('organizations')
    .select('*')
    .eq('name', name)
    .single()
}

/**
 * 근무 유형별 조직 조회
 * @param workplaceType 근무 유형
 * @returns 조직 목록
 */
export const getOrganizationsByTypeQuery = async (workplaceType: 'hospital' | 'factory' | 'police_fire') => {
  return await supabase
    .from('organizations')
    .select('*')
    .eq('workplace_type', workplaceType)
    .order('name', { ascending: true })
}

/**
 * 조직의 기술 카테고리 업데이트
 * @param id 조직 ID
 * @param skillCategories 새로운 기술 카테고리 배열
 * @returns 업데이트된 조직 정보
 */
export const updateOrganizationSkillsQuery = async (id: string, skillCategories: string[]) => {
  return await supabase
    .from('organizations')
    .update({ skill_categories: skillCategories })
    .eq('id', id)
    .select()
    .single()
}

/**
 * 조직의 크레딧 설정 업데이트
 * @param id 조직 ID
 * @param creditSettings 새로운 크레딧 설정
 * @returns 업데이트된 조직 정보
 */
export const updateOrganizationCreditsQuery = async (id: string, creditSettings: any) => {
  return await supabase
    .from('organizations')
    .update({ credit_settings: creditSettings })
    .eq('id', id)
    .select()
    .single()
}