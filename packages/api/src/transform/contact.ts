import type { Contact, PageSlug } from '../types'
import type { Payload } from '../types/payload'

export const transformContactData = (
  { title: heroTitle, heroImage }: Payload.PageContact,
  slug: PageSlug,
): Contact.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as Payload.Media,
      slug: slug,
    },
  }
}
