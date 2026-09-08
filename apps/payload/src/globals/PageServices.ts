import type { GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlFields } from '@/fields/urlFields'
import { heroImageField } from '@/fields/heroImageField'
import { linkToCollectionField } from '@/fields/linkToCollectionField'
import { revalidateTag } from 'next/cache'
import { tags } from '@/helpers/cache'

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
    linkToCollectionField({ slug: 'services' }),
  ],
  versions: {
    drafts: true,
  },
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidateTag(tags.routes(), 'max')
        revalidateTag(tags.services(), 'max')
      },
    ],
  },
}
