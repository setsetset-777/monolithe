import type { GeneralData, LocalizedRoutes, PageResponse } from '@monolithe/api/types'
import { api } from '@monolithe/api'

export const getPage = async (url: string): Promise<PageResponse> => {
  return api.fetchPage(url)
}

export const getGeneral = async (): Promise<GeneralData> => {
  return api.fetchGeneral()
}
