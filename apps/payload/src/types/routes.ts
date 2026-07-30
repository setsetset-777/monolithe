import type { GlobalSlug, CollectionSlug, TypedLocale } from 'payload'
import type {
  PagePresentation,
  PageProject,
  PageProjectsSelect,
  PageService,
  PageContact,
} from '@/types/payload'

export type Manifest = {
  generatedAt: number
  routes: Routes
}

export type RouteConfigPage = {
  slug: GlobalSlug | CollectionSlug
  path?: string | null | undefined
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
  slug: GlobalSlug | CollectionSlug
  urlSlug: string
  parent?: GlobalSlug | CollectionSlug
  title: string
}

export type LocalizedRoutes = { [key: string]: Route }

export type Routes = Partial<Record<string, LocalizedRoutes>>
