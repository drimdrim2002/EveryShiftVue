<template>
  <vee-form @submit="login" class="card card-form">
    <h1 class="text-center">Login</h1>
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
      ref="captchaRef"
      v-if="enableHcaptcha"
      @@hcaptcha-notification="notifyUserWithCaptchaResponse"
    />
    <div class="push-top">
      <!-- 
          The button below calls the runCaptcha of the app-captcha.
          In test mode, it verifies the captcha.
          See comment of BenW301 to this reply: https://stackoverflow.com/a/55317353/3910066
         -->
      <button
        @click="captchaRef.runCaptcha(enableHcaptcha)"
        type="submit"
        class="btn-blue btn-block"
      >
        Log in
      </button>
      <!-- <button type="submit" class="btn-blue btn-block">Log in</button> -->
    </div>
    <div v-if="props.errorMessage != ''" class="error-message">
      {{ props.errorMessage }}
    </div>
    <div v-if="enableRegister" class="form-actions text-right">
      <router-link to="/register"> Create an account? </router-link>
    </div>
  </vee-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getQueryStringValue } from '@/utils/query-string-helper'
import { AppQueryStringParam } from '@/enums/AppQueryStringParam'
import type UserLoginRequest from '@/types/UserLoginRequest'
import type PropsAppLoginForm from '@/types/PropsAppLoginForm'
import useNotification from '@/composables/useNotification'
import { NotificationType } from '@/enums/NotificationType'
import AppCaptcha from '@/components/AppCaptcha.vue'
import type CaptchaEmitNotification from '@/types/CaptchaEmitNotification'

const route = useRoute()

const props = withDefaults(defineProps<PropsAppLoginForm>(), {
  enableRegister: true,
  enableHcaptcha: true,
})

const emits = defineEmits<{
  (event: '@login', request: UserLoginRequest): void
}>()

const form = ref<UserLoginRequest>({ email: '', password: '' })
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
  if (!props.enableHcaptcha) {
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
