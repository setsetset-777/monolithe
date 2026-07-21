import { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

export const PageHome: GlobalConfig = {
  slug: 'pageHome',
  label: {
    en: 'Home',
    fr: 'Accueil',
  },
  fields: [
    {
      name: 'presentation',
      type: 'group',
      label: {
        en: 'Presentation',
        fr: 'Présentation',
      },
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
            fr: 'Libellé du lien',
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
          name: 'pageLinkLabel',
          type: 'text',
          label: {
            en: 'Page link label',
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
          name: 'pageLlinkLabel',
          type: 'text',
          label: {
            en: 'Page link label',
            fr: 'Libellé du lien vers la page',
          },
        },
        {
          name: 'highlightedProjects',
          type: 'array',
          label: {
            fr: 'Projets mis en avant',
          },
          labels: {
            singular: { fr: 'Projet' },
            plural: { fr: 'Projets' },
          },
          fields: [
            {
              name: 'project',
              type: 'relationship',
              relationTo: 'projects',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: {
                  en: 'By default the displayed image will be the main one from the project. It is possible to upload an alternative one.',
                  fr: "Par défaut, l'image affichée est l'image principale du projet. Il est possible de sélectionner une image alternative.",
                },
              },
            },
          ],
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
