import { PageResponse, PageData, PageHome, Media, Route } from '@/types'
import { resolveRoute, routesConfig } from './routes'
import { CollectionSlug, DataFromGlobalSlug, GlobalSlug, PayloadRequest } from 'payload'

export const getPageData = async (path: string, req: PayloadRequest): Promise<PageResponse> => {
  const { locale, route, routes } = await resolveRoute(path, req)

  const dataPromise =
    route.type === 'collection'
      ? req.payload.findByID({
          collection: route.slug as CollectionSlug,
          locale,
          id: route.id,
        })
      : await req.payload.findGlobal({
          slug: route.slug as GlobalSlug,
          locale,
        })

  const [pageData, general, services] = await Promise.all([
    dataPromise,
    req.payload.findGlobal({ slug: 'general' }),
    req.payload.findGlobal({ slug: 'pageServices' }),
  ])

  return {
    slug: route.slug,
    data: formatPageData(pageData, route),
  }
}

function formatPageData<T extends GlobalSlug>(
  pageData: DataFromGlobalSlug<T>,
  route: Route,
): PageData {
  switch (route.slug) {
    default:
      const { presentation, services, projects } = pageData as PageHome

      return {
        presentation: {
          heroImage: presentation?.heroImage as Media,
          catch: presentation?.catch!,
          url: presentation?.link!,
          linkLabel: presentation?.linkLabel!,
        },
        services: {
          title: services?.title!,
          url: services?.link!,
          linkLabel: services?.linkLabel!,
          items: services?.items?.map((item) => ({
            title: item.title!,
            url: item.url!,
          }))!,
        },
        projects: {
          highlights: projects?.highlights?.map((item) => ({
            title: item.title!,
            url: item.link!,
            image: item.image as Media,
          }))!,
          linkLabel: projects?.linkLabel!,
          url: projects?.link!,
        },
      }
  }
}
