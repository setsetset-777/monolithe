import type * as API from '@monolithe/api/types'
import type { PageProject, PageSlug } from '@/types'

export const transformProjectsData = (
  { title: pageTitle, heroImage }: PageProject,
  slug: PageSlug,
): {
  meta: API.Meta
  data: API.Projects.Data
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
