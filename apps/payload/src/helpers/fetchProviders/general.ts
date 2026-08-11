import { getRoutes, resolveRoute } from '../routes'
import type { PayloadRequest } from 'payload'
import type {
  Locale,
  GeneralResponse,
  PageResponse,
  RoutedCollectionSlug,
  RoutedGlobalSlug,
} from '@/types'

import { localization } from '@/i18n'

export const fetchGeneral = async (req: PayloadRequest): Promise<GeneralResponse> => {
  const locale = (req.locale as Locale) ?? localization.defaultLocale

  const [general, services, routes] = await Promise.all([
    req.payload.findGlobal({ slug: 'general' }),
    req.payload.findGlobal({ slug: 'pageServices' }),
    getRoutes(req.payload, locale),
  ])

  return {
    general,
    services,
    routes,
  }
}

export const fetchPage = async (req: PayloadRequest, path: string): Promise<PageResponse> => {
  const { locale, route, routes } = await resolveRoute(path, req)

  const pageData =
    route.type === 'collection'
      ? await req.payload.findByID({
          collection: route.slug as RoutedCollectionSlug,
          locale,
          id: route.id,
        })
      : await req.payload.findGlobal({
          slug: route.slug as RoutedGlobalSlug,
          locale,
        })

  return {
    slug: route.slug,
    data: pageData,
  }
}
