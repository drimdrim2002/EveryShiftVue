import type { ErrorExtended } from '@/types/ErrorExtended'
import type { PostgrestErrorExtended } from '@/types/PostgrestErrorExtended'
import type {
  SupabaseAuthApiErrorExtended,
  SupabaseAuthErrorExtended,
} from '@/types/SupabaseAuthErrorExtended'
import {
  AuthApiError,
  AuthError,
  AuthRetryableFetchError,
  type PostgrestError,
} from '@supabase/supabase-js'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<
    | null
    | PostgrestErrorExtended
    | SupabaseAuthApiErrorExtended
    | SupabaseAuthErrorExtended
    | ErrorExtended
  >(null)
  const isCustomError = ref(false)
  const setError = ({
    error,
    customCode,
    nextPage,
  }: {
    error: string | PostgrestErrorExtended | Error
    customCode?: number
    nextPage?: string
  }) => {
    const errorIsString = typeof error === 'string'
    if (errorIsString) isCustomError.value = true
    if (errorIsString || error instanceof Error) {
      console.log('Received a string error', error)
      activeError.value = errorIsString ? Error(error) : error
      activeError.value.customCode = customCode || 500
      if (nextPage) activeError.value.nextPage = nextPage
      return
    }

    // if (!errorIsString && error instanceof AuthError) {

    // }
    console.log('Received a PostgrestError error')
    activeError.value = error
    ;(activeError.value as PostgrestErrorExtended).statusCode = customCode || 500
  }

  const setAuthError = ({
    authError,
    nextPage,
  }: {
    authError: AuthError | AuthApiError
    nextPage: string
  }) => {
    if (authError instanceof AuthError) {
      console.error('Got an AuthError')
    }
    if (authError instanceof AuthApiError) {
      console.error('Got an AuthApiError')
    }
    if (authError instanceof AuthRetryableFetchError) {
      console.error('Got an AuthRetryableFetchError')
      authError.status = 401
      authError.message = 'Check Supabase project. It might be sleeping after a week of inactivity'
      authError.code = 'ERR_AUTH_UNAVAILABLE'
    }
    console.log('Received a auth error')
    console.log(authError)

    activeError.value = authError
    activeError.value.nextPage = nextPage
    isCustomError.value = true
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    isCustomError,
    setError,
    setAuthError,
    clearError,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
