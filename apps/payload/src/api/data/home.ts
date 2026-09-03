import { getRoutes } from '@/helpers/routes'
import type * as API from '@monolithe/api/types'
import type { Locale } from '@/types'
import { getPayload } from 'payload'
import config from '@payload-config'
import listPublishedCollection from '@/helpers/listPublishedCollection'
import { cacheTag } from 'next/cache'
import { tags } from '@/helpers/cache'

interface Props {
  locale: Locale
}

export const getHomeData = async ({
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Home.Data
}> => {
  'use cache'

  cacheTag(tags.home(), tags.homeLocale(locale))

  const payload = await getPayload({
    config,
  })

  const [pageHome, routes, services, highlights] = await Promise.all([
    payload.findGlobal({
      slug: 'pageHome',
      locale,
    }),
    getRoutes(locale),
    listPublishedCollection({ slug: 'services', payload, locale }),
    listPublishedCollection({
      slug: 'projects',
      payload,
      locale,
      where: {
        featured: {
          equals: 'true',
        },
      },
    }),
  ])

  const { presentation, services: servicesSection, projects: projectsSection, meta } = pageHome

  return {
    meta: {
      title: meta?.title ?? undefined,
      description: meta?.description ?? undefined,
      image: (meta?.image as API.Media) ?? undefined,
    },
    data: {
      presentation: {
        heroImage: presentation.heroImage as API.Media,
        catch: presentation.catch || '',
        url: routes['pagePresentation'].path,
        linkLabel: presentation.linkLabel || undefined,
      },
      services: {
        title: servicesSection.title!,
        url: routes['pageServices'].path,
        linkLabel: servicesSection?.linkLabel!,
        items: (services.docs || []).map((item) => ({
          title: item.title,
          url: routes[item.id].path,
        })),
      },
      projects: {
        highlights: highlights.docs.map((item) => ({
          title: item.title!,
          url: routes[item.id].path,
          image: item.mainImage as API.Media,
        }))!,
        linkLabel: projectsSection.linkLabel!,
        url: routes['pageProjects'].path,
      },
    },
  }
}
