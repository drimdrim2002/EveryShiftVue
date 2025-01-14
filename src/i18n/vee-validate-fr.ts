import type { required } from '@vee-validate/rules'

export const fr = {
  messages: {
    required: 'Le champ {field} est requis',
    email: 'L´{field} doit être une adresse email valide',
    url: 'Le {field} doit être une URL valide.',
    min: 'Le {field} doit faire au moins 0:{min} caractères',
    unique: 'Le {field} existe déjà.',
  },
  fields: {
    confirmPassword: {
      required: 'La confirmation du mot de passe est requise',
    },
    firstName: {
      required: 'Le prénom est requis',
    },
    lastName: {
      required: 'Le nom est requis',
    },
  },
}
