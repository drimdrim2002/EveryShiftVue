<script setup lang="ts">
import type { RegistrationData } from '@/types/RegistrationData'
import { signupWithEmail } from '@/services/supabase-auth'

const router = useRouter()

const signup = async (formData: RegistrationData) => {
  // Authenticate
  const { error } = await signupWithEmail({ formData })
  if (!error) return router.push('/')
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Create a new account </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- <div class="flex flex-col gap-4 mb-4 justify-center items-center">
          <Button variant="outline" class="w-full"> Register with Google </Button>
          <Separator label="Or" />
        </div> -->
        <AppRegisterForm @@register="signup" />
      </CardContent>
    </Card>
  </div>
</template>
