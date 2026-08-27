import type * as API from '@monolithe/api/types'
import type { Project } from '@/types'

export const formatProjectData = ({
  title,
}: Project): {
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
