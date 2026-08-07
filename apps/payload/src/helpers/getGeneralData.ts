import { GeneralData, Locale } from '@/types'
import { getRoutes, routesConfig } from './routes'
import { Payload } from 'payload'

export const getGeneralData = async (payload: Payload, locale: Locale): Promise<GeneralData> => {
  const [general, services, routes] = await Promise.all([
    payload.findGlobal({ slug: 'general' }),
    payload.findGlobal({ slug: 'pageServices' }),
    getRoutes(payload, locale as Locale),
  ])

  return {
    navigation: {
      home: {
        url: routesConfig.pages.find((item) => item.slug === 'pageHome')!.path!,
        linkLabel: "Retour à l'accueil",
      },
      menu: general.navigation?.items!,
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
        url: routes.pageServices.path,
      },
    },
    routes,
  }
}
