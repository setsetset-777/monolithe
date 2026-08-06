export const encodeSlug = (slug: string): string => {
  return slug.replaceAll(' ', '-').toLowerCase()
}
