import type { CollectionConfig } from 'payload'

export const Parutions: CollectionConfig = {
  slug: 'parutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publisher', 'date', 'type'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Title',
        fr: 'Titre',
      },
      required: true,
    },
    {
      name: 'publisher',
      type: 'text',
      label: {
        en: 'Publisher',
        fr: 'Éditeur',
      },
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          value: 'paper',
          label: {
            en: 'Newspaper',
            fr: 'Journal',
          },
        },
        {
          value: 'web',
          label: {
            en: 'Website',
            fr: 'Site web',
          },
        },
        {
          value: 'video',
          label: {
            en: 'Video',
            fr: 'Vidéo',
          },
        },
      ],
    },
    {
      name: 'date',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMMM yyyy',
        },
      },
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      label: {
        en: 'Link',
        fr: 'Lien',
      },
      admin: {
        condition: (_, siblingData) => ['web', 'video'].includes(siblingData?.type),
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
