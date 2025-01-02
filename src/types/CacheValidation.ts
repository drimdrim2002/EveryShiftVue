import type { CacheValidationInfo } from './CacheValidationInfo'
import type { StoreCacheKey } from './StoreCacheKeys'

export interface CacheValidation<Reference, Query, Loader> {
  reference: Reference
  query: Query
  key: string | StoreCacheKey
  filter?: string | Object
  loaderFn: Loader
  lastFetchInfo: CacheValidationInfo
  invalidateAfterSeconds?: number
}
