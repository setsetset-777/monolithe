import type * as API from '@monolithe/api/types'
import type { PageService, PageSlug } from '@/types'

export const transformServicesData = (
  { title: pageTitle, heroImage }: PageService,
  slug: PageSlug,
): {
  meta: API.Meta
  data: API.Services.Data
} => {
  return {
    meta: {
      title: pageTitle,
    },
    data: {
      hero: {
        title: pageTitle,
        image: heroImage as API.Media,
        slug: slug,
      },
    },
  }
}
