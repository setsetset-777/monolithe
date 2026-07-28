import type { GlobalConfig, Block, GlobalAfterChangeHook, Field } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlSlugField } from '@/fields/urlSlugField'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

const commonBlockFields: Field[] = [
  {
    name: 'service',
    type: 'relationship',
    relationTo: 'services',
    required: true,
  },
  {
    name: 'linkLabel',
    type: 'text',
    label: {
      fr: 'Intitulé du lien',
    },
  },
]

const SingleLevelBlock: Block = {
  slug: 'singleLevelBlock',
  labels: {
    singular: {
      en: 'Single level block',
      fr: 'Bloc à un niveau',
    },
    plural: {
      en: 'Single level blocks',
      fr: 'Blocs à un niveau',
    },
  },
  fields: [
    ...commonBlockFields,
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 5,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

const MutliLevelBlock: Block = {
  slug: 'oneLevelBblock',
  labels: {
    singular: {
      en: 'Multi level block',
      fr: 'Bloc à plusieurs niveaux',
    },
    plural: {
      en: 'Multi level blocks',
      fr: 'Blocs à plusieurs niveau',
    },
  },
  fields: [
    ...commonBlockFields,
    {
      name: 'subsections',
      type: 'array',
      labels: {
        singular: {
          en: 'Subsection',
          fr: 'Sous-section',
        },
        plural: {
          en: 'Subsection',
          fr: 'Sous-section',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            fr: 'Titre',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}

export const PageServices: GlobalConfig = {
  slug: 'pageServices',
  label: {
    en: 'Services',
    fr: 'Services',
  },
  fields: [
    titleField(),
    urlSlugField({ source: 'title', slug: 'pageServices' }),
    heroImageField(),
    {
      name: 'sections',
      type: 'blocks',
      blocks: [SingleLevelBlock, MutliLevelBlock],
    },
    {
      name: 'list',
      type: 'array',
      virtual: true,
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            return await Promise.all(
              siblingData.sections.map(async ({ service }: any) => {
                const { label } = await req.payload.findByID({
                  collection: 'services',
                  id: service,
                })
                return { title: label }
              }),
            )
          },
        ],
      },
    },
  ],
  versions: {
    drafts: true,
  },
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [invalidateRoutesManifestHook as GlobalAfterChangeHook],
  },
}
