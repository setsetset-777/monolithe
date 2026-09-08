import type { ServicesList, PageSlug, LocalizedRoutes } from '../shared'

export namespace General {
  export interface Footer {
    logoCatch: string
    contact: {
      url: string
      label: string
      text: string
    }
    services: ServicesList
  }

  export interface Navigation {
    home: {
      url: string
      linkLabel: string
    }
    menu: NonNullable<
      Array<{
        title: string
        url: string
        slug: PageSlug
      }>
    >
  }

  export interface Data {
    navigation: Navigation
    footer: Footer
    routes: LocalizedRoutes
  }
}
