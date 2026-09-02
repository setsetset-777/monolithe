import { tags } from '@/helpers/cache'
import { revalidateTag } from 'next/cache'
import type { CollectionConfig, Block, Field } from 'payload'

const encodeSlug = (slug: string) => {
  if (!slug) return
  return slug
    .replaceAll(' ', '-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export const Services: CollectionConfig = {
  slug: 'services',
  orderable: true,
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: {
        en: 'Name',
        fr: 'Nom',
      },
    },
    {
      name: 'urlSlug',
      type: 'text',
      required: true,
      index: true,
      hidden: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: {
        fr: 'Intitulé du lien',
      },
      admin: {
        description: {
          fr: 'Le lien pointe vers les projets en lien avec le service sélectionné. Laissez vide pour ne pas afficher le lien.',
          en: 'THe link point towards projects related to the chosen service. Leave empy to not display the link.',
        },
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'singleLevel',
      required: true,
      options: [
        {
          value: 'singleLevel',
          label: {
            en: 'Single level block',
            fr: 'Bloc à un niveau',
          },
        },
        {
          value: 'multiLevel',
          label: {
            en: 'Multi level block',
            fr: 'Bloc à plusieurs niveaux',
          },
        },
      ],
    },
    {
      name: 'singleLevelBlock',
      type: 'group',
      label: {
        en: 'Single level block',
        fr: 'Bloc à un niveau',
      },
      admin: {
        condition: (data, siblingData) => siblingData.type === 'singleLevel',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'multiLevelBlock',
      type: 'group',
      label: {
        en: 'Multi level block',
        fr: 'Bloc à plusieurs niveaux',
      },
      admin: {
        condition: (data, siblingData) => siblingData.type === 'multiLevel',
      },
      fields: [
        {
          name: 'subsections',
          type: 'array',
          label: {
            en: 'Subsections',
            fr: 'Sous-sections',
          },
          labels: {
            singular: {
              en: 'Subsection',
              fr: 'Sous-section',
            },
            plural: {
              en: 'Subsections',
              fr: 'Sous-sections',
            },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: {
                fr: 'Titre',
              },
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.urlSlug = encodeSlug(data.title)
        return data
      },
    ],
    afterChange: [
      async () => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.services(), 'max')
        revalidateTag(tags.general(), 'max')
        revalidateTag(tags.home(), 'max')
        revalidateTag(tags.projectList(), 'max')
        revalidateTag(tags.projects(), 'max')
      },
    ],
  },
}
