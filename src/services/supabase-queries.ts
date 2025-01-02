import { supabase } from '@/lib/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'

export const createEntityQuery = async (entity: {}) => {
  return await supabase.from('entities').insert(entity)
}
export const updateEntityQuery = async (entity = {}, id: number) => {
  const result = await supabase.from('entities').update(entity).eq('id', id)
  return result // {count, data, error, status}
}
export const deleteEntityQuery = async (id: number) => {
  return await supabase.from('entities').delete().eq('id', id)
}
export const allEntitiesQuery = supabase
  .from('entities')
  .select()
  // TODO > about ordering with Supabase !
  .order('created_at', { ascending: false, nullsFirst: false })
  .order('updated_at', { ascending: false, nullsFirst: false })
export type AllEntitiesType = QueryData<typeof allEntitiesQuery>
export const entityWithSubEntitiesBySlugQuery = (slug: string) =>
  supabase
    .from('entities')
    .select(
      `
    *,
    sub_entities (
      id,
      name,
      status,
      due_date  
    )
  `,
    )
    .eq('slug', slug)
    .single()
export type EntityWithSubEntitiesBySlugType = QueryData<
  ReturnType<typeof entityWithSubEntitiesBySlugQuery>
>

export const createSubEntityQuery = async (entity: {}) => {
  return await supabase.from('sub_entities').insert(entity)
}
export const updateSubEntityQuery = async (entity = {}, id: number) => {
  const result = await supabase.from('sub_entities').update(entity).eq('id', id)
  return result // {count, data, error, status}
}
export const deleteSubEntityQuery = async (id: number) => {
  return await supabase.from('sub_entities').delete().eq('id', id)
}
export const subEntityWithParentQuery = (id: string) =>
  supabase
    .from('sub_entities')
    .select(
      `
    *,
    entities (
      id,
      name,
      slug
    )
  `,
    )
    .eq('id', id)
    .single()
export type SubEntityWithParentType = QueryData<ReturnType<typeof subEntityWithParentQuery>>
