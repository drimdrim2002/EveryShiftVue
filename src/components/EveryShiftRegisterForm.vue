<script setup lang="ts">
import type { 
  EveryShiftRegistrationData, 
  SkillOption 
} from '@/types/EveryShiftRegistration'
import { DEFAULT_SKILLS, SHIFT_PATTERNS } from '@/types/EveryShiftRegistration'
import { getAllOrganizationsQuery } from '@/services/organization-queries'

const formData = reactive<EveryShiftRegistrationData>({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'employee',
  organizationName: '',
  workplaceType: 'hospital',
  shiftPattern: '3shifts',
  sites: [],
  skillCategories: [],
  creditSettings: {},
  organizationId: '',
  position: '',
  skills: []
})

const currentStep = ref(1)
const totalSteps = computed(() => formData.role === 'manager' ? 3 : 2)


const availableOrganizations = ref<Array<{id: string, name: string, workplace_type: string}>>([])
const availableSkills = ref<SkillOption[]>([])
const customSkillInput = ref('')
const newSiteInput = ref('')

const emits = defineEmits<{
  (event: 'register', request: EveryShiftRegistrationData): void
}>()

// 조직 목록 로드 (Employee 역할 선택 시)
const loadOrganizations = async () => {
  try {
    const { data, error } = await getAllOrganizationsQuery()
    if (error) {
      console.error('조직 목록 로드 실패:', error)
      return
    }
    availableOrganizations.value = data || []
  } catch (error) {
    console.error('조직 목록 로드 중 오류:', error)
  }
}

// 역할 변경 시 처리 - watch로 변경
watch(() => formData.role, (newRole) => {
  if (newRole === 'employee') {
    loadOrganizations()
  }
  currentStep.value = 1
})

// 근무 유형 변경 시 기본 스킬 로드 - watch로 변경
watch(() => formData.workplaceType, (newWorkplaceType) => {
  if (newWorkplaceType) {
    availableSkills.value = DEFAULT_SKILLS[newWorkplaceType] || []
    formData.skillCategories = []
  }
})

// 스킬 추가/제거
const toggleSkill = (skill: string) => {
  const skills = formData.role === 'manager' 
    ? formData.skillCategories || []
    : formData.skills || []
  
  const index = skills.indexOf(skill)
  if (index > -1) {
    skills.splice(index, 1)
  } else {
    skills.push(skill)
  }
  
  if (formData.role === 'manager') {
    formData.skillCategories = skills
  } else {
    formData.skills = skills
  }
}

// 커스텀 스킬 추가
const addCustomSkill = () => {
  if (!customSkillInput.value.trim()) return
  
  const newSkill = customSkillInput.value.trim()
  availableSkills.value.push({ value: newSkill, label: newSkill, category: '사용자 정의' })
  toggleSkill(newSkill)
  customSkillInput.value = ''
}

// 사이트 추가
const addSite = () => {
  if (!newSiteInput.value.trim()) return
  
  if (!formData.sites) formData.sites = []
  formData.sites.push(newSiteInput.value.trim())
  newSiteInput.value = ''
}

// 사이트 제거
const removeSite = (index: number) => {
  if (formData.sites) {
    formData.sites.splice(index, 1)
  }
}

// 다음 단계
const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
  }
}

// 이전 단계
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 현재 단계 유효성 검사
const validateCurrentStep = (): boolean => {
  if (currentStep.value === 1) {
    return !!(formData.username && 
              formData.firstName && 
              formData.lastName && 
              formData.email && 
              formData.password && 
              formData.confirmPassword &&
              formData.password === formData.confirmPassword)
  }
  
  if (currentStep.value === 2) {
    if (formData.role === 'manager') {
      return !!(formData.organizationName && 
                formData.workplaceType && 
                formData.shiftPattern)
    } else {
      return !!(formData.organizationId && formData.position)
    }
  }
  
  return true
}

const submitRegistration = () => {
  if (validateCurrentStep()) {
    register()
  }
}

const register = () => {
  emits('register', formData)
}

// 초기화 - watch가 자동으로 처리하므로 제거
onMounted(() => {
  // 초기 로드 시 Employee 역할이면 조직 목록 로드
  if (formData.role === 'employee') {
    loadOrganizations()
  }
  // 초기 스킬 로드
  if (formData.workplaceType) {
    availableSkills.value = DEFAULT_SKILLS[formData.workplaceType] || []
  }
})
</script>

<template>
  <div class="everyshift-register-form">
    <!-- 진행 단계 표시 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-foreground">단계 {{ currentStep }} / {{ totalSteps }}</span>
      </div>
      <div class="w-full bg-background rounded-full h-2">
        <div 
          class="bg-brand h-2 rounded-full transition-all duration-300" 
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>
    </div>

    <vee-form @submit="nextStep">
      <!-- 단계 1: 기본 정보 -->
      <div v-if="currentStep === 1" class="space-y-4">
        <h3 class="text-lg font-semibold mb-4">기본 정보</h3>
        
        <!-- 역할 선택 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">역할 선택</label>
          <div class="flex gap-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                value="manager" 
                v-model="formData.role" 
                class="text-brand focus:ring-brand"
              />
              <span>조직 관리자 (Manager)</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                value="employee" 
                v-model="formData.role" 
                class="text-brand focus:ring-brand"
              />
              <span>직원 (Employee)</span>
            </label>
          </div>
          <p class="text-xs text-muted-foreground">
            <span v-if="formData.role === 'manager'">새로운 조직을 등록하고 관리합니다.</span>
            <span v-else>기존 조직에 소속된 직원으로 등록합니다.</span>
          </p>
        </div>

        <app-form-field
          name="username"
          label="사용자명"
          v-model="formData.username"
          rules="required"
          type="text"
          placeholder="johndoe19"
        />
        
        <div class="grid grid-cols-2 gap-4">
          <app-form-field
            name="firstName"
            label="이름"
            v-model="formData.firstName"
            rules="required"
            type="text"
            placeholder="홍"
          />
          <app-form-field
            name="lastName"
            label="성"
            v-model="formData.lastName"
            rules="required"
            type="text"
            placeholder="길동"
          />
        </div>
        
        <app-form-field
          name="email"
          label="이메일"
          v-model="formData.email"
          rules="required|email"
          type="email"
          placeholder="email@example.com"
        />
        
        <app-form-field
          name="password"
          label="비밀번호"
          v-model="formData.password"
          rules="required|min:6"
          type="password"
          placeholder="••••••••"
        />
        
        <app-form-field
          name="confirmPassword"
          label="비밀번호 확인"
          v-model="formData.confirmPassword"
          rules="required|confirmed:@password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <!-- 단계 2: 역할별 상세 정보 -->
      <div v-if="currentStep === 2" class="space-y-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ formData.role === 'manager' ? '조직 정보' : '직원 정보' }}
        </h3>

        <!-- Manager 전용 필드 -->
        <template v-if="formData.role === 'manager'">
          <app-form-field
            name="organizationName"
            label="조직명"
            v-model="formData.organizationName"
            rules="required"
            type="text"
            placeholder="서울삼성병원, 서울경찰서 등"
          />
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">근무 유형</label>
            <select 
              v-model="formData.workplaceType" 
              class="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="hospital">병원 근무</option>
              <option value="factory">공장 근무</option>
              <option value="police_fire">경찰/소방 근무</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">교대 근무 패턴</label>
            <select 
              v-model="formData.shiftPattern"
              class="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option v-for="pattern in SHIFT_PATTERNS" :key="pattern.value" :value="pattern.value">
                {{ pattern.label }}
              </option>
            </select>
          </div>
        </template>

        <!-- Employee 전용 필드 -->
        <template v-else>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">소속 조직</label>
            <select 
              v-model="formData.organizationId"
              class="w-full p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">조직을 선택하세요</option>
              <option 
                v-for="org in availableOrganizations" 
                :key="org.id" 
                :value="org.id"
              >
                {{ org.name }} ({{ org.workplace_type }})
              </option>
            </select>
          </div>
          
          <app-form-field
            name="position"
            label="직급/직책"
            v-model="formData.position"
            rules="required"
            type="text"
            placeholder="의사, 간호사, 경위 등"
          />
        </template>
      </div>

      <!-- 단계 3: 스킬 및 사이트 설정 (Manager만) -->
      <div v-if="currentStep === 3 && formData.role === 'manager'" class="space-y-6">
        <h3 class="text-lg font-semibold mb-4">추가 설정</h3>
        
        <!-- 근무 사이트 -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-foreground">근무 사이트</label>
          <div class="flex gap-2">
            <input
              v-model="newSiteInput"
              type="text"
              placeholder="예: 암병동, 응급병동"
              class="flex-1 p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              @keyup.enter="addSite"
            />
            <Button type="button" @click="addSite" variant="outline">추가</Button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(site, index) in formData.sites" 
              :key="index"
              class="inline-flex items-center gap-1 px-2 py-1 bg-brand/10 text-brand rounded-md text-sm"
            >
              {{ site }}
              <button @click="removeSite(index)" class="text-brand hover:text-brand/80">×</button>
            </span>
          </div>
        </div>

        <!-- 기술/전문분야 -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-foreground">조직 기술/전문분야</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label 
              v-for="skill in availableSkills" 
              :key="skill.value"
              class="flex items-center space-x-2 cursor-pointer p-2 border border-input rounded-md hover:bg-accent"
            >
              <input 
                type="checkbox" 
                :value="skill.value"
                :checked="formData.skillCategories?.includes(skill.value)"
                @change="toggleSkill(skill.value)"
                class="text-brand focus:ring-brand"
              />
              <span class="text-sm">{{ skill.label }}</span>
            </label>
          </div>
          
          <!-- 커스텀 스킬 추가 -->
          <div class="flex gap-2">
            <input
              v-model="customSkillInput"
              type="text"
              placeholder="사용자 정의 기술/전문분야"
              class="flex-1 p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              @keyup.enter="addCustomSkill"
            />
            <Button type="button" @click="addCustomSkill" variant="outline">추가</Button>
          </div>
        </div>
      </div>

      <!-- 스킬 선택 (Employee, 2단계에서) -->
      <div v-if="currentStep === 2 && formData.role === 'employee'" class="space-y-4 mt-6">
        <div class="space-y-3">
          <label class="text-sm font-medium text-foreground">보유 기술/전문분야</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <label 
              v-for="skill in availableSkills" 
              :key="skill.value"
              class="flex items-center space-x-2 cursor-pointer p-2 border border-input rounded-md hover:bg-accent"
            >
              <input 
                type="checkbox" 
                :value="skill.value"
                :checked="!!(formData.skills?.includes(skill.value))"
                @change="toggleSkill(skill.value)"
                class="text-brand focus:ring-brand"
              />
              <span class="text-sm">{{ skill.label }}</span>
            </label>
          </div>
          
          <!-- 커스텀 스킬 추가 -->
          <div class="flex gap-2">
            <input
              v-model="customSkillInput"
              type="text"
              placeholder="추가 기술/전문분야"
              class="flex-1 p-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
              @keyup.enter="addCustomSkill"
            />
            <Button type="button" @click="addCustomSkill" variant="outline">추가</Button>
          </div>
        </div>
      </div>


      <!-- 버튼 영역 -->
      <div class="flex justify-between mt-8">
        <Button 
          v-if="currentStep > 1"
          type="button" 
          @click="prevStep"
          variant="outline"
        >
          이전
        </Button>
        <div v-else></div>
        
        <Button 
          v-if="currentStep < totalSteps"
          type="submit"
          :disabled="!validateCurrentStep()"
        >
          다음
        </Button>
        <Button 
          v-else
          type="button"
          @click="submitRegistration"
          :disabled="!validateCurrentStep()"
        >
          가입 신청
        </Button>
      </div>
    </vee-form>
  </div>
</template>

<style scoped>
.everyshift-register-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>