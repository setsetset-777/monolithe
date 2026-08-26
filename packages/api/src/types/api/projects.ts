import type { Hero, Media, PaginatedDocs } from '../shared'

export namespace Projects {
  export interface Service {
    label: string
    slug: string
    // url: string
  }

  export interface Project {
    image: Media
    title: string
    date?: string
    url: string
  }

  export interface Data {
    hero: Hero
    services: Service[]
    projects: List
  }

  export interface SearchParams {
    service?: string[]
    limit?: number
    page?: number
  }

  export type List = PaginatedDocs<Project>
}
