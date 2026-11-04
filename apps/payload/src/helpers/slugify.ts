import { slugify } from 'payload/shared'

// Transforms aceented letters to the letter before applying Payload's slugify method
export const slugifyWithAccents = (value: string) => {
  const slug = value.normalize('NFKD').replace(/[\u0300-\u036F]/g, '')
  return slugify(slug)
}

export const contactSlug = (label: string) => slugifyWithAccents(label) ?? 'contact'
