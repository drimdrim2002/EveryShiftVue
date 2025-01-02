import type { AuthApiError, AuthError } from '@supabase/supabase-js'
import type { ErrorExtended } from './ErrorExtended'

export interface SupabaseAuthErrorExtended extends AuthError, ErrorExtended {}
export interface SupabaseAuthApiErrorExtended extends AuthApiError, ErrorExtended {}
