import type { CollectionSlug, Field, LabelFunction, StaticLabel } from 'payload'
import { localizedLabels } from '@/i18n'

type LinkToCollectionFleld = {
  label?: LabelFunction | StaticLabel
  slug: CollectionSlug
  name?: string
}

const defaultLabel = {
  en: 'Title',
  fr: 'Titre',
}

export const linkToCollectionFleld = ({
  slug,
  label,
  name = 'collection',
}: LinkToCollectionFleld): Field => {
  return {
    name,
    type: 'group',
    label: label ?? localizedLabels.collections[slug]?.plural,
    fields: [
      {
        name: 'slug',
        type: 'text',
        // hidden: true,
        virtual: true,
        defaultValue: slug,
      },
      {
        name: 'linkToCollection',
        type: 'ui',
        admin: {
          components: {
            Field: '@/components/LinkToCollection',
          },
        },
      },
    ],
  }
}
