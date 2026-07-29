import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  labels: {
    singular: {
      fr: 'Utilisateur',
    },
    plural: {
      fr: 'Utilisateurs',
    },
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'user',
      access: {
        read: () => true,
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
