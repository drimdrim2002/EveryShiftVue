import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atuqzcyzuecixshusbib.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dXF6Y3l6dWVjaXhzaHVzYmliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA1MTAxNywiZXhwIjoyMDY5NjI3MDE3fQ.OUCOM4R-xdwtAtW79QP5NM5ihFVqenu13jkJjq9FFH0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCurrentData() {
  try {
    console.log('현재 데이터 상태 확인 중...')
    
    // auth.users 확인 (service role로 접근)
    console.log('\n=== Auth Users (최근 5명) ===')
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Auth users 조회 에러:', authError)
      } else if (authUsers && authUsers.users.length > 0) {
        authUsers.users.slice(0, 5).forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}`)
          console.log(`   Email: ${user.email}`)
          console.log(`   Email Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
          console.log(`   Last Sign In: ${user.last_sign_in_at || 'Never'}`)
          console.log(`   Account Banned: ${user.banned_until ? 'Yes' : 'No'}`)
          console.log(`   Created: ${user.created_at}`)
          console.log('---')
        })
      } else {
        console.log('Auth users가 없습니다.')
      }
    } catch (error) {
      console.error('Auth users 조회 중 오류:', error)
    }
    
    // profiles 테이블에서 최근 사용자 확인
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (profileError) {
      console.error('프로필 조회 에러:', profileError)
      return
    }
    
    console.log('\n=== 최근 프로필 ===')
    if (profiles && profiles.length > 0) {
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ID: ${profile.id}`)
        console.log(`   Username: ${profile.username}`)
        console.log(`   Full Name: ${profile.full_name}`)
        console.log(`   Created: ${profile.created_at}`)
        console.log('---')
      })
    } else {
      console.log('프로필이 없습니다.')
    }
    
    // organizations 테이블 확인
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('\n=== 조직 목록 ===')
    if (orgError) {
      console.error('조직 조회 에러:', orgError)
    } else if (organizations && organizations.length > 0) {
      organizations.forEach((org, index) => {
        console.log(`${index + 1}. ID: ${org.id}`)
        console.log(`   Name: ${org.name}`)
        console.log(`   Type: ${org.workplace_type}`)
        console.log(`   Created: ${org.created_at}`)
        console.log('---')
      })
    } else {
      console.log('조직이 없습니다.')
    }
    
    // employees 테이블 확인
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('\n=== 직원 목록 ===')
    if (empError) {
      console.error('직원 조회 에러:', empError)
    } else if (employees && employees.length > 0) {
      employees.forEach((emp, index) => {
        console.log(`${index + 1}. ID: ${emp.id}`)
        console.log(`   Profile ID: ${emp.profile_id}`)
        console.log(`   Organization ID: ${emp.organization_id}`)
        console.log(`   Role: ${emp.role}`)
        console.log(`   Status: ${emp.status}`)
        console.log(`   Position: ${emp.position}`)
        console.log(`   Created: ${emp.created_at}`)
        console.log('---')
      })
    } else {
      console.log('직원이 없습니다.')
    }
    
    // 현재 Manager 계정으로 가입한 사용자를 찾아서 employee 데이터 생성
    if (profiles && profiles.length > 1) {
      const managerProfile = profiles.find(p => p.username !== 'Superuser')
      if (managerProfile) {
        console.log(`\n=== Manager 계정 발견: ${managerProfile.username} ===`)
        
        // 이 사용자의 employee 데이터가 있는지 확인
        const existingEmployee = employees?.find(emp => emp.profile_id === managerProfile.id)
        
        if (!existingEmployee) {
          console.log('Manager의 employee 데이터가 없습니다. 생성합니다...')
          
          // Manager의 조직을 찾거나 생성
          const managerOrg = organizations?.find(org => org.name !== 'EveryShift 테스트 병원')
          
          if (managerOrg) {
            const { data: newEmployee, error: newEmpError } = await supabase
              .from('employees')
              .insert({
                profile_id: managerProfile.id,
                organization_id: managerOrg.id,
                role: 'manager',
                position: 'Manager',
                skills: [],
                status: 'pending_approval'
              })
              .select()
              .single()
            
            if (newEmpError) {
              console.error('Manager employee 생성 실패:', newEmpError)
            } else {
              console.log('✅ Manager employee 생성 완료!')
              console.log(`   Username: ${managerProfile.username}`)
              console.log(`   Role: ${newEmployee.role}`)
              console.log(`   Status: ${newEmployee.status}`)
            }
          }
        } else {
          console.log('Manager의 employee 데이터가 이미 존재합니다.')
        }
      }
    }
    
  } catch (error) {
    console.error('전체 에러:', error)
  }
}

checkCurrentData()