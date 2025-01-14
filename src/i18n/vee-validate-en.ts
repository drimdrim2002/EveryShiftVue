import { regex, type required } from '@vee-validate/rules'

export const en = {
  messages: {
    required: 'The {field} is required',
    email: 'The {field} must be a valid email',
    url: 'The {field} must be a valid URL.',
    min: 'The {field} must be 0:{min} characters long',
    max: 'The {field} must be 0:{min} characters long',
    regex: 'The {field} doesn´t match the expected format',
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
    entity_name: {
      regex: 'The name should be 3 to 60 characters long.',
    },
    entity_slug: {
      regex:
        'The name should be 3 to 60 lowercased characters long, with no accentuated characters. Dashes are allowed.',
    },
    entity_description: {
      regex: 'The {field} should be 1 to 500 characters long. Newlines are allowed.',
    },
    sub_entity_name: {
      required: 'The name is required.',
      regex: 'The name should be 3 to 255 characters long.',
    },
    sub_entity_profile_id: {
      required: 'A profile from the list must be selected.',
    },
    sub_entity_entity_id: {
      required: 'An entity from the list must be selected.',
    },
    sub_entity_description: {
      regex: 'The {field} should be 1 to 500 characters long. Newlines are allowed.',
    },
  },
}
