import type * as API from '@monolithe/api/types'
import type { PageService, PageSlug } from '@/types'

export const transformServicesData = (
  { title: heroTitle, heroImage }: PageService,
  slug: PageSlug,
): API.Services.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as API.Media,
      slug: slug,
    },
  }
}
