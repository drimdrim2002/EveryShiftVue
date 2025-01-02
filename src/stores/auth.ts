import { type Session, type User } from '@supabase/supabase-js'
// TODO > enable after types are ready
// import type { Tables } from '@/types/database.types'
import { type UserProfile } from '@/services/supabase-queries'
import { logoutFromSupabase, retrieveCurrentSession } from '@/services/supabase-auth'
import { RouterPathEnum } from '@/types/RouterPathEnum'
import { supabase } from '@/lib/supabaseClient'
import { toISOStringWithTimezone } from '@/utils/date-format'

export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<null | User>({
    id: '29d6afde-e2eb-4899-919c-1f9c47a7f746',
    aud: '',
    app_metadata: {},
    user_metadata: {},
    created_at: toISOStringWithTimezone(new Date(Date.now())),
  })
  const profile = ref<null | UserProfile>(null)
  const isTrackingAuthChanges = ref(false)

  const setAuth = async ({ session }: { session: null | Session; nextPageOnError?: string }) => {
    if (!session) {
      user.value = null
      profile.value = null
      return
    }

    user.value = session.user
    await setProfile()
  }

  const setProfile = async () => {
    if (!user.value) {
      // no user = no possible to fetch a profile
      profile.value = null
      return
    }
    if (!profile.value || profile.value.id !== user.value?.id) {
      const profileStore = useProfileStore()
      const { profile: authProfile } = storeToRefs(profileStore)
      await profileStore.getProfile({ column: 'id', value: user.value.id })
      profile.value = authProfile.value || null
    }
  }

  const getSession = async () => {
    const { error: authError } = await retrieveCurrentSession()

    if (authError) {
      useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
    }
  }

  const logout = async () => {
    const { error: authError } = await logoutFromSupabase()
    if (authError) {
      useErrorStore().setAuthError({ authError, nextPage: RouterPathEnum.Login })
      return { isLoggedOut: false }
    }
    return { isLoggedOut: true }
  }

  const trackAuthChanges = () => {
    if (isTrackingAuthChanges.value) {
      return
    }
    isTrackingAuthChanges.value = false
    supabase.auth.onAuthStateChange((event, session) => {
      // See https://supabase.com/docs/reference/javascript/auth-onauthstatechange
      setTimeout(async () => {
        await useAuthStore().setAuth({ session })
      }, 0)
    })
  }
  return { user, profile, setAuth, setProfile, getSession, logout, trackAuthChanges }
})
