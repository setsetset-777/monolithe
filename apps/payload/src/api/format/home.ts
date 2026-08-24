import { getRoutes } from '@/helpers/routes'
import type * as API from '@monolithe/api/types'
import type { Locale, PageHome } from '@/types'
import type { BasePayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'

interface Props {
  payload: BasePayload
  locale: Locale
  res: PageHome
}

export const formatHomeData = async ({
  res: { title, presentation, services: servicesSection, projects: projectsSection },
  locale,
  payload,
}: Props): Promise<{
  meta: API.Meta
  data: API.Home.Data
}> => {
  const [routes, services, highlights] = await Promise.all([
    getRoutes(payload, locale),
    listPublishedCollection({ slug: 'services', payload, locale }),
    listPublishedCollection({
      slug: 'projects',
      payload,
      locale,
      where: {
        featured: {
          exists: true,
        },
      },
    }),
  ])

  return {
    meta: {
      title,
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
