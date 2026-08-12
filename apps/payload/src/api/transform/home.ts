import type * as API from '@monolithe/api/types'
import type { PageHome } from '@/types'

export const transformHomeData = ({
  presentation,
  services,
  projects,
}: PageHome): API.Home.Data => {
  return {
    presentation: {
      heroImage: presentation?.heroImage as API.Media,
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
        image: item.image as API.Media,
      }))!,
      linkLabel: projects?.linkLabel!,
      url: projects?.link!,
    },
  }
}
