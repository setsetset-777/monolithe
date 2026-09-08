import { BasePayload } from 'payload'
import type * as API from '@monolithe/api/types'
import { Locale } from '@/types'
import { getProjectListData } from '../data/project-list'

export const fetchProjects = async ({
  locale,
  params,
}: {
  locale: Locale
  params: API.Projects.SearchParams
}): Promise<API.Projects.List> => {
  return getProjectListData({ params, locale })
}
