import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { linkToCollectionField } from '@/fields/linkToCollectionField'
import { heroImageField } from '@/fields/heroImageField'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'

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
    linkToCollectionField({ slug: 'projects' }),
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.projects(), 'max')
      },
    ],
  },
}
