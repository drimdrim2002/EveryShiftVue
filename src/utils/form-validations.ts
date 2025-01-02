export const validateEmail = (email: string) => {
  const trimmedEmail = email.trim()
  const errors: string[] = []
  if (!trimmedEmail) return errors

  const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
  const isValidEmailFormat = emailRegex.test(trimmedEmail)

  if (!isValidEmailFormat) {
    errors.push('Not a valid email format')
  }

  return errors
}

export const validatePassword = (password: string) => {
  const errors: string[] = []
  if (!password) return errors

  if (password.length <= 6) {
    errors.push('Password must be longer than 6 characters')
  }

  if (!password.includes('@')) {
    errors.push('Missing required character @')
  }
  return errors
}
