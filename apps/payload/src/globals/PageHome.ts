import { GlobalAfterChangeHook, GlobalConfig } from 'payload'
import { localizedLabels } from '@/i18n'
import { urlFields } from '@/fields/urlFields'
import { titleField } from '@/fields/titleField'
import { invalidateRoutesManifestHook } from '@/helpers/routes'

export const PageHome: GlobalConfig = {
  slug: 'pageHome',
  label: {
    en: 'Home',
    fr: 'Accueil',
  },
  fields: [
    titleField(),
    {
      name: 'url',
      type: 'text',
      defaultValue: '/',
      required: true,
      hidden: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'urlSlug',
      type: 'text',
      defaultValue: '',
      hidden: true,
      required: true,
      admin: {
        readOnly: true,
      },
    },
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
          name: 'highlightedProjects',
          type: 'array',
          label: {
            fr: 'Projets mis en avant',
          },
          labels: {
            singular: { fr: 'Projet' },
            plural: { fr: 'Projets' },
          },
          fields: [
            {
              name: 'project',
              type: 'relationship',
              relationTo: 'projects',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: {
                  en: 'By default the displayed image will be the main one from the project. It is possible to upload an alternative one.',
                  fr: "Par défaut, l'image affichée est l'image principale du projet. Il est possible de sélectionner une image alternative.",
                },
              },
            },
          ],
        },
        {
          name: 'highlights',
          type: 'array',
          virtual: true,
          fields: [
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'link',
              type: 'text',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
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
        const projects = await req.payload.findGlobal({
          slug: 'pageProjects',
          locale: req.locale,
        })

        doc.services.items = services.list

        doc.presentation.link = presentation.url
        doc.services.link = services.url
        doc.projects.link = projects.url

        const highlights = []

        for (let i = 0; i < doc.projects.highlightedProjects.length; i++) {
          const item = doc.projects.highlightedProjects[i]
          const page = await req.payload.findByID({
            collection: 'projects',
            id: typeof item.project === 'object' ? item.project.id : item.project,
            locale: req.locale,
          })

          if (!page) continue

          highlights.push({
            image: item.image,
            title: page.title,
            link: page.url,
          })
        }

        doc.projects.highlights = highlights

        return doc
      },
    ],
  },
}
