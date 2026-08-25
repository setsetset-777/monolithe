import { BasePayload, PayloadRequest } from 'payload'
import type * as API from '@monolithe/api/types'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { Locale } from '@/types'
import { getRoutes } from '@/helpers/routes'

const PROJECTS_PAGINATION_LIMIT = 12

export const fetchProjects = async ({
  payload,
  locale,
  params,
}: {
  payload: BasePayload
  locale: Locale
  params: API.Projects.SearchParams
}): Promise<API.Projects.List> => {
  const { services: selectedServicesSlugs, page, limit } = params

  const [routes, services] = await Promise.all([
    getRoutes(payload, locale),
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
      limit: limit ?? PROJECTS_PAGINATION_LIMIT,
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
    docs: projects.docs.map(({ id, mainImage, title, date }) => ({
      image: mainImage as API.Media,
      title,
      date: date || undefined,
      url: routes[id].path,
    })),
  }
}
