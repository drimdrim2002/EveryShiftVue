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
  <div class="page-login m-4">
    <Card class="p-6 border rounded-md">
      <CardHeader>
        <CardTitle class="mb-4" :is-page-title="true"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <AppLoginForm @@login="sigin" />
      </CardContent>
    </Card>
  </div>
</template>
