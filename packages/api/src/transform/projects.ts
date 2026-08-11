import type { Projects, PageSlug } from '../types'
import type { Payload } from '../types/payload'

export const transformProjectsData = (
  { title: heroTitle, heroImage }: Payload.PageProject,
  slug: PageSlug,
): Projects.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as Payload.Media,
      slug: slug,
    },
  }
}
