import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { localizedLabels } from '@/i18n'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'
import type { CollectionConfig } from 'payload'

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
  labels: localizedLabels.collections.projects,
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
          name: 'image',
          type: 'upload',
          label: {
            en: 'Image',
            fr: 'Image',
          },
          relationTo: 'media',
          hasMany: false,
          required: true,
        },
        {
          name: 'fullwidth',
          type: 'checkbox',
          label: {
            en: 'Force image display to full width',
            fr: "Forcer l'image en pleine largeur",
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            en: 'Description',
            fr: 'Description',
          },
          admin: {
            condition: (data, siblingData) => siblingData.fullwidth === true,
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.project(doc.id), 'max')
        revalidateTag(tags.projects(), 'max')
        revalidateTag(tags.projectList(), 'max')
      },
    ],
  },
}
