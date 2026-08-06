import { url } from 'node:inspector/promises'
import { GlobalConfig } from 'payload'

export const General: GlobalConfig = {
  slug: 'general',
  label: {
    en: 'General',
    fr: 'Général',
  },
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        {
          name: 'navigationList',
          type: 'select',
          label: {
            en: 'Navigation elements',
            fr: 'Éléments de navigation',
          },
          required: true,
          options: [
            {
              label: 'Présentation',
              value: 'pagePresentation',
            },
            {
              label: 'Services',
              value: 'pageServices',
            },
            {
              label: 'Réalisations',
              value: 'pageProjects',
            },
            {
              label: 'Contact',
              value: 'pageContact',
            },
          ],
          hasMany: true,
        },
        {
          name: 'items',
          type: 'array',
          virtual: true,
          hidden: true,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: {
        en: 'Footer',
        fr: 'Bas de page',
      },
      fields: [
        {
          name: 'logoCatch',
          type: 'textarea',
          label: {
            en: 'Logo catch',
            fr: 'Texte sous logo',
          },
        },
        {
          name: 'contactText',
          type: 'textarea',
          label: {
            en: 'Contact text',
            fr: 'Texte pour contact',
          },
        },
        {
          name: 'contactLabel',
          type: 'text',
          required: true,
          label: {
            en: 'Contact button label',
            fr: 'Label pour bouton de contact',
          },
        },
        {
          name: 'contactUrl',
          type: 'text',
          virtual: true,
          hidden: true,
        },
      ],
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        const contact = await req.payload.findGlobal({
          slug: 'pageContact',
          locale: req.locale,
        })

        doc.footer.contactUrl = contact.url

        const items = []

        for (const slug of doc.navigation.navigationList) {
          const page = await req.payload.findGlobal({
            slug,
            locale: req.locale,
          })

          if (!page) continue

          items.push({
            title: page.title,
            url: page.url,
            slug,
          })
        }

        doc.navigation.items = items

        return doc
      },
    ],
  },
}
