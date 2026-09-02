import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { getProjectListData } from '@/api/data/project-list'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import config from '@payload-config'

interface Props {
  locale: Locale
  pagination?: {}
  params?: API.Projects.SearchParams
}

export const getProjectsData = async ({
  locale,
  params = {},
}: Props): Promise<{
  meta: API.Meta
  data: API.Projects.Data
}> => {
  'use cache'

  cacheTag(tags.projects(), tags.projectsQueryLocale(params, locale))

  const payload = await getPayload({
    config,
  })

  const [pageProjects, services, projects, test] = await Promise.all([
    payload.findGlobal({
      slug: 'pageProjects',
      locale,
    }),
    listPublishedCollection({ slug: 'services', payload, locale }),
    getProjectListData({
      locale,
      params,
    }),
    payload.find({ collection: 'services', locale }),
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
