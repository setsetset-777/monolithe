import { localization } from '@/i18n'
import type {
  BasePayload,
  CollectionSlug,
  GlobalAfterChangeHook,
  CollectionAfterChangeHook,
  PayloadRequest,
} from 'payload'
import type {
  Manifest,
  RouteConfig,
  RoutedPages,
  Locale,
  Routes,
  LocalizedRoutes,
  Route,
  RoutedGlobalSlug,
  RoutedCollectionSlug,
} from '@/types'

const { locales, defaultLocale } = localization
const defaultSlugField = 'urlSlug' as const

export let cachedManifest: Manifest | null | undefined = null

export const routesConfig: RouteConfig = {
  pages: [
    {
      slug: 'pageHome',
    },
    {
      slug: 'pageProjects',
      children: {
        slug: 'projects',
      },
    },
    {
      slug: 'pagePresentation',
    },
    {
      slug: 'pageServices',
    },
    {
      slug: 'pageContact',
    },
  ],
}

export const getManifest = async (payload: BasePayload): Promise<Manifest> => {
  payload.logger.info('Generating routes manifest')
  if (!(typeof cachedManifest === 'undefined' || cachedManifest === null)) {
    payload.logger.info('Cache found, skipping manifest build')
    return cachedManifest as Manifest
  }

  payload.logger.info('No cache found, building manifest.')

  cachedManifest = {
    routes: await buildRoutes(payload),
    generatedAt: new Date().getTime(),
  }

  payload.logger.info(`Manifest built: ${JSON.stringify(cachedManifest)}`)

  return cachedManifest
}

export const invalidateRoutesManifest = () => {
  cachedManifest = null
}

export const invalidateRoutesManifestHook:
  CollectionAfterChangeHook | GlobalAfterChangeHook = () => {
  invalidateRoutesManifest()
}

export const getRoutes = async (payload: BasePayload, locale: Locale): Promise<LocalizedRoutes> => {
  locale = locale || (defaultLocale as Locale)
  const manifest = await getManifest(payload)
  const routes: LocalizedRoutes = manifest.routes[locale]!
  return routes
}

const buildRoutes = async (payload: BasePayload): Promise<Routes> => {
  const routes: Routes = {}

  for (const locale of locales) {
    routes[locale as Locale] = {}
    for (const { slug, path, field = defaultSlugField, children } of routesConfig.pages) {
      const global = await payload.findGlobal({
        slug: slug as RoutedGlobalSlug,
        locale: locale as Locale,
      })

      const doc: RoutedPages = global

      routes[locale as Locale]![slug] = {
        id: global.id,
        path: path || doc.url,
        slug: slug,
        urlSlug: doc[field] as string,
        type: 'global',
        meta: {
          title: doc.title,
        },
      }
      if (children) {
        const collections = await payload.find({
          collection: children.slug as RoutedCollectionSlug,
          locale: locale as Locale,
        })

        for (const collection of collections.docs) {
          const field = children.field || defaultSlugField
          const doc: RoutedPages = collection

          const urlSlug = doc[field] as string
          routes[locale as Locale]![collection.id] = {
            id: doc.id,
            path: doc.url,
            slug: children.slug,
            urlSlug,
            parent: slug,
            type: 'collection',
            meta: {
              title: doc.title,
            },
          }
        }
      }
    }
  }
  return routes
}

export const resolveRoute = async (
  path: string,
  req: PayloadRequest,
): Promise<{
  locale: Locale
  route: Route
  routes: LocalizedRoutes
}> => {
  const paths = path.replace(/^\/+/, '').split('/')
  let locale = localization.locales.includes(paths[0])
    ? (paths[0] as Locale)
    : (req.locale as Locale)

  if (locale) {
    // Remove locale
    path = path.replace(new RegExp(`^${locale}(?=\/|$)`), '')
  }

  const routes = await getRoutes(req.payload, locale)

  const route = Object.values(routes).find((value) => value?.path === path)

  if (!route) {
    throw new Error('No route found')
  }

  return {
    locale,
    routes,
    route,
  }
}
