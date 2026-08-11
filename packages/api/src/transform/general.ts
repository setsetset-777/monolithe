import type { General } from '../types'
import type { Payload } from '../types/payload'

type Params = {
  general: Payload.General
  services: Payload.PageService
  routes: Payload.LocalizedRoutes
}

export const transformGeneralData = async ({
  general,
  services,
  routes,
}: Params): Promise<General.Data> => {
  return {
    navigation: {
      home: {
        url: routes['pageHome' as Payload.PageSlug].path,
        linkLabel: "Retour à l'accueil",
      },
      menu: (general.navigation?.items ?? []).map(({ title, url, slug }) => ({
        title,
        url,
        slug: slug as Payload.PageSlug,
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
        title: services.title!,
        items: services.list?.map((service) => ({
          title: service.title!,
          url: service.url!,
        }))!,
        url: routes.pageServices?.path,
      },
    },
    routes,
  }
}
