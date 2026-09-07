import type { General, PageData } from '@monolithe/api/types'
import api from '@monolithe/api'

export const getPage = async (url: string): Promise<PageData | null> => {
  return api.page(url)
}

export const getGeneral = async (): Promise<General.Data | null> => {
  return api.general()
}
