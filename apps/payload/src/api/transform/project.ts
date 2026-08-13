import type * as API from '@monolithe/api/types'
import type { Project, PageSlug } from '@/types'

export const transformProjectData = (
  { title }: Project,
  slug: PageSlug,
): {
  meta: API.Meta
  data: API.Project.Data
} => {
  return {
    meta: {
      title,
    },
    data: {},
  }
}
