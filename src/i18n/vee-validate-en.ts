import type { required } from '@vee-validate/rules'

export const en = {
  messages: {
    required: 'The {field} is required',
    email: 'The {field} must be a valid email',
    url: 'The {field} must be a valid URL.',
    min: 'The {field} must be 0:{min} characters long',
    unique: 'The {field} is already taken.',
  },
  fields: {
    confirmPassword: {
      required: 'The password confirmation is required',
    },
    firstName: {
      required: 'The first name is required',
    },
    lastName: {
      required: 'The last name is required',
    },
  },
}
