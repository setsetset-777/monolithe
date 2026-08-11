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
      return transformHomeData(data as Payload.PageHome)
    case 'pagePresentation':
      return transformPresentationData(data as Payload.PagePresentation, slug)
    case 'pageServices':
      return transformServicesData(data as Payload.PageService)
    case 'pageProjects':
      return transformProjectsData(data as Payload.PageProject)
    case 'projects':
      return transformProjectData(data as Payload.Project)
    case 'pageContact':
      return transformContactData(data as Payload.PageContact)
  }
}

export default {
  general,
  page,
}
