import type { Services, PageSlug } from '../types'
import type { Payload } from '../types/payload'

export const transformServicesData = (
  { title: heroTitle, heroImage }: Payload.PageService,
  slug: PageSlug,
): Services.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as Payload.Media,
      slug: slug,
    },
  }
}
