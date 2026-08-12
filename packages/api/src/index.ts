import { fetchGeneral, fetchPage } from './api'
import type { General, PageData } from './types/api'
import type { Payload } from './types/payload'

const general = async (locale?: Payload.Locale): Promise<General.Data> => {
  return fetchGeneral(locale)
}

const page = async (path: string, locale?: Payload.Locale): Promise<PageData> => {
  return fetchPage(path, locale)
}

export default {
  general,
  page,
}
