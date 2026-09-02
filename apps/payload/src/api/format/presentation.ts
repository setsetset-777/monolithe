import type * as API from '@monolithe/api/types'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { PagePresentation, Locale } from '@/types'
import { BasePayload } from 'payload'
import listPublishedCollection from '@/helpers/listPublishedCollection'

interface Props {
  payload: BasePayload
  locale: Locale
  res: PagePresentation
}

export const formatPresentationData = async ({
  res: { title: pageTitle, heroImage, monolithe, sections },
  payload,
  locale,
}: Props): Promise<{
  meta: API.Meta
  data: API.Presentation.Data
}> => {
  const [parutions, testimonials] = await Promise.all([
    listPublishedCollection({ slug: 'parutions', locale, payload }),
    listPublishedCollection({ slug: 'testimonials', locale, payload }),
  ])
  return {
    meta: {
      title: pageTitle,
    },
    data: {
      hero: {
        title: pageTitle,
        image: heroImage as API.Media,
        slug: 'pagePresentation',
      },
      presentation: convertLexicalToHTML({ data: monolithe! }),
      sections: (sections ?? []).map((section): API.Presentation.Section => {
        const { title } = section
        switch (section.blockType) {
          case 'textWithTitleBlock':
            const { text, image } = section
            return {
              type: section.blockType,
              title: title!,
              text: convertLexicalToHTML({ data: text! }),
              image: image as API.Media,
            }
          case 'listBlock':
            const { values } = section
            return {
              type: section.blockType,
              title: title!,
              values: (values ?? []).map(({ title }) => ({
                title: title!,
              })),
            }
          case 'parutionsBlock':
            return {
              type: section.blockType,
              title: title!,
              list: parutions.docs.map(({ title, publisher, date, link, thumbnail }) => {
                return {
                  title: title!,
                  publisher: publisher!,
                  date: date!,
                  link: link!,
                  thumbnail: thumbnail as API.Media,
                }
              }),
            }
          case 'testimonialsBlock':
            return {
              type: section.blockType,
              title: title!,
              list: testimonials.docs.map(({ name, description, company }) => {
                return {
                  name: name!,
                  description: description!,
                  company: company!,
                }
              }),
            }
        }
      }),
    },
  }
}
