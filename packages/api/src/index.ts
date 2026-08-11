import { fetchGeneral, fetchPage } from './api'
import {
  transformGeneralData,
  transformHomeData,
  transformContactData,
  transformPresentationData,
  transformProjectData,
  transformProjectsData,
  transformServicesData,
} from './transform'
import type { General, PageData } from './types'
import type { Payload } from './types/payload'

const general = async (locale?: Payload.Locale): Promise<General.Data> => {
  const { general, services, routes } = await fetchGeneral(locale)

  const data = transformGeneralData({ general, services, routes })

  return data
}

const page = async (path: string, locale?: Payload.Locale): Promise<PageData> => {
  const { slug, data } = await fetchPage(path, locale)

  switch (slug) {
    case 'pageHome':
      return {
        data: transformHomeData(data as Payload.PageHome),
        slug,
      }
    case 'pagePresentation':
      return {
        data: transformPresentationData(data as Payload.PagePresentation, slug),
        slug,
      }
    case 'pageServices':
      return {
        data: transformServicesData(data as Payload.PageService, slug),
        slug,
      }
    case 'pageProjects':
      return {
        data: transformProjectsData(data as Payload.PageProject, slug),
        slug,
      }
    case 'projects':
      return {
        data: transformProjectData(data as Payload.Project, slug),
        slug,
      }
    case 'pageContact':
      return {
        data: transformContactData(data as Payload.PageContact, slug),
        slug,
      }
  }
}

export default {
  general,
  page,
}
