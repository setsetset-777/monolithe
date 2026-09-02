import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import apiConfig from '@monolithe/api/config'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'
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
  'use cache'

  cacheTag(tags.projectList(), tags.projectListQueryLocale(params, locale))

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
    where: {
      services:
        selectedServicesIds.length > 0
          ? {
              in: selectedServicesIds,
            }
          : [],
    },
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
}
