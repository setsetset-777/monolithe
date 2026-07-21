import type { GlobalConfig, Block, GlobalAfterChangeHook } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlSlugField } from '@/fields/urlSlugField'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

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
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 5,
      },
    },
    {
      name: 'link-label',
      type: 'text',
      label: {
        fr: 'Intitulé du lien',
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
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        rows: 5,
      },
    },
    {
      name: 'linkLabel',
      type: 'text',
      label: {
        fr: 'Intitulé du lien',
      },
    },
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
