import type { LoginData } from './LoginData'

export interface RegistrationData extends LoginData {
  username: string
  firstName: string
  lastName: string
}
