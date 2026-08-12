import type { General, PageData } from '@monolithe/api/types'
import api from '@monolithe/api'

export const getPage = async (url: string): Promise<PageData> => {
  return api.page(url)
}

export const getGeneral = async (): Promise<General.Data> => {
  return api.general()
}
