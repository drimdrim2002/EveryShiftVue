export type CacheValidationKeyInfo = {
  [key: string]: CacheValidationInfo
}

export type CacheValidationInfo = {
  timeStamp: number
  forceRefresh?: boolean
}
