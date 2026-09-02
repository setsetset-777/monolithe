import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import type { BasePayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { fetchProjects } from '../fetch/projects'

interface Props {
  payload: BasePayload
  locale: Locale
  pagination?: {}
  params?: API.Projects.SearchParams
}

export const getProjectsData = async ({
  payload,
  locale,
  params = {},
}: Props): Promise<{
  meta: API.Meta
  data: API.Projects.Data
}> => {
  const [pageProjects, services, projects] = await Promise.all([
    payload.findGlobal({
      slug: 'pageProjects',
      locale,
    }),
    listPublishedCollection({ slug: 'services', payload, locale }),
    fetchProjects({
      payload,
      locale,
      params,
    }),
  ])

  const { title: pageTitle, heroImage } = pageProjects

  return {
    meta: {
      title: pageTitle,
    },
    data: {
      hero: {
        title: pageTitle,
        image: heroImage as API.Media,
        slug: 'pageProjects',
      },
      services: services.docs.map(({ title, urlSlug }) => {
        return {
          label: title,
          slug: urlSlug,
          // url: `${routes['pageProjects'].path}?${[params.toString()]}`,
        }
      }),
      projects,
    },
  }
}
