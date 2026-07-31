import { LocalizedRoutes } from '@/types'
import { resolveRoute } from './routes'
import { CollectionSlug, GlobalSlug, PayloadRequest } from 'payload'

export const getPageData = async (
  path: string,
  req: PayloadRequest,
): Promise<{
  slug: string
  data: any
  general: any
  routes: LocalizedRoutes
}> => {
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

  const [data, general, services] = await Promise.all([
    dataPromise,
    req.payload.findGlobal({ slug: 'general' }),
    req.payload.findGlobal({ slug: 'pageServices' }),
  ])

  return {
    slug: route.slug,
    data,
    general: {
      ...general,
      services: services.list,
    },
    routes,
  }
}
