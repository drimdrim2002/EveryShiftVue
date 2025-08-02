import type { CacheValidationInfo } from './CacheValidationInfo'
import type { StoreCacheKey } from './StoreCacheKeys'

export interface CacheValidation<Reference, Query, Loader> {
  reference: Reference
  query: Query
  key: string | StoreCacheKey
  filter?: string | object
  loaderFn: Loader
  lastFetchInfo: CacheValidationInfo
  invalidateAfterSeconds?: number
}
