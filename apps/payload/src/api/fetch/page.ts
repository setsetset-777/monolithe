import { resolveRoute } from '../../helpers/routes'
import type { PayloadRequest } from 'payload'
import type * as API from '@monolithe/api/types'
import { getContactData } from '@/api/data/contact'
import { getHomeData } from '@/api/data/home'
import { getPresentationData } from '@/api/data/presentation'
import { getProjectData } from '@/api/data/project'
import { getProjectsData } from '@/api/data/projects'
import { getServicesData } from '@/api/data/services'

export const fetchPage = async (
  req: PayloadRequest,
  path: string,
  params: API.Projects.SearchParams,
): Promise<API.PageData | null> => {
  try {
    const route = await resolveRoute({ path, payload: req.payload })

    if (!route) {
      return null
    }

    const {
      locale,
      route: { slug, id },
    } = route

    let data

    switch (slug) {
      case 'projects':
        data = await getProjectData({
          id,
          locale,
        })
        return {
          slug,
          parentSlug: 'pageProjects',
          ...data,
        }

      case 'pageHome':
        data = await getHomeData({
          locale,
        })
        return {
          slug,
          ...data,
        }

      case 'pagePresentation':
        data = await getPresentationData({ locale })
        return {
          slug,
          ...data,
        }

      case 'pageServices':
        data = await getServicesData({
          locale,
        })
        return {
          slug,
          ...data,
        }

      case 'pageProjects':
        data = await getProjectsData({
          locale,
          params,
        })
        return {
          slug,
          ...data,
        }

      case 'pageContact':
        data = await getContactData({ locale })
        return {
          slug,
          ...data,
        }
    }
  } catch (e) {
    throw e
  }
  return null
}
