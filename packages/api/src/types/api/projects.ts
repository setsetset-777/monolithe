import type { Hero, Media } from '../shared'

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
    projects: Project[]
  }
}
