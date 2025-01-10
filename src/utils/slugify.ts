export const slugify = (str: string | undefined): string => {
  if (str === undefined || !str) {
    return ''
  }
  const slug = str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return slug
}
