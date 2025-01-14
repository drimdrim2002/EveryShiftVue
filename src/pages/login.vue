<script setup lang="ts">
import { loginWithSupabase } from '@/services/supabase-auth'
import AppLoginForm from '@/components/AppLoginForm.vue'
import type UserLoginRequest from '@/types/UserLoginRequest'

const router = useRouter()

const sigin = async (request: UserLoginRequest) => {
  const { error } = await loginWithSupabase({ formData: request })
  if (!error) return router.push('/')
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <AppLoginForm @@login="sigin" />
      </CardContent>
    </Card>
  </div>
</template>
