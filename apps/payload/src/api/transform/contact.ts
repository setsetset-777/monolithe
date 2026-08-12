import type * as API from '@monolithe/api/types'
import type { PageContact, PageSlug } from '@/types'

export const transformContactData = (
  { title: heroTitle, heroImage }: PageContact,
  slug: PageSlug,
): API.Contact.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as API.Media,
      slug: slug,
    },
  }
}
