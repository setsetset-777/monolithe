import type { TypedLocale } from 'payload'
import type {
  PagePresentation,
  PageProject,
  PageProjectsSelect,
  PageService,
  PageContact,
} from '@/types/payload'
import type { PageSlug } from '@/types'

export type Manifest = {
  generatedAt: number
  routes: Routes
}

export type RouteConfigPage = {
  slug: PageSlug
  path?: string
  field?: keyof RoutedPages
  children?: RouteConfigPage
}

export interface RouteConfig {
  pages: RouteConfigPage[]
}

export type RoutedPages =
  PagePresentation | PageProject | PageProjectsSelect | PageService | PageContact

export type Locale = TypedLocale

export type Route = {
  id: string
  path: string
  slug: PageSlug
  urlSlug: string
  parent?: PageSlug
  title: string
  type: 'global' | 'collection'
}

export type LocalizedRoutes = { [key: string]: Route }

export type Routes = Partial<Record<string, LocalizedRoutes>>
