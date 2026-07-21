import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    plural: {
      en: 'Testimonials',
      fr: 'Témoignages',
    },
    singular: {
      en: 'Testimonial',
      fr: 'Témoignage',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        en: 'Name',
        fr: 'Nom',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Description',
        fr: 'Description',
      },
    },
    {
      name: 'company',
      type: 'text',
      label: {
        en: 'Company',
        fr: 'Compagnie',
      },
      admin: {
        description: {
          en: "Set to 'Private' for private clients.",
          fr: "Renseigner 'Particulier' pour les clients privés.",
        },
      },
    },
  ],
}
