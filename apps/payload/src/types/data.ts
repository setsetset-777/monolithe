import type { Media } from '@/types/payload'
import { CollectionSlug, GlobalSlug } from 'payload'
import { LocalizedRoutes } from './routes'

export type PageSlug = Extract<
  GlobalSlug | CollectionSlug,
  'pageHome' | 'pagePresentation' | 'pageProjects' | 'projects' | 'pageContact'
>

export interface PageResponse {
  slug: PageSlug
  data: PageData
  general: GeneralData
  routes: LocalizedRoutes
}

export interface GeneralData {
  navigation: {
    home: {
      url: string
      linkLabel: string
    }
    menu: NonNullable<
      Array<{
        title: string
        url: string
        slug: string
      }>
    >
  }
  footer: {
    logoCatch: string
    contact: {
      url: string
      label: string
      text: string
    }
    services: {
      title: string
      items: Array<{
        title: string
        url: string
      }>
      url: string
    }
  }
}

export type PageData = PageHomeData

export interface PageHomeData {
  presentation: {
    heroImage: Media
    catch: string
    url: string
    linkLabel: string
  }
  services: {
    title: string
    url: string
    linkLabel: string
    items: Array<{
      title: string
      url: string
    }>
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
