import { supabase } from '@/lib/supabaseClient'
import type { RegistrationData } from '@/types/RegistrationData'
import { insertUserProfileQuery } from './supabase-profile-queries'
import type { LoginData } from '@/types/LoginData'
import { RouterPathEnum } from '@/types/RouterPathEnum'

/**
 * TODO: Before enabling this, read the docs below:
 *  > see https://github.com/orgs/supabase/discussions/29370
 *  > see https://supabase.com/docs/guides/auth/auth-smtp
 *
 * @param RegistrationData Object containing the form data
 * @returns
 */
export const signupWithEmail = async ({ formData }: { formData: RegistrationData }) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (authError) {
    useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Register })
    return { error: authError }
  }

  // Create profile only if user is confirmed (no email verification needed)
  if (authData.user && authData.session) {
    console.log('사용자 인증 완료, 프로필 생성 시작')
    const { error } = await insertUserProfileQuery({
      user: authData.user,
      formData: formData,
    })

    if (error) {
      console.error('프로필 생성 실패:', error)
      useErrorStore().setError({ error, nextPage: RouterPathEnum.Register })
      return { error }
    }

    console.log('프로필 생성 완료')
    return { error: null }
  }

  // User created but needs email confirmation
  if (authData.user && !authData.session) {
    console.log('이메일 확인이 필요한 사용자입니다.')
    return { error: null, needsConfirmation: true }
  }

  const uncaughtError = Error(`Authenticated user <${formData.email}> is absent.`)
  useErrorStore().setError({ error: uncaughtError, nextPage: RouterPathEnum.Register })
  return { error: uncaughtError }
}

export const signupWithGoogle = () => false

export const loginWithSupabase = async ({ formData }: { formData: LoginData }) => {
  // 개발 환경에서만 디버깅 로그 표시
  if (import.meta.env.DEV) {
    console.log('로그인 시도:', {
      email: formData.email,
      emailLength: formData.email.length,
      passwordLength: formData.password.length,
      emailTrimmed: formData.email === formData.email.trim(),
      passwordTrimmed: formData.password === formData.password.trim()
    })
  }
  
  // Authenticate
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: formData.email.trim(), // 공백 제거
    password: formData.password.trim(), // 공백 제거
  })

  if (authError) {
    // 로그인 에러는 페이지에서 직접 처리하므로 ErrorStore에 설정하지 않음
    return { error: authError }
  }

  return { error: null }
}

export const retrieveCurrentSession = async () => {
  const { data, error: authError } = await supabase.auth.getSession()

  if (authError) {
    useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
    return { error: authError }
  }

  return { data }
}

export const reauthenticate = async () => await supabase.auth.reauthenticate()
export const logoutFromSupabase = async () => await supabase.auth.signOut()
