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
      logoCatch: general.footer!.logoCatch as string,
      contact: {
        text: general.footer!.contactText as string,
        label: general.footer!.contactLabel as string,
        url: general.footer!.contactUrl as string,
      },
      services: {
        title: services.title as string,
        items: services.list?.map((service) => ({
          title: service.title as string,
          url: `${services.url}#${encodeURIComponent(service.title as string)}`,
        }))!,
        url: routes.pageServices.path,
      },
    },
    routes,
  }
}
