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
          name: 'homeLinkLabel',
          type: 'text',
          label: {
            en: 'Home link label',
            fr: "Label pour le lien vers l'accueil",
          },
          admin: {
            description: {
              en: "This label is used for assistive technologies and won't be displayed",
              fr: "Ce label est destiné aux technologies d'assistance à la navigation et ne sera pas visible.",
            },
          },
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
          label: {
            en: 'Contact button label',
            fr: 'Label pour bouton de contact',
          },
        },
      ],
    },
  ],
}
