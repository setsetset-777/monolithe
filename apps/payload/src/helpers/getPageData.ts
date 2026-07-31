import { localization } from '@/i18n'
import { Locale, LocalizedRoutes } from '@/types'
import { getRoutes } from './routes'
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
  const paths = path.split('/')
  let locale = (localization.locales.includes(paths[0]) && paths[0]) as Locale

  if (locale) {
    // Remove locale
    path = path.replace(new RegExp(`^${locale}(?=\/|$)`), '')
  }
  try {
    const routes = await getRoutes(req.payload, locale ?? req.locale)
    const route = Object.values(routes).find((value) => value?.path === path)
    if (!route) {
      throw 'No route found'
    }

    let data

    if (route.type === 'collection') {
      data = await req.payload.find({
        collection: route.slug as CollectionSlug,
        locale,
        where: {
          id: { equals: route.id },
        },
      })
    } else {
      data = await req.payload.findGlobal({
        slug: route.slug as GlobalSlug,
        locale,
      })
    }

    const general = await req.payload.findGlobal({ slug: 'general' })
    const services = (await req.payload.findGlobal({ slug: 'pageServices' })).list

    return {
      slug: route.slug,
      data,
      general: {
        ...general,
        services,
      },
      routes,
    }
  } catch (e) {
    throw e
  }
}
