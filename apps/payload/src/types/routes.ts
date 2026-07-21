import { TypedLocale, GlobalSlug, CollectionSlug } from 'payload'

export type Locale = TypedLocale

export type Route = {
  id: string
  path: string
  slug: GlobalSlug | CollectionSlug
  urlSlug: string
  parent?: GlobalSlug | CollectionSlug
  title: string
}

export type Routes = Partial<Record<Locale, { [key: string]: Route }>>

export type Manifest = {
  generatedAt: number
  routes: Routes
}

export type RouteConfigPage = {
  slug: GlobalSlug | CollectionSlug
  path?: string
  field?: string
  children?: RouteConfigPage
}

export interface RouteConfig {
  pages: RouteConfigPage[]
}
