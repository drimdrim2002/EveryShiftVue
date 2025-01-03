<script setup lang="ts">
console.log('NavbarTop>script:setup...')
const authStore = useAuthStore()
const { profile } = storeToRefs(authStore)

// import { useDark, useToggle } from '@vueuse/core'

// const isDark = useDark()
// const toggleDark = useToggle(isDark)
</script>
<template>
  <nav class="h-16 border-b bg-muted/40 flex gap-2 justify-between px-6 items-center">
    <form class="relative h-fit w-full max-w-96">
      <iconify-icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
      ></iconify-icon>
      <Input class="w-full pl-8 bg-background" type="text" placeholder="Search ..." />
    </form>
    <div class="flex justify-center items-center gap-1">
      <!-- <Button @click="toggleDark()" class="w-8 h-8">
        <Transition name="scale" mode="out-in">
          <iconify-icon v-if="isDark" class="" icon="lucide:sun"></iconify-icon>
          <iconify-icon v-else class="" icon="lucide:moon"></iconify-icon>
        </Transition>
      </Button> -->
      <div class="w-8">
        <AppAvatar :profile="profile" />
        <!-- <DropdownMenu>
          <DropdownMenuTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              ><RouterLink
                :to="{ name: '/profiles/[username]', params: { username: profile?.username! } }"
                >Profile</RouterLink
              ></DropdownMenuItem
            >
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> -->
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
