import { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'
import { urlFields } from '@/fields/urlFields'

export const PageHome: GlobalConfig = {
  slug: 'pageHome',
  label: {
    en: 'Home',
    fr: 'Accueil',
  },
  fields: [
    titleField(),
    ...urlFields({
      value: '',
    }),
    {
      name: 'presentation',
      type: 'group',
      label: {
        en: 'Presentation',
        fr: 'Présentation',
      },
      required: true,
      fields: [
        {
          name: 'catch',
          type: 'textarea',
          label: {
            en: 'Catch phrase',
            fr: 'Accroche',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'services',
      type: 'group',
      label: {
        en: 'Services',
        fr: 'Services',
      },
      required: true,
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
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
        },
      ],
    },
    {
      name: 'projects',
      type: 'group',
      label: {
        en: 'Projects',
        fr: 'Réalisations',
      },
      required: true,
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
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
        },
        {
          name: 'projectLinkLabel',
          type: 'text',
          label: {
            en: 'Project link label',
            fr: 'Libellé du lien vers le projet',
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
