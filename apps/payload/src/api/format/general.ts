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

  return {
    navigation: {
      home: {
        url: routes['pageHome' as PageSlug].path,
        linkLabel: "Retour à l'accueil",
      },
      menu: (general.navigation?.items ?? []).map(({ title, slug }) => ({
        title,
        url: routes[slug].path,
        slug: slug as PageSlug,
      })),
    },
    footer: {
      logoCatch: general.footer!.logoCatch!,
      contact: {
        text: general.footer!.contactText!,
        label: general.footer!.contactLabel!,
        url: general.footer!.contactUrl!,
      },
      services: {
        title: pageServices.title,
        items: (services.docs || []).map(({ title, id }) => ({
          title,
          url: routes[id].path,
        }))!,
        url: routes.pageServices?.path,
      },
    },
    routes,
  }
}
