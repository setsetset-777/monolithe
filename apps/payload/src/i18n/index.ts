import type { LocalizationConfigWithNoLabels } from 'payload'
import type { TFunction } from '@payloadcms/translations'
import { enTranslations } from '@payloadcms/translations/languages/en'
import { frTranslations } from '@payloadcms/translations/languages/fr'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const localization: LocalizationConfigWithNoLabels = {
  locales: ['fr'],
  defaultLocale: 'fr',
}

export const localizedLabels = {
  groups: {
    pages: {
      fr: 'Pages',
      en: 'Pages',
    },
  },
}

export const customTranslations = {
  en: {
    validation: {
      uniqueUrlSlug: 'The URL segment already exists.',
    },
    pageHome: {
      adminProjectLinkLabel: 'Go to projects',
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
  },
}

export type CustomTranslationsObject = typeof customTranslations.en &
  typeof frTranslations &
  typeof enTranslations

export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>

export type CustomTFunction = TFunction<CustomTranslationsKeys>
