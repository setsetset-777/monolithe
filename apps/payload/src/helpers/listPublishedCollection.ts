import { Locale } from '@/types'
import type {
  BasePayload,
  CollectionSlug,
  DataFromCollectionSlug,
  PaginatedDocs,
  Where,
} from 'payload'

interface Props<T extends CollectionSlug> {
  slug: T
  payload: BasePayload
  locale: Locale
  where?: Where
}

export default function listPublishedCollection<T extends CollectionSlug>({
  slug,
  payload,
  locale,
  where,
}: Props<T>): Promise<PaginatedDocs<DataFromCollectionSlug<T>>> {
  return payload.find({
    collection: slug,
    draft: false,
    pagination: false,
    locale,
    where: {
      _status: {
        equals: 'published',
      },
      ...where,
    },
  })
}
