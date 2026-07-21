import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { urlSlugField } from '@/fields/urlSlugField'
import { titleField } from '@/fields/titleField'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

export const PageContact: GlobalConfig = {
  slug: 'pageContact',
  label: {
    en: 'Contact',
    fr: 'Contact',
  },
  fields: [
    titleField(),
    urlSlugField({ source: 'title', slug: 'pageContact' }),
    heroImageField(),
    {
      name: 'place',
      type: 'text',
      label: {
        en: 'Place',
        fr: 'Lieu',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: {
        en: 'Email',
        fr: 'E-mail',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: {
        en: 'Phone',
        fr: 'Téléphone',
      },
    },
    {
      name: 'form',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            en: 'Title',
            fr: 'Titre',
          },
        },
        {
          name: 'introduction',
          type: 'textarea',
          label: {
            en: 'Introduction',
            fr: 'Introduction',
          },
        },
        {
          name: 'actionLabel',
          type: 'text',
          label: {
            en: 'Label for form submit button',
            fr: "Intitulé pour bouton d'envoi",
          },
        },
      ],
    },
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [invalidateRoutesManifestHook as GlobalAfterChangeHook],
  },
}
