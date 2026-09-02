import type { LocalizationConfigWithNoLabels, Locale, Field, CollectionSlug } from 'payload'
import type { TFunction } from '@payloadcms/translations'
import { enTranslations } from '@payloadcms/translations/languages/en'
import { frTranslations } from '@payloadcms/translations/languages/fr'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const localization: LocalizationConfigWithNoLabels = {
  locales: ['fr'],
  defaultLocale: 'fr',
}

type LocalizedLabel = Record<Locale['code'], string>

type CollectionLabels = Partial<
  Record<
    CollectionSlug,
    {
      singular: LocalizedLabel
      plural: LocalizedLabel
    }
  >
>

export const localizedLabels: {
  groups: Record<string, LocalizedLabel>
  fields: Record<string, LocalizedLabel>
  collections: Partial<
    Record<
      CollectionSlug,
      {
        singular: LocalizedLabel
        plural: LocalizedLabel
      }
    >
  >
} = {
  groups: {
    pages: {
      fr: 'Pages',
      en: 'Pages',
    },
  },
  fields: {
    project: {
      en: 'Project',
      fr: 'Réalisation',
    },
  },
  collections: {
    projects: {
      singular: {
        en: 'Project',
        fr: 'Réalisation',
      },
      plural: {
        en: 'Projects',
        fr: 'Réalisations',
      },
    },
    services: {
      singular: {
        en: 'Service',
        fr: 'Service',
      },
      plural: {
        en: 'Services',
        fr: 'Services',
      },
    },
  },
} as const

export const customTranslations: Record<Locale['code'], Record<string, any>> = {
  en: {
    validation: {
      uniqueUrlSlug: 'The URL segment already exists.',
    },
    pageHome: {
      adminProjectLinkLabel: 'Go to projects',
    },
    linkToCollection: {
      description:
        'Edit the visible {{items}} on the frontend directly from the collection page by editing their published status',
      label: 'Go to {{collection}}',
    },
  },
  fr: {
    general: {
      globals: 'Globales',
      createNew: 'Ajouter',
      createNewLabel: 'Ajouter',
    },
    validation: {
      uniqueUrlSlug: "Le segment d'URL existe déjà",
    },
    pageHome: {
      adminProjectLinkLabel: 'Aller aux réalisations',
    },
    linkToCollection: {
      description:
        'Éditez les {{items}} visibles sur le site directement à partir de leur page de collection en gérant leur statut de publication.',
      label: 'Aller aux {{collection}}',
    },
  },
}

export type CustomTranslationsObject = typeof customTranslations.en &
  typeof frTranslations &
  typeof enTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>

export type CustomTFunction = TFunction<CustomTranslationsKeys>
