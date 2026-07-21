import { GlobalAfterChangeHook, GlobalConfig, type Block } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlSlugField } from '@/fields/urlSlugField'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

const TextWithTitleBlock: Block = {
  slug: 'textWithTitleBlock',
  labels: {
    singular: {
      en: 'Text with title block',
      fr: 'Section de texte avec titre',
    },
    plural: {
      en: 'Text with title blocks',
      fr: 'Sections de textes avec titre',
    },
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
      name: 'text',
      type: 'textarea',
      label: {
        en: 'Text',
        fr: 'Texte',
      },
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

const ListBlock: Block = {
  slug: 'listBlock',
  labels: {
    singular: {
      en: 'List block',
      fr: 'Block de liste',
    },
    plural: {
      en: 'List blocks',
      fr: 'Blocks de liste',
    },
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
      name: 'values',
      type: 'array',
      label: {
        en: 'Values list',
        fr: 'Liste de valeurs',
      },
      labels: {
        singular: { fr: 'Valeur' },
        plural: { fr: 'Valeurs' },
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
      ],
    },
  ],
}

const ParutionBlock: Block = {
  slug: 'parutionsBlock',
  labels: {
    singular: {
      en: 'Parution block',
      fr: 'Block de parution',
    },
    plural: {
      en: 'Parution blocks',
      fr: 'Blocks de parution',
    },
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
      name: 'parutionList',
      type: 'array',
      label: {
        en: 'Parution list',
        fr: 'Liste des parutions',
      },
      labels: {
        singular: {
          en: 'Parution item',
          fr: 'Élément de parution',
        },
        plural: {
          en: 'Parution items',
          fr: 'Éléments de parutions',
        },
      },
      fields: [
        {
          name: 'parution',
          type: 'relationship',
          relationTo: 'parutions',
        },
      ],
    },
  ],
}

const TestimonialsBlock: Block = {
  slug: 'testimonialsBlock',
  labels: {
    singular: {
      en: 'Testimonials block',
      fr: 'Block de témoignages',
    },
    plural: {
      en: 'Testimonials blocks',
      fr: 'Blocks de témoignages',
    },
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
      name: 'testimonialsList',
      type: 'array',
      label: {
        en: 'Terstimonial list',
        fr: 'Liste des témoignages',
      },
      labels: {
        singular: {
          en: 'Testimonial item',
          fr: 'Élément de témoignage',
        },
        plural: {
          en: 'Testimonial items',
          fr: 'Éléments de témoignage',
        },
      },
      fields: [
        {
          name: 'testimonial',
          type: 'relationship',
          relationTo: 'testimonials',
        },
      ],
    },
  ],
}

export const PagePresentation: GlobalConfig = {
  slug: 'pagePresentation',
  label: {
    en: 'Presentation',
    fr: 'Présentation',
  },
  fields: [
    titleField(),
    urlSlugField({ source: 'title', slug: 'pagePresentation' }),
    heroImageField(),
    {
      name: 'monolithePresentation',
      type: 'textarea',
      label: {
        en: 'Monolithe presentation',
        fr: 'Présentation de Monolithe',
      },
      admin: {
        rows: 5,
      },
    },
    {
      name: 'sections',
      label: {
        en: 'Sections',
        fr: 'Sections',
      },
      type: 'blocks',
      blocks: [TextWithTitleBlock, ListBlock, ParutionBlock, TestimonialsBlock],
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
