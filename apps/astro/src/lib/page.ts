import type { PageResponse } from '@monolithe/api/types'
import { api } from '@monolithe/api'

export const page = async (url: string): Promise<PageResponse> => {
  return api.fetchPage(url)
}
