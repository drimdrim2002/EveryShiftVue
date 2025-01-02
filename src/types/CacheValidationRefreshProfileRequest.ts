import type { CacheValidationRefreshRequest } from '@/types/CacheValidationRefreshRequest'
import type { RequestProfile } from '@/types/RequestProfile'

export interface CacheValidationRefreshProfileRequest extends CacheValidationRefreshRequest {
  request: RequestProfile
}
