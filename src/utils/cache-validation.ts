import type { CacheValidation } from '@/types/CacheValidation'

/**
 * Could be better to use UseMemoize type directly
 * since if the delete method changes, you'll need
 * update the WithUseMemoize interface
 */
interface WithUseMemoize<Type = string> {
  delete(key: Type): void
}
/**
 * Default seconds delta at which the cache is considered staled.
 */
export const MAX_STALE_SECONDS = 3600
/**
 *  We are calling the supabase API too much. Can't we cache in the useMemoize
 *  the last time we used the network and only call the network again unless
 *  the data is changed (add, update, delete) and if the last fetch was performed
 *  more than x time ago?
 *
 * @param Object Object exepect a timeStamp value and seconds delta when the cache
 * should be invalidated. If the seconds delta isn't provided, then the default is
 * MAX_STALE_SECONDS
 * @returns
 */
export const timeStampExpired = ({
  timeStamp,
  invalidateAfterSeconds,
}: {
  timeStamp: number
  invalidateAfterSeconds?: number
}) => {
  const lastFetchExpired = Date.now() + (invalidateAfterSeconds || MAX_STALE_SECONDS) < timeStamp
  // console.log('timeStampExpired:', [
  //   {
  //     label: 'now - lastFetchInfo.timeStamp',
  //     value: Date.now() + (invalidateAfterSeconds || MAX_STALE_SECONDS) - timeStamp,
  //   },
  //   { label: 'lastFetchExpired', value: lastFetchExpired },
  // ])
  return lastFetchExpired
}
/**
 * The method accept a CacheValidation instance expecting:
 *  - a reference which type is the "typeof" of your Reactive Ref in your store
 *  - a last fetch reference which type is the "typeof" of your Reactive Ref holding the array
 *    about the last fetch for the given key
 *  - a query which type is the "typeof" of your Supabase query
 *  - a loader which type is the "typeof" of the useMemoize's implementation function
 *  - a key which is the cache key for useMemoize
 *  - a filter if the query need one. It supports string and object value for now
 *
 * The generic expects the following types:
 *  - a reference type which is the "typeof" of your Reactive Ref in your store
 *  - a query type which is the "typeof" of your Supabase query
 *  - a loader type which is the "typeof" of the useMemoize's implementation function
 *  - a error type which is the Supabase type error. It'll depend on what you call
 *
 * @param param0 The CacheValidation instance
 */
export const validateCache = <
  Reference extends Ref,
  Query,
  Loader extends WithUseMemoize<any>,
  ErrorType,
>({
  reference,
  query,
  key,
  filter,
  loaderFn,
  lastFetchInfo,
  invalidateAfterSeconds,
}: CacheValidation<Reference, Query, Loader>) => {
  if (reference.value) {
    const lastFetchExpired = timeStampExpired({
      timeStamp: lastFetchInfo.timeStamp,
      invalidateAfterSeconds,
    })
    const refreshNeeded = lastFetchInfo.forceRefresh || lastFetchExpired
    if (!refreshNeeded) {
      console.info(`cache for <${key}> still valid. no refresh needed ✅`)
      return // nothing to refresh
    }
    console.info(`cache for <${key}> has staled. REFRESH NEEDED ⚠️`)
    const finalQuery = typeof query === 'function' ? query(filter) : query
    finalQuery.then(({ data, error }: { data: Reference; error: ErrorType }) => {
      if (JSON.stringify(reference.value) === JSON.stringify(data)) {
        console.info('current remote data and cache identical!')
        return
      } else {
        loaderFn.delete(key as string)
        if (!error && data) {
          console.info(`data for <${key}> was refreshed!`)
          reference.value = data
        }
      }
    })
  }
}
