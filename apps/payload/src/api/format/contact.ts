import type * as API from '@monolithe/api/types'
import type { PageContact, PageSlug } from '@/types'

export const formatContactData = (
  { title, heroImage }: PageContact,
  slug: PageSlug,
): {
  meta: API.Meta
  data: API.Contact.Data
} => {
  return {
    meta: {
      title,
    },
    data: {
      hero: {
        title,
        image: heroImage as API.Media,
        slug: slug,
      },
    },
  }
}
