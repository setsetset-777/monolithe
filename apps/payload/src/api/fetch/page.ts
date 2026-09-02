import { resolveRoute } from '../../helpers/routes'
import type { PayloadRequest } from 'payload'
import type * as API from '@monolithe/api/types'
import {
  getContactData,
  getHomeData,
  getPresentationData,
  getProjectData,
  getProjectsData,
  formatServicesData,
} from '../data'
import { Locale } from '@/types'

export const fetchPage = async (
  req: PayloadRequest,
  path: string,
  params: API.Projects.SearchParams,
): Promise<API.PageData | null> => {
  const {
    locale,
    route: { slug, id },
  } = await resolveRoute({ path, payload: req.payload })
  let res
  let data

  switch (slug) {
    case 'projects':
      data = await getProjectData({
        id,
        payload: req.payload,
        locale,
      })
      return {
        slug,
        parentSlug: 'pageProjects',
        ...data,
      }

    case 'pageHome':
      data = await getHomeData({
        payload: req.payload,
        locale,
      })
      return {
        slug,
        ...data,
      }

    case 'pagePresentation':
      data = await getPresentationData({ payload: req.payload, locale: locale })
      return {
        slug,
        ...data,
      }

    case 'pageServices':
      data = await formatServicesData({
        payload: req.payload,
        locale,
      })
      return {
        slug,
        ...data,
      }

    case 'pageProjects':
      data = await getProjectsData({
        payload: req.payload,
        locale,
        params,
      })
      return {
        slug,
        ...data,
      }

    case 'pageContact':
      data = await getContactData({ payload: req.payload, locale })
      return {
        slug,
        ...data,
      }
  }
  return null
}
