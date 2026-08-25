import { resolveRoute } from '../../helpers/routes'
import type { PayloadRequest } from 'payload'
import type * as API from '@monolithe/api/types'
import {
  formatContactData,
  formatHomeData,
  formatPresentationData,
  formatProjectData,
  formatProjectsData,
  formatServicesData,
} from '../format'
import { Locale } from '@/types'

export const fetchPage = async (
  req: PayloadRequest,
  path: string,
  params: URLSearchParams,
): Promise<API.PageData | null> => {
  const {
    locale,
    route: { slug, id },
  } = await resolveRoute({ path, payload: req.payload })
  let res

  switch (slug) {
    case 'projects':
      res = await req.payload.findByID({
        collection: slug,
        locale,
        id,
      })
      return {
        slug,
        ...formatProjectData(res, slug),
      }

    case 'pageHome':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      return {
        slug,
        ...(await formatHomeData({
          res,
          payload: req.payload,
          locale: req.locale as Locale,
        })),
      }

    case 'pagePresentation':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      return {
        slug,
        ...formatPresentationData({ res }),
      }

    case 'pageServices':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      return {
        slug,
        ...(await formatServicesData({
          res,
          payload: req.payload,
          locale: req.locale as Locale,
        })),
      }

    case 'pageProjects':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      const limit = params.get('limit')
      const page = params.get('page')
      const services = params.get('services')

      const projectsParams = {
        services: services?.split(','),
        limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
        page: typeof page === 'string' ? parseInt(page, 10) : undefined,
      }
      return {
        slug,
        ...(await formatProjectsData({
          res,
          payload: req.payload,
          locale: req.locale as Locale,
          params: projectsParams,
        })),
      }

    case 'pageContact':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      return {
        slug,
        ...formatContactData(res, slug),
      }
  }
  return null
}
