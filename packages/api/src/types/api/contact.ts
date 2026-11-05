import type { Hero } from '../shared'

export namespace Contact {
  export interface Info {
    logoCatch?: string
    name?: string
    place?: string
    email?: string
    phone?: string
  }

  export interface Form {
    email: string
    title: string
    introduction?: string
    successMessage: string
    actionLabel: string
    slug: string
  }

  export interface Post {
    success?: boolean
    errorMessage?: string
    errors?: Record<string, string[]>
  }

  export interface Data {
    hero: Hero
    info: Info
    form: Form
    post?: Post
  }
}
