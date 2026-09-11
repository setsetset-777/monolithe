import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { getProjectListData } from '@/api/data/project-list'
import { cached, tags } from '@/helpers/cache'
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
  return cached<{
    meta: API.Meta
    data: API.Projects.Data
  }>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const [pageProjects, services, projects, test] = await Promise.all([
        payload.findGlobal({
          slug: 'pageProjects',
          locale,
          draft: false,
        }),
        listPublishedCollection({ slug: 'services', payload, locale }),
        getProjectListData({
          locale,
          params,
        }),
        payload.find({ collection: 'services', locale, draft: false }),
      ])

      const { title, heroImage, meta } = pageProjects

      return {
        meta: {
          title: meta?.title ?? undefined,
          description: meta?.description ?? undefined,
          image: (meta?.image as API.Media) ?? undefined,
        },
        data: {
          hero: {
            title,
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
    },
    tags.projects(params, locale),
  )
}
