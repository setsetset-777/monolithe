import { localization } from '@/i18n'
import type {
  BasePayload,
  GlobalSlug,
  CollectionSlug,
  GlobalAfterChangeHook,
  CollectionAfterChangeHook,
} from 'payload'
import type { Manifest, Route, Locale, Routes, RouteConfig } from '@/types'

const { locales, defaultLocale } = localization
const defaultSlugField = 'urlSlug'

export let cachedManifest: Manifest | null | undefined = null

export const routesConfig: RouteConfig = {
  pages: [
    {
      slug: 'pageHome',
      path: '/',
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

export const getRoutes = async (
  payload: BasePayload,
  locale: Locale,
): Promise<Routes | undefined> => {
  locale = locale || (defaultLocale as Locale)
  const manifest = await getManifest(payload)
  const routes = manifest.routes[locale]
  return routes
}

const buildRoutes = async (payload: BasePayload): Promise<Routes> => {
  const routes: Routes = {}

  for (const locale of locales) {
    routes[locale as Locale] = {}
    for (const { slug, path, field = defaultSlugField, children } of routesConfig.pages) {
      const global = await payload.findGlobal({
        slug: slug as GlobalSlug,
        locale: locale as Locale,
      })
      const doc = global as unknown as Record<string, unknown>
      const parentPath = path || `/${doc[field]}`

      routes[locale as Locale]![slug] = {
        id: global.id,
        path: parentPath,
        slug: slug,
        urlSlug: doc[field] as string,
        title: doc.title as string,
      }
      if (children) {
        const collections = await payload.find({
          collection: children.slug as CollectionSlug,
          locale: locale as Locale,
        })

        for (const collection of collections.docs) {
          const field = children.field || defaultSlugField
          // TODO: Review typing
          const doc = collection as unknown as Record<string, unknown>
          const urlSlug = doc[field] as string
          routes[locale as Locale]![collection.id] = {
            id: collection.id,
            path: `${parentPath}/${doc[field]}`,
            slug: children.slug,
            urlSlug,
            parent: slug,
            title: doc.title as string,
          }
        }
      }
    }
  }
  return routes
}
