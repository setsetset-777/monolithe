import type { Home } from '../types'
import type { Payload } from '../types/payload'

export const transformHomeData = ({
  presentation,
  services,
  projects,
}: Payload.PageHome): Home.Data => {
  return {
    presentation: {
      heroImage: presentation?.heroImage as Payload.Media,
      catch: presentation?.catch!,
      url: presentation?.link!,
      linkLabel: presentation?.linkLabel!,
    },
    services: {
      title: services?.title!,
      url: services?.link!,
      linkLabel: services?.linkLabel!,
      items: services?.items?.map((item) => ({
        title: item.title!,
        url: item.url!,
      }))!,
    },
    projects: {
      highlights: projects?.highlights?.map((item) => ({
        title: item.title!,
        url: item.link!,
        image: item.image as Payload.Media,
      }))!,
      linkLabel: projects?.linkLabel!,
      url: projects?.link!,
    },
  }
}
