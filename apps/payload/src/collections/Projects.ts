import { titleField } from '@/fields/titleField'
import { urlSlugField } from '@/fields/urlSlugField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'
import type { CollectionAfterChangeHook } from 'payload'
import type { CollectionConfig, Block } from 'payload'

export const slug = 'projects'

export const Projects: CollectionConfig = {
  slug,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  labels: {
    singular: {
      fr: 'Réalisation',
    },
    plural: {
      fr: 'Réalisations',
    },
  },
  fields: [
    titleField(),
    urlSlugField({ source: 'title', slug }),
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Description',
        fr: 'Description',
      },
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      label: {
        en: 'Service',
        fr: 'Service',
      },
    },
    {
      name: 'date',
      type: 'number',
      label: {
        en: 'Year',
        fr: 'Année',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      label: {
        en: 'Main image',
        fr: 'Image principale',
      },
      relationTo: 'media',
      admin: {
        description: {
          en: 'The image used to represent the project, eg. on the project list or the project hero.',
          fr: "L'image utilisée pour représenter le projet, par exemple sur la liste de projets ou l'entête de la page du projet.",
        },
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: {
        en: 'Gallery',
        fr: 'Gallerie',
      },
      labels: {
        plural: {
          en: 'Images rows',
          fr: "Lignes d'images",
        },
        singular: {
          en: 'Images row',
          fr: "Ligne d'images",
        },
      },
      fields: [
        {
          name: 'gallery-row',
          type: 'array',
          label: {
            en: 'Images',
            fr: 'Images',
          },
          labels: {
            singular: { fr: 'Image', en: 'Image' },
            plural: { fr: 'Image', en: 'Image' },
          },
          maxRows: 3,
          admin: {
            description: {
              en: 'Images on this row will display next to each others on screens wide enough',
              fr: "Les images définies sur cette ligne seront affichées l'une à côté de l'autre sur les écrans assez larges pour le permettre.",
            },
          },
          fields: [
            {
              name: 'images',
              type: 'upload',
              label: {
                en: 'Image',
                fr: 'Image',
              },
              relationTo: 'media',
            },
            {
              name: 'description',
              type: 'textarea',
              label: {
                en: 'Description',
                fr: 'Description',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [invalidateRoutesManifestHook as CollectionAfterChangeHook],
  },
}
