import { fetchGeneral, fetchPage, fetchProjects } from './api'
import type { General, PageData, Projects } from './types/api'
import type { Payload } from './types/payload'

const general = async (locale?: Payload.Locale): Promise<General.Data> => {
  return fetchGeneral(locale)
}

const page = async (path: string, locale?: Payload.Locale): Promise<PageData> => {
  return fetchPage(path, locale)
}

const projects = async (
  params: Parameters<typeof fetchProjects>[0],
  locale?: Payload.Locale,
): Promise<Projects.List> => {
  return fetchProjects(params, locale)
}

export default {
  general,
  page,
  projects,
}
