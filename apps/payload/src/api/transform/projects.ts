import type * as API from '@monolithe/api/types'
import type { PageProject, PageSlug } from '@/types'

export const transformProjectsData = (
  { title: heroTitle, heroImage }: PageProject,
  slug: PageSlug,
): API.Projects.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as API.Media,
      slug: slug,
    },
  }
}
