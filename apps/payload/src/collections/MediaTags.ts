import type { CollectionConfig } from 'payload'

export const MediaTags: CollectionConfig = {
  slug: 'mediaTags',
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
      unique: true,
      required: true,
    },
  ],
}
