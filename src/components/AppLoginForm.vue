<template>
  <vee-form @submit="login">
    <app-form-field
      name="email"
      label="Email"
      v-model="form.email"
      rules="required|email"
      type="text"
    />
    <app-form-field
      name="password"
      label="Password"
      v-model="form.password"
      rules="required|min:8"
      type="password"
    />
    <app-captcha
      class="mt-4 overflow-hidden"
      ref="captchaRef"
      v-if="enableHcaptcha"
      @@hcaptcha-notification="notifyUserWithCaptchaResponse"
    />
    <!-- 
          The button below calls the runCaptcha of the app-captcha.
          In test mode, it verifies the captcha.
          See comment of BenW301 to this reply: https://stackoverflow.com/a/55317353/3910066
         -->
    <button
      @click="captchaRef.runCaptcha(enableHcaptcha)"
      type="submit"
      class="btn bg-blue-700 text-white my-4"
    >
      Log in
    </button>
    <!-- <button type="submit" class="btn-blue btn-block">Log in</button> -->
    <div v-if="errorMessage != ''" class="text-xs text-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="enableRegister" class="btn bg-gray-300">
      <router-link to="/register"> Create an account? </router-link>
    </div>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type UserLoginRequest from '@/types/UserLoginRequest'
import type PropsAppLoginForm from '@/types/PropsAppLoginForm'
import useNotification from '@/composables/useNotification'
import { NotificationType } from '@/enums/NotificationType'
import AppCaptcha from '@/components/AppCaptcha.vue'
import type CaptchaEmitNotification from '@/types/CaptchaEmitNotification'

const {
  enableHcaptcha = true,
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
