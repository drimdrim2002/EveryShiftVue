import { supabase } from '@/lib/supabaseClient'
import type { RegistrationData } from '@/types/RegistrationData'
import type { RequestProfile } from '@/types/RequestProfile'
import type { QueryData, User } from '@supabase/supabase-js'

export const insertUserProfileQuery = async ({
  user,
  formData,
}: {
  user: User
  formData: RegistrationData
}) => {
  const result = await supabase.from('profiles').insert({
    id: user.id,
    username: formData.username,
    full_name: `${formData.firstName} ${formData.lastName}`,
  })
  return result
}

export const userProfileQuery = async ({ column, value }: RequestProfile) => {
  const result = await supabase.from('profiles').select().eq(column, value).single()
  return result
}
export type UserProfile = QueryData<ReturnType<typeof userProfileQuery>>

export const profilesByIdsQuery = async (ids: string[]) => {
  const result = await supabase
    .from('profiles')
    .select('username, avatar_url, id, full_name')
    .in('id', ids)
  return result
}
export type Collabs = QueryData<ReturnType<typeof profilesByIdsQuery>>

export const allProfilesQuery = supabase
  .from('profiles')
  .select()
  .order('updated_at', { ascending: false, nullsFirst: false })
export type AllProfiles = QueryData<typeof allProfilesQuery>
