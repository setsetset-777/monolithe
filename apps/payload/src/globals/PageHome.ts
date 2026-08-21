import { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { titleField } from '@/fields/titleField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'
import { urlFields } from '@/fields/urlFields'

export const PageHome: GlobalConfig = {
  slug: 'pageHome',
  label: {
    en: 'Home',
    fr: 'Accueil',
  },
  fields: [
    titleField(),
    ...urlFields({
      value: '',
    }),
    {
      name: 'presentation',
      type: 'group',
      label: {
        en: 'Presentation',
        fr: 'Présentation',
      },
      fields: [
        {
          name: 'catch',
          type: 'textarea',
          label: {
            en: 'Catch phrase',
            fr: 'Accroche',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
        },
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'text',
          virtual: true,
          hidden: true,
        },
      ],
    },
    {
      name: 'services',
      type: 'group',
      label: {
        en: 'Services',
        fr: 'Services',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            en: 'Title',
            fr: 'Titre',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
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
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
        },
        {
          name: 'link',
          type: 'text',
          virtual: true,
          hidden: true,
        },
      ],
    },
    {
      name: 'projects',
      type: 'group',
      label: {
        en: 'Projects',
        fr: 'Réalisations',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            en: 'Title',
            fr: 'Titre',
          },
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: {
            en: 'Link label',
            fr: 'Libellé du lien vers la page',
          },
        },
        {
          name: 'link',
          type: 'text',
          virtual: true,
          hidden: true,
        },
        {
          name: 'projectLinkLabel',
          type: 'text',
          label: {
            en: 'Project link label',
            fr: 'Libellé du lien vers le projet',
          },
        },
        {
          name: 'featured',
          type: 'array',
          virtual: true,
          label: {
            fr: 'Réalisations mises en avant',
            en: 'Featured projects',
          },
          labels: {
            singular: { fr: 'Réalisation', en: 'Project' },
            plural: { fr: 'Réalisations', en: 'Projects' },
          },
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'link',
              type: 'text',
              hidden: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
          admin: {
            description: {
              fr: 'Ajoutez une réalisation mis en avant en cochant la case "Mis en avant" sur la page de la réalisation.',
              en: 'Add a project to the featured project by checking the "Featured" checkbox on the project page.',
            },
          },
        },
        {
          name: 'goToProjects',
          type: 'ui',
          admin: {
            components: {
              Field: '@/components/GoToProjects',
            },
          },
        },
      ],
    },
  ],
  admin: {
    group: localizedLabels.groups.pages,
  },
  hooks: {
    afterChange: [invalidateRoutesManifestHook as GlobalAfterChangeHook],
    afterRead: [
      async ({ doc, req }) => {
        const presentation = await req.payload.findGlobal({
          slug: 'pagePresentation',
          locale: req.locale,
        })
        const services = await req.payload.findGlobal({
          slug: 'pageServices',
          locale: req.locale,
        })
        const pageProjects = await req.payload.findGlobal({
          slug: 'pageProjects',
          locale: req.locale,
        })
        doc.services.items = (services.sections || []).map(({ title, url }) => ({
          title,
          url,
        }))
        doc.presentation.link = presentation.url
        doc.services.link = services.url
        doc.projects.link = pageProjects.url

        const highlights = (
          await req.payload.find({
            collection: 'projects',
            locale: req.locale,
            draft: false,
            pagination: false,
            where: {
              featured: { equals: true },
            },
          })
        ).docs.map(({ mainImage, title, url }) => ({
          image: mainImage,
          title: title,
          link: url,
        }))

        doc.projects.featured = highlights
        return doc
      },
    ],
  },
}
