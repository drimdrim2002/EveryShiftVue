<template>
  <vee-form @submit="login" class="space-y-4">
    <app-form-field
      name="email"
      label="Email"
      v-model="form.email"
      rules="required|email"
      type="email"
    />
    <app-form-field
      name="password"
      label="Password"
      v-model="form.password"
      rules="required|min:8"
      type="password"
    />
    <div v-if="enableHcaptcha" class="mt-4 w-full">
      <app-captcha
        ref="captchaRef"
        @@hcaptcha-notification="notifyUserWithCaptchaResponse"
      />
    </div>
    <!-- 
          The button below calls the runCaptcha of the app-captcha.
          In test mode, it verifies the captcha.
          See comment of BenW301 to this reply: https://stackoverflow.com/a/55317353/3910066
         -->
    <Button 
      @click="captchaRef.runCaptcha(enableHcaptcha)" 
      type="submit" 
      class="w-full mt-6"
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
import type CaptchaEmitNotification from '@/types/CaptchaEmitNotification'

import { Form as VeeForm } from 'vee-validate'
import { NotificationType } from '@/enums/NotificationType'
import AppCaptcha from '@/components/AppCaptcha.vue'

const {
  enableHcaptcha = import.meta.env.DEV ? false : true, // 개발 환경에서는 hCaptcha 비활성화
  enableRegister = true,
  errorMessage,
} = defineProps<PropsAppLoginForm>()

const emits = defineEmits<{
  (event: '@login', request: UserLoginRequest): void
}>()

const testEmail = import.meta.env.VITE_TESTING_USER_EMAIL
const form = ref<UserLoginRequest>({ email: testEmail, password: testEmail })
const captchaPassed = ref(false)
const captchaRef = ref(AppCaptcha)
const captchaErrorMessage = ref('')

const notifyUserWithCaptchaResponse = (response: CaptchaEmitNotification) => {
  if (response.success) {
    captchaPassed.value = true
  } else {
    captchaPassed.value = false
    captchaErrorMessage.value = '🚧 Please resolve the captcha challenge to login.'
  }
}

const login = async () => {
  if (!enableHcaptcha) {
    captchaPassed.value = true
  }
  if (!captchaPassed.value) {
    useNotification().addNotification({
      message: captchaErrorMessage.value,
      type: NotificationType.Error,
    })
  } else {
    emits('@login', {
      ...form.value,
    })
  }
}
</script>

<style scoped></style>
