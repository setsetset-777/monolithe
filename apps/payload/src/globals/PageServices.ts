import type { GlobalConfig, Block, GlobalAfterChangeHook, Field } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

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
    admin: {
      description: {
        fr: 'Le lien pointe vers les projets en lien avec le service sélectionné. Laissez vide pour ne pas afficher le lien.',
        en: 'THe link point towards projects related to the chosen service. Leave empy to not display the link.',
      },
    },
  },
  {
    name: 'title',
    type: 'text',
    virtual: true,
    hidden: true,
    required: true,
  },
  {
    name: 'description',
    type: 'richText',
    editor: lexicalEditor(),
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    virtual: true,
    hidden: true,
    required: true,
  },
  {
    name: 'slug',
    type: 'text',
    virtual: true,
    hidden: true,
    required: true,
  },
  {
    name: 'projectsUrl',
    type: 'text',
    virtual: true,
    hidden: true,
    required: true,
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}

const MutliLevelBlock: Block = {
  slug: 'multiLevelBlock',
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
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor(),
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
}

export const PageServices: GlobalConfig = {
  slug: 'pageServices',
  label: {
    en: 'Services',
    fr: 'Services',
  },
  fields: [
    titleField(),
    ...urlFields({ source: 'title', slug: 'pageServices' }),
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
    afterRead: [
      async ({ doc, req }) => {
        if (!doc.sections) {
          return doc
        }
        const pageProject = await req.payload.findGlobal({
          slug: 'pageProjects',
          locale: req.locale,
        })
        for (let i = 0; i < doc.sections.length; i++) {
          const section = doc.sections[i]
          const { label, slugId } =
            typeof section.service === 'string'
              ? await req.payload.findByID({
                  collection: 'services',
                  id: section.service,
                })
              : section.service
          const projectsParams = new URLSearchParams({
            services: slugId,
          })

          doc.sections[i] = {
            ...section,
            title: label,
            url: `${doc.url}#${slugId}`,
            slug: slugId,
            projectsUrl: `${pageProject.url}?${projectsParams}`,
          }
        }

        return doc
      },
    ],
  },
}
