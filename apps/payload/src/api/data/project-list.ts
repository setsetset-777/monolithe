import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import apiConfig from '@monolithe/api/config'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { cached, tags } from '@/helpers/cache'
import config from '@payload-config'
import { getRoutes } from '@/helpers/routes'

interface Props {
  locale: Locale
  pagination?: {}
  params?: API.Projects.SearchParams
}

export const getProjectListData = async ({
  locale,
  params = {},
}: Props): Promise<API.Projects.List> => {
  return cached<API.Projects.List>(
    async () => {
      const payload = await getPayload({
        config,
      })

      const { service: selectedServicesSlugs, page, limit } = params

      const [routes, services] = await Promise.all([
        getRoutes(locale),
        payload.find({
          collection: 'services',
          locale,
          where: {
            urlSlug: {
              in: selectedServicesSlugs,
            },
          },
        }),
      ])

      const selectedServicesIds = services.docs.map(({ id }) => id)

      const projects = await listPublishedCollection({
        slug: 'projects',
        payload,
        locale,
        pagination: {
          page: page ?? 1,
          limit: limit ?? apiConfig.projectsLimit,
        },
        where:
          selectedServicesIds.length > 0
            ? {
                services: {
                  in: selectedServicesIds,
                },
              }
            : {},
      })

      return {
        ...projects,
        docs: projects.docs.map(({ id, mainImage, title, date }) => ({
          image: mainImage as API.Media,
          title,
          date: date || undefined,
          url: routes[id].path,
        })),
      }
    },
    tags.projectList(params, locale),
  )
}
