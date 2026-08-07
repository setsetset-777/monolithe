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
}

export interface ServicesListData {
  title: string
  items: Array<{
    title: string
    url: string
  }>
  url: string
}

export interface FooterData {
  logoCatch: string
  contact: {
    url: string
    label: string
    text: string
  }
  services: ServicesListData
}

export interface NavigationData {
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

export interface GeneralData {
  navigation: NavigationData
  footer: FooterData
  routes: LocalizedRoutes
}

export type PageData = PageHomeData

export interface PageHomeData {
  presentation: {
    heroImage: Media
    catch: string
    url: string
    linkLabel: string
  }
  services: ServicesListData & {
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
