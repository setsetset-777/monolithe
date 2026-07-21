import type { GlobalSlug, CollectionSlug } from 'payload'
import type { Routes } from '@packages/types'

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
