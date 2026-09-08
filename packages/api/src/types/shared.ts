import type { Payload } from './payload'

// TODO Check Paylaod dependency
export type PageSlug = Payload.PageSlug
export type Media = Payload.Media | null
export type LocalizedRoutes = Payload.LocalizedRoutes

export interface ServicesList {
  title: string
  items: Array<{
    title: string
    url: string
  }>
  url: string
}

export interface Testimonial {
  name: string
  description: string
  company: string
}

export interface Hero {
  title: string
  image: Media
  slug: PageSlug
}

export interface Parution {
  title: string
  publisher: string
  // type: 'paper' | 'web' | 'video'
  date: string
  link: string | null | undefined
  thumbnail: Media | null
}

export interface Meta {
  title?: string
  description?: string
  image?: Media
}

// Base on Payloads pagination response
// https://payloadcms.com/docs/queries/pagination#response
export interface PaginatedDocs<Item> extends Omit<Payload.PaginatedDocs, 'docs'> {
  docs: Item[]
}
