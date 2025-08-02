-- ============================================================================
-- EveryShift Domain Tables Migration
-- 교대 근무 스케줄링 시스템을 위한 새 테이블들을 생성합니다.
-- 기존 profiles 테이블과 연결하되 절대 수정하지 않습니다.
-- ============================================================================

-- 1. ORGANIZATIONS 테이블
-- 병원, 공장, 경찰서 등 24시간 운영 조직 정보
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                    -- 서울삼성병원, 서울경찰서 등
  workplace_type text NOT NULL           -- 'hospital', 'factory', 'police_fire'
    CHECK (workplace_type IN ('hospital', 'factory', 'police_fire')),
  shift_pattern jsonb NOT NULL,          -- 교대 근무 패턴 (3교대 또는 커스텀)
  credit_settings jsonb,                 -- 직급별 크레딧 설정
  skill_categories text[] DEFAULT '{}',  -- 조직별 기술/전문분야 목록
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- 2. EMPLOYEES 테이블
-- 직원 정보 (기존 profiles 테이블과 연결)
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL               -- 기존 profiles 테이블과 연결
    REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL          -- 소속 조직
    REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL                     -- 'superuser', 'manager', 'employee'
    CHECK (role IN ('superuser', 'manager', 'employee')),
  position text,                         -- 직급 (의사, 간호사, 경위 등)
  skills text[] DEFAULT '{}',            -- 보유 기술/전문분야 배열
  credits integer DEFAULT 0,             -- 현재 보유 크레딧
  status text DEFAULT 'pending_approval' -- 'pending_approval', 'approved', 'rejected'
    CHECK (status IN ('pending_approval', 'approved', 'rejected')),
  approved_by uuid                       -- 승인한 사용자 ID
    REFERENCES employees(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- 3. SITES 테이블
-- 근무 사이트 (병동, 부서 등)
CREATE TABLE sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL          -- 소속 조직
    REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,                    -- 암병동, 응급병동, 외과병동 등
  description text,                      -- 사이트 설명
  default_staffing jsonb,                -- 기본 필요 인력 설정
  -- 예: {"doctor": {"count": 2, "skills": ["정형외과", "일반"]}, "nurse": {"count": 3}}
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- 4. SHIFTS 테이블
-- 교대 근무 정보
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL          -- 소속 조직
    REFERENCES organizations(id) ON DELETE CASCADE,
  site_id uuid NOT NULL                  -- 근무 사이트
    REFERENCES sites(id) ON DELETE CASCADE,
  date date NOT NULL,                    -- 근무 날짜
  shift_type text NOT NULL,              -- 'day', 'evening', 'night' 등
  start_time time NOT NULL,              -- 시작 시간
  end_time time NOT NULL,                -- 종료 시간
  required_staffing jsonb NOT NULL,      -- 필요 인력 (사이트 기본값 오버라이드 가능)
  assigned_employees uuid[],             -- 배정된 직원 ID 배열
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz,
  
  UNIQUE(site_id, date, shift_type)      -- 같은 사이트, 날짜, 교대에 중복 방지
);

-- 5. PREFERENCES 테이블
-- 직원 선호도 (휴가, 희망/비희망 근무)
CREATE TABLE preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL              -- 직원 ID
    REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,                    -- 선호도 날짜
  preference_type text NOT NULL          -- 'unavailable', 'preferred', 'avoid'
    CHECK (preference_type IN ('unavailable', 'preferred', 'avoid')),
  shift_type text,                       -- 특정 교대에만 적용 (NULL이면 전체)
  is_vacation boolean DEFAULT false,     -- 연차 여부 (크레딧 차감 안함)
  credit_used integer DEFAULT 0,        -- 사용된 크레딧 수
  reason text,                           -- 선호도 이유
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz,
  
  UNIQUE(employee_id, date, shift_type)  -- 같은 직원, 날짜, 교대에 중복 방지
);

-- 6. SCHEDULES 테이블
-- 생성된 스케줄 정보
CREATE TABLE schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL          -- 소속 조직
    REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,                   -- 스케줄 제목 (예: "2025년 2월 스케줄")
  start_date date NOT NULL,              -- 스케줄 시작일
  end_date date NOT NULL,                -- 스케줄 종료일
  status text DEFAULT 'draft'            -- 'draft', 'published', 'archived'
    CHECK (status IN ('draft', 'published', 'archived')),
  ai_solver_result jsonb,                -- AI 솔버 결과 저장
  manual_adjustments jsonb,              -- 수동 조정 기록
  statistics jsonb,                      -- 스케줄 통계 (공정성, 만족도 등)
  created_by uuid NOT NULL               -- 생성자
    REFERENCES employees(id),
  published_by uuid                      -- 발행자
    REFERENCES employees(id),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

-- 7. CREDIT_TRANSACTIONS 테이블
-- 크레딧 사용 내역 추적
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL              -- 직원 ID
    REFERENCES employees(id) ON DELETE CASCADE,
  amount integer NOT NULL,               -- 크레딧 변화량 (+/-)
  transaction_type text NOT NULL         -- 'used', 'refunded', 'granted'
    CHECK (transaction_type IN ('used', 'refunded', 'granted')),
  reference_id uuid,                     -- 참조 ID (preference_id, schedule_id 등)
  reference_type text,                   -- 'preference', 'schedule', 'manual'
  description text,                      -- 거래 설명
  created_by uuid                        -- 거래 생성자
    REFERENCES employees(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) 정책 설정
-- 역할별 데이터 접근 제어
-- ============================================================================

-- 1. ORGANIZATIONS 테이블 RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Superuser: 모든 조직 접근
CREATE POLICY "superuser_full_access_organizations" ON organizations
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees 
    WHERE profile_id = auth.uid() 
    AND role = 'superuser' 
    AND status = 'approved'
  )
);

-- Manager/Employee: 본인 조직만 접근
CREATE POLICY "org_members_access_organizations" ON organizations
FOR SELECT TO authenticated
USING (
  id IN (
    SELECT organization_id FROM employees 
    WHERE profile_id = auth.uid() 
    AND status = 'approved'
  )
);

-- 2. EMPLOYEES 테이블 RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Superuser: 모든 직원 접근
CREATE POLICY "superuser_full_access_employees" ON employees
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees e2
    WHERE e2.profile_id = auth.uid() 
    AND e2.role = 'superuser' 
    AND e2.status = 'approved'
  )
);

-- Manager: 본인 조직 직원만 접근
CREATE POLICY "manager_org_employees" ON employees
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM employees 
    WHERE profile_id = auth.uid() 
    AND role IN ('manager', 'superuser')
    AND status = 'approved'
  )
);

-- Employee: 본인 정보만 접근
CREATE POLICY "employee_own_record" ON employees
FOR SELECT TO authenticated
USING (profile_id = auth.uid());

-- 3. SITES 테이블 RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 조직 멤버만 접근
CREATE POLICY "org_members_sites" ON sites
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM employees 
    WHERE profile_id = auth.uid() 
    AND status = 'approved'
  )
);

-- 4. SHIFTS 테이블 RLS
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- 조직 멤버만 접근
CREATE POLICY "org_members_shifts" ON shifts
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM employees 
    WHERE profile_id = auth.uid() 
    AND status = 'approved'
  )
);

-- 5. PREFERENCES 테이블 RLS
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- 본인 선호도만 수정, 조직내 모든 선호도 조회 (매니저용)
CREATE POLICY "own_preferences_crud" ON preferences
FOR ALL TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "manager_view_preferences" ON preferences
FOR SELECT TO authenticated
USING (
  employee_id IN (
    SELECT e1.id FROM employees e1
    WHERE e1.organization_id IN (
      SELECT e2.organization_id FROM employees e2
      WHERE e2.profile_id = auth.uid() 
      AND e2.role IN ('manager', 'superuser')
      AND e2.status = 'approved'
    )
  )
);

-- 6. SCHEDULES 테이블 RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 조직 멤버만 접근
CREATE POLICY "org_members_schedules" ON schedules
FOR ALL TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM employees 
    WHERE profile_id = auth.uid() 
    AND status = 'approved'
  )
);

-- 7. CREDIT_TRANSACTIONS 테이블 RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 본인 크레딧 내역 조회, 매니저는 조직내 모든 내역 조회
CREATE POLICY "own_credit_transactions" ON credit_transactions
FOR SELECT TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "manager_view_credit_transactions" ON credit_transactions
FOR SELECT TO authenticated
USING (
  employee_id IN (
    SELECT e1.id FROM employees e1
    WHERE e1.organization_id IN (
      SELECT e2.organization_id FROM employees e2
      WHERE e2.profile_id = auth.uid() 
      AND e2.role IN ('manager', 'superuser')
      AND e2.status = 'approved'
    )
  )
);

-- ============================================================================
-- 인덱스 생성 (성능 최적화)
-- ============================================================================

-- 자주 조회되는 컬럼들에 인덱스 생성
CREATE INDEX idx_employees_profile_id ON employees(profile_id);
CREATE INDEX idx_employees_organization_id ON employees(organization_id);
CREATE INDEX idx_employees_role_status ON employees(role, status);
CREATE INDEX idx_sites_organization_id ON sites(organization_id);
CREATE INDEX idx_shifts_organization_site_date ON shifts(organization_id, site_id, date);
CREATE INDEX idx_preferences_employee_date ON preferences(employee_id, date);
CREATE INDEX idx_schedules_organization_status ON schedules(organization_id, status);
CREATE INDEX idx_credit_transactions_employee_id ON credit_transactions(employee_id);

-- ============================================================================
-- 완료 메시지
-- ============================================================================
-- EveryShift 도메인 테이블 생성 완료
-- 총 7개 테이블: organizations, employees, sites, shifts, preferences, schedules, credit_transactions
-- 모든 테이블에 RLS 정책 적용 완료
-- 성능 최적화를 위한 인덱스 생성 완료