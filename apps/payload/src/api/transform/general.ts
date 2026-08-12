import type * as API from '@monolithe/api/types'
import type { General, PageService, LocalizedRoutes, PageSlug } from '@/types'

type Params = {
  general: General
  services: PageService
  routes: LocalizedRoutes
}

export const transformGeneralData = ({ general, services, routes }: Params): API.General.Data => {
  return {
    navigation: {
      home: {
        url: routes['pageHome' as PageSlug].path,
        linkLabel: "Retour à l'accueil",
      },
      menu: (general.navigation?.items ?? []).map(({ title, url, slug }) => ({
        title,
        url,
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
