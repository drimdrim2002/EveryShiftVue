import type { RequestProfile } from './RequestProfile'

export interface CacheValidationRefreshRequest {
  key?: string | number
  forceRefresh?: boolean
}
