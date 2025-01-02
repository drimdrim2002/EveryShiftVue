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

  // Create profile
  if (authData.user) {
    const { error } = await insertUserProfileQuery({
      user: authData.user,
      formData: formData,
    })

    if (error) {
      useErrorStore().setError({ error, nextPage: RouterPathEnum.Register })
      return { error }
    }

    return { error: null }
  }

  const uncaughtError = Error(`Authenticated user <${formData.email}> is absent.`)
  useErrorStore().setError({ error: uncaughtError, nextPage: RouterPathEnum.Register })
  return { error: uncaughtError }
}

export const signupWithGoogle = () => false

export const loginWithSupabase = async ({ formData }: { formData: LoginData }) => {
  // Authenticate
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (authError) {
    useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
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
