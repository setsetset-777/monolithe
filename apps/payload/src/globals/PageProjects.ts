import type { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { urlSlugField } from '@/fields/urlSlugField'
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
    urlSlugField({ source: 'title', slug: 'pageProjects' }),
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
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [invalidateRoutesManifestHook as GlobalAfterChangeHook],
  },
}
