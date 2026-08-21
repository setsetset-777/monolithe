import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { heroImageField } from '@/fields/heroImageField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

export const PageProjects: GlobalConfig = {
  slug: 'pageProjects',
  label: {
    en: 'Projects',
    fr: 'Réalisations',
  },
  fields: [
    titleField(),
    ...urlFields({ source: 'title', slug: 'pageProjects' }),
    heroImageField(),
    {
      name: 'backLinkLabel',
      type: 'text',
      label: {
        en: 'Back link label',
        fr: 'Énoncé du lien de retour',
      },
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
    },
    {
      name: 'services',
      type: 'array',
      virtual: true,
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'slug',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [invalidateRoutesManifestHook as GlobalAfterChangeHook],
    afterRead: [
      async ({ doc, req }) => {
        const services = await req.payload.find({
          collection: 'services',
          locale: req.locale,
        })
        doc.services = services.docs.map(({ label, slugId }) => {
          return {
            label,
            url: `${doc.url}?${new URLSearchParams({ services: slugId! })}`,
            slug: slugId,
          }
        })
      },
    ],
  },
}
