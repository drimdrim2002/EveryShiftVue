<script setup lang="ts">
import type { LoginData } from '@/types/LoginData'
import { loginWithSupabase } from '@/services/supabase-auth'
import { watchDebounced } from '@vueuse/core'

const formData = ref<LoginData>({
  email: import.meta.env.VITE_TESTING_USER_EMAIL,
  password: import.meta.env.VITE_TESTING_USER_EMAIL,
})

const router = useRouter()
const { realtimeErrors, handleLoginForm } = useFormError()

watchDebounced(
  formData,
  async () => {
    console.log('Run handleLoginForm...')
    await handleLoginForm(formData.value)
    console.log('with watchDebounced', realtimeErrors.value)
  },
  {
    debounce: 1000,
    deep: true,
  },
)
const sigin = async () => {
  const { error } = await loginWithSupabase({ formData: formData.value })
  if (!error) return router.push('/')
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" class="w-full"> Register with Google </Button>
          <Separator label="Or" />
        </div>
        <form class="grid gap-4" @submit.prevent="sigin">
          <div class="grid gap-2">
            <Label id="email" class="text-left">Email</Label>
            <Input v-model="formData.email" type="email" required />
            <p class="text-slate-800 text-xs text-left">
              Note: the credentials are fake one. The app runs a Free Supabase database. It is reset
              once a day. <br /><br /><strong>Click login to view the authenticated pages</strong>
            </p>
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.email.length">
              <li v-for="error in realtimeErrors.email" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label id="password">Password</Label>
              <a href="#" class="inline-block ml-auto text-xs underline"> Forgot your password? </a>
            </div>
            <Input
              v-model="formData.password"
              id="password"
              type="password"
              autocomplete
              required
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.password.length">
              <li v-for="error in realtimeErrors.password" :key="error">- {{ error }}</li>
            </ul>
          </div>
          <Button type="submit" class="w-full"> Login </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <RouterLink to="/register" class="underline"> Register </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
