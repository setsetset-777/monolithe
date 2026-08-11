// TODO: Move data types and transformations to api package
// TODO: Use namespaces for pages (General, Presentation, etc.)

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
      slug: PageSlug
    }>
  >
}

export interface HeroData {
  title: string
  image: Media
  slug: PageSlug
}

export interface GeneralData {
  navigation: NavigationData
  footer: FooterData
  routes: LocalizedRoutes
}

export type PageData = PageHomeData | PagePresentationData | null

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

export interface PresentationTextWithTitleBlock {
  title: string
  text: string
  image?: Media
}

export interface PresentationListBlock {
  title: string
  values: Array<{
    title: string
  }>
}

export interface Parution {
  title: string
  publisher: string
  type: 'paper' | 'web' | 'video'
  date: string
  link: string | null | undefined
  thumbnail: Media | null
}

export interface PresentationParutionBlock {
  title: string
  list: Array<Parution>
}

export interface Testimonial {
  name: string
  description: string
  company: string
}

export interface PresentationTestimonialBlock {
  title: string
  list: Array<Testimonial>
}

export type PresentationSection =
  | PresentationTextWithTitleBlock
  | PresentationListBlock
  | PresentationParutionBlock
  | PresentationTestimonialBlock

export interface PagePresentationData {
  hero: HeroData
  presentation?: string
  sections: Array<PresentationSection>
}
