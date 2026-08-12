import type { ServicesList, Media } from '../shared'

export namespace Home {
  export interface Data {
    presentation: {
      heroImage: Media
      catch: string
      url: string
      linkLabel: string
    }
    services: ServicesList & {
      linkLabel: string
    }
    projects: {
      highlights: Array<{
        title: string
        image: Media
        url: string
      }>
      linkLabel: string
      url: string
    }
  }
}
