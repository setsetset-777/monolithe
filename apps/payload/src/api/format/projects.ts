import type * as API from '@monolithe/api/types'
import type { PageProject, Locale } from '@/types'
import type { BasePayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { fetchProjects } from '../fetch/projects'

interface Props {
  payload: BasePayload
  locale: Locale
  res: PageProject
  pagination?: {}
  params?: API.Projects.SearchParams
}

export const formatProjectsData = async ({
  res: { title: pageTitle, heroImage },
  payload,
  locale,
  params = {},
}: Props): Promise<{
  meta: API.Meta
  data: API.Projects.Data
}> => {
  const [services, projects] = await Promise.all([
    listPublishedCollection({ slug: 'services', payload, locale }),
    fetchProjects({
      payload,
      locale,
      params,
    }),
  ])

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
