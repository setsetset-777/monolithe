import type { Payload } from './payload'

export type PageSlug = Payload.PageSlug

export type Media = Payload.Media

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
  type: 'paper' | 'web' | 'video'
  date: string
  link: string | null | undefined
  thumbnail: Media | null
}

export interface Meta {
  title: string
}
