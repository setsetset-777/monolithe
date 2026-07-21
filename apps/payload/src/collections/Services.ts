import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label'],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: {
        en: 'Name',
        fr: 'Nom',
      },
    },
  ],
}
