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
  params: API.Projects.SearchParams,
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
        parentSlug: 'pageProjects',
        ...(await formatProjectData({
          res,
          payload: req.payload,
          locale,
        })),
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
          locale,
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
          locale,
        })),
      }

    case 'pageProjects':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })

      return {
        slug,
        ...(await formatProjectsData({
          res,
          payload: req.payload,
          locale,
          params,
        })),
      }

    case 'pageContact':
      res = await req.payload.findGlobal({
        slug,
        locale,
      })
      return {
        slug,
        ...(await formatContactData({ res, payload: req.payload, locale })),
      }
  }
  return null
}
