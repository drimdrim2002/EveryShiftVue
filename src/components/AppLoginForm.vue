<template>
  <vee-form @submit="login" class="space-y-4" autocomplete="off">
    <app-form-field
      name="email"
      label="Email"
      v-model="form.email"
      rules="required|email"
      type="email"
      autocomplete="username"
    />
    <app-form-field
      name="password"
      label="Password"
      v-model="form.password"
      rules="required|min:8"
      type="password"
      autocomplete="off"
    />
    <Button 
      type="submit" 
      class="w-full mt-6"
      :disabled="disabled"
    >
      Log in
    </Button>
    <div v-if="errorMessage != ''" class="text-sm text-red-600 mt-2">
      {{ errorMessage }}
    </div>
    <div v-if="enableRegister" class="flex flex-row items-center justify-between mt-4 pt-4 border-t">
      <span class="text-sm text-muted-foreground">Create an account?</span>
      <AppLink to="/register" class="text-sm font-medium text-brand hover:underline">
        Register
      </AppLink>
    </div>
  </vee-form>
</template>

<script setup lang="ts">
import type UserLoginRequest from '@/types/UserLoginRequest'
import type PropsAppLoginForm from '@/types/PropsAppLoginForm'
import { Form as VeeForm } from 'vee-validate'

const {
  enableRegister = true,
  errorMessage,
  disabled = false,
} = defineProps<PropsAppLoginForm>()

const emits = defineEmits<{
  (event: '@login', request: UserLoginRequest): void
}>()

const testEmail = import.meta.env.VITE_TESTING_USER_EMAIL
const form = ref<UserLoginRequest>({ email: testEmail, password: testEmail })

const login = async () => {
  emits('@login', {
    ...form.value,
  })
}
</script>

<style scoped></style>
