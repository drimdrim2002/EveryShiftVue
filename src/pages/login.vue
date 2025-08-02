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
  <div class="page-login min-h-screen flex items-center justify-center p-4">
    <Card class="w-full max-w-sm p-6 border rounded-lg shadow-sm">
      <CardHeader class="text-center">
        <CardTitle class="my-0" :is-page-title="true">Login</CardTitle>
        <CardDescription>Use your credentials to login to your account</CardDescription>
      </CardHeader>
      <hr class="my-6 w-full border-border" />
      <CardContent>
        <AppLoginForm @@login="sigin" />
      </CardContent>
    </Card>
  </div>
</template>
