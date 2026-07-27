import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      hasMany: true,
      relationTo: 'mediaTags',
    },
  ],
  upload: {
    adminThumbnail: 'big',
    imageSizes: [
      {
        name: '3000',
        width: 3000,
        formatOptions: {
          format: 'avif',
        },
        withoutEnlargement: true,
      },
      {
        name: '2000',
        width: 2000,
        formatOptions: {
          format: 'avif',
        },
        withoutEnlargement: true,
      },
      {
        name: '1000',
        width: 1000,
        formatOptions: {
          format: 'avif',
        },
        withoutEnlargement: true,
      },
      {
        name: '500',
        width: 500,
        formatOptions: {
          format: 'avif',
        },
        withoutEnlargement: true,
      },
      {
        name: '200',
        width: 200,
        formatOptions: {
          format: 'avif',
        },
        withoutEnlargement: true,
      },
    ],
  },
}
