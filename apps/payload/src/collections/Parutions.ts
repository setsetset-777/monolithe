import type { CollectionConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { tags } from '@/helpers/cache'
import { revalidateTag } from 'next/cache'

export const Parutions: CollectionConfig = {
  slug: 'parutions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publisher', 'date', 'type'],
  },
  versions: {
    drafts: true,
  },
  orderable: true,
  labels: localizedLabels.collections.parutions,
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
    // {
    //   name: 'type',
    //   type: 'select',
    //   required: true,
    //   options: [
    //     {
    //       value: 'paper',
    //       label: {
    //         en: 'Newspaper',
    //         fr: 'Journal',
    //       },
    //     },
    //     {
    //       value: 'web',
    //       label: {
    //         en: 'Website',
    //         fr: 'Site web',
    //       },
    //     },
    //     {
    //       value: 'video',
    //       label: {
    //         en: 'Video',
    //         fr: 'Vidéo',
    //       },
    //     },
    //   ],
    // },
    {
      name: 'date',
      type: 'text',
    },
    {
      name: 'link',
      type: 'text',
      label: {
        en: 'Link',
        fr: 'Lien',
      },
      admin: {
        description: {
          en: 'If not set, parution link will redirect to the raw thumbnail.',
          fr: "Si vide, le lien de la parution redirigera vers l'image d'aperçu.",
        },
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        revalidateTag(tags.presentation(), 'max')
      },
    ],
  },
}
