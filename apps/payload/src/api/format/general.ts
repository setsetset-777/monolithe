import type * as API from '@monolithe/api/types'
import type { PageSlug, Locale } from '@/types'
import { BasePayload } from 'payload'
import { getRoutes } from '@/helpers/routes'
import listPublishedCollection from '@/helpers/listPublishedCollection'

type Props = {
  payload: BasePayload
  locale: Locale
}

export const formatGeneralData = async ({ payload, locale }: Props): Promise<API.General.Data> => {
  const [routes, general, pageServices, services] = await Promise.all([
    getRoutes(payload, locale),
    payload.findGlobal({ slug: 'general' }),
    payload.findGlobal({ slug: 'pageServices' }),
    listPublishedCollection({ slug: 'services', payload, locale }),
  ])

  const serviceItems = []

  for (const slug of general.navigation.navigationList) {
    const page = await payload.findGlobal({
      slug,
      locale: locale,
    })

    if (!page) continue

    serviceItems.push({
      title: page.title,
      url: routes[slug] && routes[slug].path,
      slug,
    })
  }

  return {
    navigation: {
      home: {
        url: routes['pageHome' as PageSlug].path,
        linkLabel: "Retour à l'accueil",
      },
      menu: serviceItems,
    },
    footer: {
      logoCatch: general.footer!.logoCatch!,
      contact: {
        text: general.footer!.contactText!,
        label: general.footer!.contactLabel!,
        url: routes.pageContact.path,
      },
      services: {
        title: pageServices.title,
        items: (services.docs || []).map(({ title, id }) => ({
          title,
          url: routes[id].path,
        }))!,
        url: routes.pageServices.path,
      },
    },
    routes,
  }
}
