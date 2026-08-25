import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { invalidateRoutesManifestHook } from '@/helpers/routes'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionAfterChangeHook } from 'payload'
import type { CollectionConfig, Block } from 'payload'

export const slug = 'projects'

export const Projects: CollectionConfig = {
  slug,
  versions: {
    drafts: true,
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mainImage', '_status', 'featured'],
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
    ...urlFields({ source: 'title', slug }),
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: {
        fr: 'Mis en avant',
        en: 'Featured',
      },
      admin: {
        description: {
          fr: "Cocher pour afficher le projet sur la page d'accueil",
          en: 'check to display project on home page',
        },
        components: {
          Cell: '@/components/CollectionListCheck',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: {
        en: 'Description',
        fr: 'Description',
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      label: {
        en: 'Service',
        fr: 'Service',
      },
      hasMany: true,
    },
    {
      name: 'date',
      type: 'text',
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
          en: 'Images',
          fr: 'Images',
        },
        singular: {
          en: 'Image',
          fr: 'Image',
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
        {
          name: 'fullwidth',
          type: 'checkbox',
          label: {
            en: 'Force image display to full width',
            fr: "Forcer l'image en pleine largeur",
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [invalidateRoutesManifestHook as CollectionAfterChangeHook],
  },
}
