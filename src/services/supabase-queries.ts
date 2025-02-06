import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/DatabaseTypes'
import type { EntityRecordWithRpc } from '@/types/EntityRecordWithRpc'
import type { FormDataCreateEntity } from '@/types/FormDataCreateEntity'
import type { FormDataCreateSubEntity } from '@/types/FormDataCreateSubEntity'
import type { PostgrestSingleResponse, QueryData } from '@supabase/supabase-js'

export const createEntityQuery = async (entity: FormDataCreateEntity) => {
  return await supabase.from('entities').insert(entity)
}
export const updateEntityQuery = async (entity = {}, id: number) => {
  const result = await supabase.from('entities').update(entity).eq('id', id)
  return result // {count, data, error, status}
}
export const deleteEntityQuery = async (id: number) => {
  return await supabase.from('entities').delete().eq('id', id)
}

export const allEntitiesQuery = supabase.rpc('coalesce_updated_at_or_created_at_sort', {
  target_table: 'entities',
  selected_columns: '*',
  sort_direction: 'DESC',
  nulls_position: 'LAST',
}) as unknown as PostgrestSingleResponse<EntityRecordWithRpc[]>
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

export const createSubEntityQuery = async (entity: FormDataCreateSubEntity) => {
  const { entity_id, ...entity_props } = entity
  return await supabase
    .from('sub_entities')
    .insert({ ...entity_props, entity_id: parseInt(entity_id) })
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
    .eq('id', parseInt(id))
    .single()
export type SubEntityWithParentType = QueryData<ReturnType<typeof subEntityWithParentQuery>>

export const readKeepAliveQuery = async () =>
  await supabase.from('keep_alive').select('is_set').limit(1)
