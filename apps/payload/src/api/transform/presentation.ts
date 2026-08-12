import type * as API from '@monolithe/api/types'
import type { PageSlug, PagePresentation } from '@/types'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

export const transformPresentationData = (
  { title: heroTitle, heroImage, monolithe, sections }: PagePresentation,
  slug: PageSlug,
): API.Presentation.Data => {
  return {
    hero: {
      title: heroTitle,
      image: heroImage as API.Media,
      slug: slug,
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
          const { parutionList } = section
          return {
            type: section.blockType,
            title: title!,
            list: (parutionList ?? []).map(({ parution }) => {
              const { title, publisher, type, date, link, thumbnail } = parution as API.Parution
              return {
                title: title!,
                publisher: publisher!,
                type: type!,
                date: date!,
                link: link!,
                thumbnail: thumbnail as API.Media,
              }
            }),
          }
        case 'testimonialsBlock':
          const { testimonialsList } = section
          return {
            type: section.blockType,
            title: title!,
            list: (testimonialsList ?? []).map(({ testimonial }) => {
              const { name, description, company } = testimonial as API.Testimonial
              return {
                name: name!,
                description: description!,
                company: company!,
              }
            }),
          }
      }
    }),
  }
}
