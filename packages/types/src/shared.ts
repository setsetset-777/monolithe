import type { CollectionSlug, GlobalSlug, TypedLocale } from 'payload'

export type Locale = TypedLocale

export type Route = {
  id: string
  path: string
  slug: GlobalSlug | CollectionSlug
  urlSlug: string
  parent?: GlobalSlug | CollectionSlug
  title: string
}

export type Routes = Partial<Record<string, { [key: string]: Route }>>
