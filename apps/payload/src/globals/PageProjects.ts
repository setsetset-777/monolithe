import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { linkToCollectionField } from '@/fields/linkToCollectionField'
import { heroImageField } from '@/fields/heroImageField'
import { invalidate, invalidatePrefix, tags } from '@/helpers/cache'
import { Locale } from '@/types'

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
      required: true,
    },
    linkToCollectionField({ slug: 'projects' }),
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async ({ req }) => {
        invalidate(tags.routes(req.locale as Locale))
        invalidatePrefix('projects')
        invalidatePrefix('project')
      },
    ],
  },
}
