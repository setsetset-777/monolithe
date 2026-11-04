import type { Hero } from '../shared'

export namespace Contact {
  export interface Info {
    logoCatch?: string
    name?: string
    place?: string
    email?: string
    phone?: string
  }

  export interface Data {
    hero: Hero
    info: Info
  }
}
