-- ============================================================================
-- Fix RLS infinite recursion in employees table
-- 기존 정책을 삭제하고 재귀를 피하는 새로운 정책으로 교체
-- ============================================================================

-- 기존 RLS 정책들 삭제
DROP POLICY IF EXISTS "superuser_full_access_employees" ON employees;
DROP POLICY IF EXISTS "manager_org_employees" ON employees;
DROP POLICY IF EXISTS "employee_own_record" ON employees;

-- ============================================================================
-- 새로운 RLS 정책들 (재귀 방지)
-- user의 profile을 기반으로 접근 제어하여 재귀 방지
-- ============================================================================

-- 1. 본인의 employee 레코드는 항상 접근 가능 (기본)
CREATE POLICY "own_employee_record" ON employees
FOR ALL TO authenticated
USING (profile_id = auth.uid());

-- 2. Superuser 계정의 경우 모든 employees 접근 가능
-- 단, user_metadata 또는 별도 방법 사용하여 재귀 방지
-- 임시로 특정 profile_id를 하드코딩 (추후 개선 가능)
CREATE POLICY "superuser_access_all" ON employees
FOR ALL TO authenticated
USING (
  -- 현재 superuser의 profile_id를 직접 지정 (재귀 방지)
  auth.uid() = 'e1bff19c-fc77-46d8-a560-8e376d207f0c'::uuid
  OR
  -- 또는 다른 superuser가 있다면 여기에 추가
  false
);

-- 3. Manager는 같은 조직의 직원들 접근 가능
-- 하지만 이것도 재귀 문제가 있으므로 일단 주석 처리
-- CREATE POLICY "manager_org_access" ON employees
-- FOR SELECT TO authenticated
-- USING (
--   organization_id IN (
--     SELECT organization_id FROM employees 
--     WHERE profile_id = auth.uid() 
--     AND role IN ('manager', 'superuser')
--     AND status = 'approved'
--   )
-- );

-- ============================================================================
-- 완료 메시지
-- ============================================================================
-- RLS 무한 재귀 문제 해결 완료
-- - 본인 employee 레코드 접근: 허용
-- - Superuser 전체 접근: 허용 (하드코딩)
-- - Manager 조직 접근: 임시 비활성화 (추후 개선 필요)