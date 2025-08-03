<template>
  <!-- 
    `fixed` bring the `aside` on the side of nav and main elements 
    `h-screen` make the `aside` take the full height
    `flex` and the related bring the child div content within the viewport
   -->
  <aside
    class="border-r fixed h-screen flex flex-col gap-2"
    :class="{ 'w-52': menuOpen, 'w-16': !menuOpen }"
  >
    <div class="h-20 w-full flex justify-center items-center gap-1">
      <Button
        tabindex="0"
        variant="invisible"
        size="outline"
        class="m-2 flex justify-center items-center"
        @click="toggleMenu"
      >
        <div v-if="menuOpen" class="p-2 rounded-md flex items-center gap-4">
          <ChevonsLeft /><span>Collapse</span>
        </div>
        <div v-else class="p-2 rounded-md">
          <ChevronsRight />
        </div>
      </Button>

      <!-- <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            tabindex="0"
            class="w-8 h-8 hover:ring-offset-2 hover:ring-2 focus:ring-offset-2 focus:ring-2"
            variant="outline"
            size="icon"
          >
            <iconify-icon icon="lucide:plus"></iconify-icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Create</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer" @click="$emit('@createProject')">
            A Project
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" @click="$emit('@createTask')">
            A Task</DropdownMenuItem
          >
        </DropdownMenuContent>
      </DropdownMenu> -->
    </div>
    <!-- 
      `h-full` make the `nav` take the full height, thanks to h-screen above
      `flex` and related allow the child divs to be at each end of the nav
      -->
    <nav class="h-full flex flex-col justify-between">
      <div class="px-2">
        <SideBarLinks :links="topLinks" />
      </div>

      <div class="border-y px-2">
        <SideBarLinks :links="settingsLinks" @@action-clicked="executeAction" />
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { LinkProp } from '@/types/LinkProp'
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { SideBarActionsEnum } from '@/types/SideBarActionsEnum'
import type { SideBarLinkAction } from '@/types/SideBarLinkAction'
import router from '@/router'
import { useWindowSize } from '@vueuse/core'
import Home from '../ui/icon/Home.vue'
import Files from '../ui/icon/Files.vue'
import UserRoundCog from '../ui/icon/UserRoundCog.vue'
import LogOut from '../ui/icon/LogOut.vue'
import Settings2 from '../ui/icon/Settings2.vue'
import PaintBrush from '../ui/icon/PaintBrush.vue'

console.log('SideBar>script:setup...')

const executeAction = async (payload: SideBarLinkAction) => {
  console.log('Clicked a side bar link', payload)

  if (payload.action === SideBarActionsEnum.Logout) {
    const { isLoggedOut } = await useAuthStore().logout()
    if (isLoggedOut) {
      console.log('Logging out...')
      router.push('/login')
    }
  }
}

defineEmits<{ (event: '@createTask'): void; (event: '@createProject'): void }>()

const { useAuthStore } = await import('@/stores/auth')
const authStore = useAuthStore()
// TODO > enable this if querying supabase
await authStore.getSession()
// TODO > remove this if querying supabase
// await authStore.setAuth({
//   session: {
//     user: authStore.user!,
//     // all the following is required to avoid a typescript error
//     access_token: '',
//     expires_in: 0,
//     refresh_token: '',
//     token_type: '',
//   },
const { profile, employee } = storeToRefs(authStore)

// 사용자 이메일에 따른 username 매핑
const getUsernameByEmail = (email: string | undefined): string => {
  const emailToUsername: Record<string, string> = {
    'sindeaf@gmail.com': 'Superuser',
    'test.manager@example.com': 'TestManager',
    'test.employee@example.com': 'TestEmployee'
  }
  return emailToUsername[email || ''] || 'me'
}

const userRole = computed(() => employee.value?.role || 'guest')

// 역할별 메뉴 정의
const getTopLinksByRole = (role: string): LinkProp[] => {
  const baseLinks = [
    {
      to: RouterPathEnum.Home,
      icon: Home,
      label: 'Dashboard',
    }
  ]
  
  switch (role) {
    case 'superuser':
      return [
        ...baseLinks,
        { to: RouterPathEnum.Entities, icon: Files, label: 'Organizations' },
        { to: '/employees', icon: UserRoundCog, label: 'Employee Management' },
        { to: '/scheduling', icon: Files, label: 'Schedule Management' },
        { to: RouterPathEnum.StyleGuide, icon: PaintBrush, label: 'Style Guide' },
      ]
    
    case 'manager':
      return [
        ...baseLinks,
        { to: '/employees', icon: UserRoundCog, label: 'My Team' },
        { to: '/scheduling', icon: Files, label: 'Scheduling' },
        { to: '/reports', icon: Files, label: 'Reports' },
      ]
    
    case 'employee':
      return [
        ...baseLinks,
        { to: '/my-schedule', icon: Files, label: 'My Schedule' },
        { to: '/preferences', icon: Settings2, label: 'Preferences' },
      ]
    
    default:
      return baseLinks
  }
}

const topLinks = computed(() => getTopLinksByRole(userRole.value))

// 디버깅: 프로필 및 역할 데이터 확인
if (import.meta.env.DEV) {
  watchEffect(() => {
    console.log('SideBar - 상태 정보:', {
      userEmail: authStore.user?.email,
      profile: profile.value,
      employee: employee.value,
      userRole: userRole.value,
      topLinksCount: topLinks.value.length,
      username: profile.value?.username,
      fallbackUsername: getUsernameByEmail(authStore.user?.email),
      finalProfileLink: `${RouterPathEnum.Profile}s/${profile?.value?.username || getUsernameByEmail(authStore.user?.email)}`
    })
  })
}
const settingsLinks: LinkProp[] = [
  {
    // profile에서 username을 가져오거나, 이메일 기반 매핑 사용
    to: `${RouterPathEnum.Profile}s/${profile?.value?.username || getUsernameByEmail(authStore.user?.email)}`,
    icon: UserRoundCog,
    label: 'Profile',
  },
  {
    to: RouterPathEnum.Settings,
    icon: Settings2,
    label: 'Settings',
  },
  {
    to: '#logout',
    icon: LogOut,
    action: SideBarActionsEnum.Logout,
    label: 'Sign out',
  },
]

const { menuOpen, toggleMenu } = useMenu()

const { width: windowWidth } = useWindowSize()
watchEffect(() => {
  if (windowWidth.value > 1024) {
    menuOpen.value = true
  } else {
    menuOpen.value = false
  }
})
</script>
<style scoped></style>
