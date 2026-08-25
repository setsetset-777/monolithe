import type * as API from '@monolithe/api/types'
import type { PageProject, Locale } from '@/types'
import type { BasePayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { getRoutes } from '@/helpers/routes'

const PROJECTS_PAGINATION_LIMIT = 12

interface Props {
  payload: BasePayload
  locale: Locale
  res: PageProject
  pagination?: {}
  params?: {
    services?: string[]
    limit?: number
    page?: number
  }
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
  const page = params?.page ?? 1
  const limit = params?.limit ?? PROJECTS_PAGINATION_LIMIT
  const selectedServicesSlugs = params?.services || []

  const [routes, services, selectedServices] = await Promise.all([
    getRoutes(payload, locale),
    listPublishedCollection({ slug: 'services', payload, locale }),
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

  const selectedServicesIds = selectedServices.docs.map(({ id }) => id)

  console.log('selectedServicesIds', selectedServicesIds) // returns selectedServicesIds [ '6a89634d8a002b77a2cc7616', '6a8963108a002b77a2cc7571' ]

  const projects = await listPublishedCollection({
    slug: 'projects',
    payload,
    locale,
    pagination: {
      page,
      limit,
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
      projects: projects.docs.map(({ id, mainImage, title, date }) => ({
        image: mainImage as API.Media,
        title,
        date: date || undefined,
        url: routes[id].path,
      })),
    },
  }
}
