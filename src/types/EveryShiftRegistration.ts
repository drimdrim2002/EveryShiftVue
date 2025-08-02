import type { RegistrationData } from './RegistrationData'

// Registration-specific role type (excludes 'superuser' since they can't register through form)
export type RegistrationUserRole = 'manager' | 'employee'

export interface EveryShiftRegistrationData extends RegistrationData {
  role: RegistrationUserRole
  // Manager 전용 필드
  organizationName?: string
  workplaceType?: 'hospital' | 'factory' | 'police_fire'
  shiftPattern?: string
  sites?: string[]
  skillCategories?: string[]
  creditSettings?: Record<string, number>
  
  // Employee 전용 필드
  organizationId?: string
  position?: string
  skills?: string[]
}

export interface OrganizationSetup {
  name: string
  workplaceType: 'hospital' | 'factory' | 'police_fire'
  shiftPattern: string
  sites: string[]
  skillCategories: string[]
  creditSettings: Record<string, number>
}

export interface SkillOption {
  value: string
  label: string
  category?: string
}

// 업종별 기본 스킬 카테고리
export const DEFAULT_SKILLS: Record<string, SkillOption[]> = {
  hospital: [
    { value: 'general', label: '일반의', category: '의사' },
    { value: 'internal_medicine', label: '내과', category: '의사' },
    { value: 'surgery', label: '외과', category: '의사' },
    { value: 'orthopedics', label: '정형외과', category: '의사' },
    { value: 'emergency', label: '응급의학과', category: '의사' },
    { value: 'oncology', label: '종양학과', category: '의사' },
    { value: 'general_nurse', label: '일반간호사', category: '간호사' },
    { value: 'icu_nurse', label: 'ICU 간호사', category: '간호사' },
    { value: 'er_nurse', label: '응급실 간호사', category: '간호사' },
    { value: 'or_nurse', label: '수술실 간호사', category: '간호사' }
  ],
  factory: [
    { value: 'production', label: '생산', category: '운영' },
    { value: 'quality_control', label: '품질관리', category: '운영' },
    { value: 'maintenance', label: '설비보전', category: '기술' },
    { value: 'safety', label: '안전관리', category: '관리' },
    { value: 'logistics', label: '물류', category: '운영' },
    { value: 'machine_operator', label: '기계조작', category: '기술' },
    { value: 'supervisor', label: '현장관리', category: '관리' }
  ],
  police_fire: [
    { value: 'patrol', label: '순찰', category: '경찰' },
    { value: 'investigation', label: '수사', category: '경찰' },
    { value: 'traffic', label: '교통', category: '경찰' },
    { value: 'emergency_response', label: '응급대응', category: '소방' },
    { value: 'rescue', label: '구조', category: '소방' },
    { value: 'ems', label: '구급', category: '소방' },
    { value: 'fire_suppression', label: '화재진압', category: '소방' }
  ]
}

// 교대 근무 패턴 옵션
export const SHIFT_PATTERNS = [
  { value: '3shifts', label: '3교대 (08:00-16:00, 16:00-24:00, 24:00-08:00)' },
  { value: '2shifts', label: '2교대 (08:00-20:00, 20:00-08:00)' },
  { value: 'custom', label: '사용자 정의' }
]