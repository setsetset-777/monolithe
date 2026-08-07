import type { CollectionConfig } from 'payload'

const encodeSlug = (slug: string) => {
  return slug
    .replaceAll(' ', '-')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

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
    {
      name: 'slugId',
      type: 'text',
      virtual: true,
      hidden: true,
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc }) => {
        doc.slugId = encodeSlug(doc.label)
        return doc
      },
    ],
  },
}
